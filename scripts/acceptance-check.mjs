import { spawn } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { parseArgs } from 'node:util'

const { values: options } = parseArgs({
  options: {
    base: { type: 'string', default: 'https://pokenexus.pages.dev' },
    api: { type: 'string', default: 'https://pokenexus-api-s6g6.onrender.com/api/v1' },
    chrome: { type: 'string' },
    'rate-limit': { type: 'boolean', default: false },
    'skip-ui': { type: 'boolean', default: false },
  },
})

const BASE = options.base.replace(/\/$/, '')
const API = options.api.replace(/\/$/, '')
const DEMO_TEAM = [6, 130, 149, 663, 637]
const EXCADRILL_ID = 530
const ROUTES = [
  '/',
  '/pokedex',
  '/pokemon/garchomp',
  '/types',
  '/compare?left=garchomp&right=salamence',
  '/team-builder?ids=6,130,149,663,637',
  '/team/AbCd1234',
  '/terrain/volcano',
  '/khong-ton-tai',
]
const ALLOWED_CONSOLE_ERRORS = [/\/teams\/shared\/AbCd1234/]
const MOBILE_HEIGHT_BUDGET_PX = 7000
const LONG_PRESS_MS = 1500

const results = []
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function record(id, name, ok, detail = '') {
  results.push({ id, name, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${id}  ${name}${detail ? `  (${detail})` : ''}`)
}

async function check(id, name, run) {
  try {
    const outcome = await run()
    record(id, name, outcome.ok, outcome.detail)
  } catch (error) {
    record(id, name, false, error.message)
  }
}

async function api(path, init = {}) {
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init.headers ?? {}) },
  })
  const text = await response.text()
  return { status: response.status, headers: response.headers, body: text ? JSON.parse(text) : null }
}

const post = (path, body, headers = {}) =>
  api(path, { method: 'POST', body: JSON.stringify(body), headers })

async function waitForBackend() {
  const deadline = Date.now() + 240_000
  while (Date.now() < deadline) {
    try {
      const health = await api('/health')
      if (health.status === 200) return health
    } catch {
      await sleep(5000)
    }
    await sleep(2000)
  }
  throw new Error('backend did not answer /health within 4 minutes')
}

async function runApiChecks() {
  await check('A1', 'health UP with 1351 Pokémon', async () => {
    const started = Date.now()
    const health = await waitForBackend()
    return {
      ok: health.body.status === 'UP' && health.body.pokemonCount === 1351,
      detail: `${JSON.stringify(health.body)}, ${Math.round((Date.now() - started) / 1000)} s`,
    }
  })
  await check('A2', 'Dragon gen 4 list contains Garchomp', async () => {
    const list = await api('/pokemon?type=dragon&gen=4')
    const names = list.body.content.map((pokemon) => pokemon.name)
    return { ok: names.includes('garchomp'), detail: names.join(', ') }
  })
  await check('A3', 'compare Garchomp and Salamence', async () => {
    const compare = await api('/pokemon/compare?left=garchomp&right=salamence')
    return { ok: compare.status === 200 && compare.body.left.name === 'garchomp', detail: `${compare.status}` }
  })
  await check('A4', 'demo team scores 20 with Rock as a critical hole', async () => {
    const analysis = await post('/synergy/analyze', { pokemonIds: DEMO_TEAM })
    const rock = JSON.stringify(analysis.body).match(/"attackingType":"rock"[^}]*"criticalHole":(true|false)/)
    return {
      ok: analysis.body.teamScore === 20 && rock?.[1] === 'true',
      detail: `teamScore ${analysis.body.teamScore}, rock criticalHole ${rock?.[1]}`,
    }
  })
  await check('A5', 'excluding legendaries recommends Excadrill first', async () => {
    const recommendations = await post('/synergy/recommendations', {
      pokemonIds: DEMO_TEAM,
      excludeLegendary: true,
    })
    const first = recommendations.body.items?.[0] ?? recommendations.body.recommendations?.[0]
    return { ok: first?.name === 'excadrill', detail: `first ${first?.name}` }
  })
  await check('A6', 'adding Excadrill raises the score to 48', async () => {
    const analysis = await post('/synergy/analyze', { pokemonIds: [...DEMO_TEAM, EXCADRILL_ID] })
    return { ok: analysis.body.teamScore === 48, detail: `teamScore ${analysis.body.teamScore}` }
  })
  await check('A7', 'search returns Mega and Gmax forms with formCategory (#82)', async () => {
    const forms = ['DEFAULT', 'REGIONAL', 'MEGA', 'GMAX', 'OTHER'].map((form) => `form=${form}`).join('&')
    const search = await api(`/pokemon/search?q=charizard&${forms}`)
    const pairs = search.body.map((pokemon) => `${pokemon.name}:${pokemon.formCategory}`)
    return {
      ok: pairs.includes('charizard-mega-x:MEGA') && pairs.includes('charizard-gmax:GMAX'),
      detail: pairs.join(', '),
    }
  })
  await check('A8', 'Zygarde lists 4 forms without Power Construct (#81)', async () => {
    const detail = await api('/pokemon/zygarde-50')
    const names = detail.body.forms.map((form) => form.name)
    return {
      ok: names.length === 4 && !names.some((name) => name.includes('power-construct')),
      detail: names.join(', '),
    }
  })
  await check('A9', 'CORS allows only the Pages origin', async () => {
    const preflight = (origin) =>
      fetch(`${API}/synergy/analyze`, {
        method: 'OPTIONS',
        headers: { Origin: origin, 'Access-Control-Request-Method': 'POST' },
      })
    const allowed = await preflight(BASE)
    const denied = await preflight('https://evil.example')
    return {
      ok: allowed.headers.get('access-control-allow-origin') === BASE && denied.status === 403,
      detail: `pages ${allowed.status}, other origin ${denied.status}`,
    }
  })
  if (options['rate-limit']) await runRateLimitChecks()
}

async function runRateLimitChecks() {
  const probe = { name: 'rate-limit-probe', members: [{ slot: 1, pokemonId: 999999 }] }
  const rounds = [
    ['A10', 'X-Forwarded-For', (i) => `203.0.113.${i}`],
    ['A11', 'CF-Connecting-IP', (i) => `198.51.100.${i}`],
    ['A12', 'Forwarded', (i) => `for=192.0.2.${i}`],
  ]
  for (const [id, header, value] of rounds) {
    await check(id, `spoofed ${header} cannot bypass the save limit (#89)`, async () => {
      const statuses = []
      for (let i = 1; i <= 11; i += 1) {
        statuses.push((await post('/teams', probe, { [header]: value(i) })).status)
      }
      await sleep(65_000)
      return { ok: statuses.slice(0, 10).every((s) => s === 400) && statuses[10] === 429, detail: statuses.join(' ') }
    })
  }
}

function findChrome() {
  const candidates = [
    options.chrome,
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ].filter(Boolean)
  const found = candidates.find((path) => existsSync(path))
  if (!found) throw new Error('Chrome not found; pass --chrome <path> or set CHROME_PATH')
  return found
}

async function launchBrowser() {
  const profile = mkdtempSync(join(tmpdir(), 'pokenexus-acceptance-'))
  const chrome = spawn(findChrome(), [
    '--headless=new',
    '--remote-debugging-port=0',
    `--user-data-dir=${profile}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--hide-scrollbars',
    'about:blank',
  ])
  const portFile = join(profile, 'DevToolsActivePort')
  for (let i = 0; i < 100 && !existsSync(portFile); i += 1) await sleep(100)
  const port = readFileSync(portFile, 'utf8').split('\n')[0]
  return {
    port,
    close() {
      chrome.kill()
      setTimeout(() => rmSync(profile, { recursive: true, force: true }), 1000)
    },
  }
}

async function openPage(port, { width, height, touch = false }) {
  const target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json()
  const socket = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((resolve) => socket.addEventListener('open', resolve, { once: true }))
  let nextId = 1
  const pending = new Map()
  const consoleErrors = []
  let inflight = 0
  let lastNetwork = Date.now()
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data)
    if (message.id && pending.has(message.id)) {
      pending.get(message.id)(message.result ?? { error: message.error })
      pending.delete(message.id)
      return
    }
    if (message.method === 'Runtime.exceptionThrown') {
      consoleErrors.push(message.params.exceptionDetails.exception?.description ?? message.params.exceptionDetails.text)
    } else if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') {
      consoleErrors.push(message.params.args.map((arg) => arg.value ?? arg.description).join(' '))
    } else if (message.method === 'Log.entryAdded' && message.params.entry.level === 'error') {
      consoleErrors.push(`${message.params.entry.text} ${message.params.entry.url ?? ''}`)
    } else if (message.method === 'Network.requestWillBeSent') {
      inflight += 1
      lastNetwork = Date.now()
    } else if (message.method === 'Network.loadingFinished' || message.method === 'Network.loadingFailed') {
      inflight = Math.max(0, inflight - 1)
      lastNetwork = Date.now()
    }
  })
  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const id = nextId++
      pending.set(id, resolve)
      socket.send(JSON.stringify({ id, method, params }))
    })
  await send('Page.enable')
  await send('Runtime.enable')
  await send('Network.enable')
  await send('Log.enable')
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 })
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  if (touch) await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 1 })
  return {
    consoleErrors,
    async goto(path) {
      consoleErrors.length = 0
      inflight = 0
      const started = Date.now()
      await send('Page.navigate', { url: `${BASE}${path}` })
      await sleep(1500)
      while (Date.now() - started < 30_000 && (inflight > 0 || Date.now() - lastNetwork < 1500)) await sleep(200)
    },
    async evaluate(expression) {
      const response = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
      if (response.exceptionDetails) throw new Error(response.exceptionDetails.exception?.description ?? 'evaluate failed')
      return response.result?.value
    },
    mouseMove: (x, y) => send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y }),
    touchStart: (x, y) => send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] }),
    touchEnd: () => send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }),
    close: () => socket.close(),
  }
}

const PAGE_STATE = `(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  innerWidth: window.innerWidth,
  h1: document.querySelectorAll('h1').length,
  errorStates: [...document.querySelectorAll('[role="alert"]')].filter((el) => /Thử lại/.test(el.textContent)).length,
}))()`

const DETAIL_LINK = `(() => {
  const link = [...document.querySelectorAll('a')].find((a) => a.textContent.includes('Xem thông tin chi tiết'));
  return { href: link ? link.getAttribute('href') : null, path: location.pathname };
})()`

const FIRST_MEMBER_CENTER = `(() => {
  const card = document.querySelector('[data-testid="member-detail-trigger"]');
  card.scrollIntoView({ block: 'center' });
  const rect = card.getBoundingClientRect();
  return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
})()`

async function runUiChecks(port) {
  for (const width of [375, 1440]) {
    const page = await openPage(port, { width, height: width < 600 ? 812 : 900 })
    for (const route of ROUTES) {
      await check(`U1`, `${route} at ${width} px: no horizontal scroll, one h1, no error state or console error`, async () => {
        await page.goto(route)
        const state = await page.evaluate(PAGE_STATE)
        const errors = page.consoleErrors.filter((text) => !ALLOWED_CONSOLE_ERRORS.some((pattern) => pattern.test(text)))
        return {
          ok: state.scrollWidth <= state.innerWidth && state.h1 === 1 && state.errorStates === 0 && errors.length === 0,
          detail: `scrollWidth ${state.scrollWidth}/${state.innerWidth}, h1 ${state.h1}, error states ${state.errorStates}, console ${errors.length}${errors.length ? `: ${errors[0].slice(0, 120)}` : ''}`,
        }
      })
    }
    page.close()
  }

  const mobile = await openPage(port, { width: 375, height: 812 })
  await check('U2', 'Pokédex list at 375 px keeps type badges beside the name (#80)', async () => {
    await mobile.goto('/pokedex?view=list')
    const rows = await mobile.evaluate(`(() => [...document.querySelectorAll('[data-testid="dex-row-heading"]')].map((heading) => {
      const types = heading.parentElement.querySelector('[data-testid="dex-row-types"]').getBoundingClientRect();
      const name = heading.getBoundingClientRect();
      return types.top < name.bottom && name.top < types.bottom && types.left >= name.right - 1;
    }))()`)
    return { ok: rows.length > 0 && rows.every(Boolean), detail: `${rows.filter(Boolean).length}/${rows.length} rows` }
  })
  await check('U3', `overview at 375 px is at most ${MOBILE_HEIGHT_BUDGET_PX} px tall (#84)`, async () => {
    await mobile.goto('/')
    const height = await mobile.evaluate('document.documentElement.scrollHeight')
    return { ok: height <= MOBILE_HEIGHT_BUDGET_PX, detail: `${height} px` }
  })
  await check('U4', 'Team Builder search tags Mega and Gmax suggestions (#82)', async () => {
    await mobile.goto('/team-builder?ids=445')
    const options = await mobile.evaluate(`(async () => {
      const input = document.querySelector('input[role="combobox"]');
      const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      input.focus();
      setValue.call(input, 'charizard');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return [...document.querySelectorAll('[role="option"]')].map((option) => option.innerText.replace(/\\s+/g, ' ').trim());
    })()`)
    return {
      ok: options.some((text) => /Mega X.*Mega/.test(text)) && options.some((text) => /Gmax.*Gmax/.test(text)),
      detail: options.join(' | '),
    }
  })
  mobile.close()

  const touch = await openPage(port, { width: 375, height: 812, touch: true })
  await check('U5', 'team card opens details only after a 1.5 s touch hold (#83)', async () => {
    await touch.goto('/team-builder?ids=445,6,130')
    const center = await touch.evaluate(FIRST_MEMBER_CENTER)
    await sleep(500)
    await touch.touchStart(center.x, center.y)
    await sleep(300)
    await touch.touchEnd()
    await sleep(700)
    const afterTap = await touch.evaluate(DETAIL_LINK)
    await touch.touchStart(center.x, center.y)
    await sleep(LONG_PRESS_MS - 500)
    const beforeHold = await touch.evaluate(DETAIL_LINK)
    await sleep(800)
    const afterHold = await touch.evaluate(DETAIL_LINK)
    await touch.touchEnd()
    return {
      ok: afterTap.href === null && beforeHold.href === null && afterHold.href === '/pokemon/garchomp' && afterHold.path === '/team-builder',
      detail: `tap ${afterTap.href}, 1.0 s ${beforeHold.href}, 1.8 s ${afterHold.href}`,
    }
  })
  touch.close()

  const desktop = await openPage(port, { width: 1440, height: 900 })
  await check('U6', 'team card shows the detail link on mouse hover (#83)', async () => {
    await desktop.goto('/team-builder?ids=445,6,130')
    const center = await desktop.evaluate(FIRST_MEMBER_CENTER)
    await sleep(500)
    const before = await desktop.evaluate(DETAIL_LINK)
    await desktop.mouseMove(center.x, center.y)
    await sleep(500)
    const hover = await desktop.evaluate(DETAIL_LINK)
    await desktop.mouseMove(5, 5)
    await sleep(500)
    const after = await desktop.evaluate(DETAIL_LINK)
    return {
      ok: before.href === null && hover.href === '/pokemon/garchomp' && after.href === null,
      detail: `before ${before.href}, hover ${hover.href}, leave ${after.href}`,
    }
  })
  desktop.close()

  const short = await openPage(port, { width: 1230, height: 580 })
  await check('U7', 'overview hero fits a 1230 x 580 screen and regions use 5 columns (#84)', async () => {
    await short.goto('/')
    const layout = await short.evaluate(`(() => {
      const box = (el) => el && el.getBoundingClientRect();
      const inside = (a, f) => a.top >= f.top - 1 && a.bottom <= f.bottom + 1 && a.left >= f.left - 1 && a.right <= f.right + 1;
      const hero = document.querySelector('section[aria-labelledby="landing-title"]');
      const frame = box(hero.querySelector('.animate-boot'));
      const links = [...hero.querySelectorAll('a')];
      const parts = {
        title: box(document.querySelector('#landing-title').parentElement),
        artwork: box(hero.querySelector('figure .type-blob')),
        open: box(links.find((a) => a.textContent.trim() === 'Mở Pokédex')),
        build: box(links.find((a) => a.textContent.trim() === 'Xây đội ngay')),
      };
      const clipped = Object.entries(parts).filter(([, rect]) => !rect || !inside(rect, frame)).map(([name]) => name);
      const cards = [...document.querySelectorAll('section[aria-labelledby="regions-title"] ul > li')];
      return { clipped, columns: new Set(cards.map((card) => Math.round(card.getBoundingClientRect().left))).size };
    })()`)
    return { ok: layout.clipped.length === 0 && layout.columns === 5, detail: `clipped [${layout.clipped}], columns ${layout.columns}` }
  })
  short.close()
}

console.log(`PokeNexus acceptance check\n  frontend ${BASE}\n  api      ${API}\n`)
await runApiChecks()
if (!options['skip-ui']) {
  const browser = await launchBrowser()
  try {
    await runUiChecks(browser.port)
  } finally {
    browser.close()
  }
}
const failed = results.filter((result) => !result.ok)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
process.exit(failed.length === 0 ? 0 : 1)
