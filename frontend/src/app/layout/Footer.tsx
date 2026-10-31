import { useState, type ReactNode } from 'react'
import { Link } from 'react-router'

import { PokemonSprite } from '../../components/pokemon/PokemonSprite'
import { formatPokemonName } from '../../lib/formatters'
import { pickFooterPokemon } from './footerPokemon'
import { NAV_ITEMS } from './navItems'

const REPOSITORY_URL = 'https://github.com/Nha-Cong-Dong/PokeNexus'
const POKEAPI_URL = 'https://pokeapi.co'
const CONTACT_TITLE_ID = 'footer-contact-title'

const FOCUS_ON_DARK = 'focus-visible:outline-white'
const TEXT_LINK = `rounded-sm font-bold text-white underline underline-offset-2 hover:text-dex-yellow ${FOCUS_ON_DARK}`

type Contact = {
  label: string
  detail: string
  href: string
  external: boolean
  icon: ReactNode
}

const CONTACTS: readonly Contact[] = [
  {
    label: 'Facebook',
    detail: 'nguyen.khanh.76624',
    href: 'https://www.facebook.com/nguyen.khanh.76624',
    external: true,
    icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  },
  {
    label: 'Email',
    detail: 'nguyenqkhanhlc2006@gmail.com',
    href: 'mailto:nguyenqkhanhlc2006@gmail.com',
    external: false,
    icon: (
      <>
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </>
    ),
  },
  {
    label: 'GitHub',
    detail: 'NgQKhanh2906',
    href: 'https://github.com/NgQKhanh2906',
    external: true,
    icon: (
      <>
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
      </>
    ),
  },
]

function PokemonParade() {
  const [pokemon] = useState(() => pickFooterPokemon())

  return (
    <div className="relative z-10 mx-auto flex max-w-7xl justify-center px-4 md:justify-end md:px-6">
      <ul aria-label="Pokémon ghé thăm" className="-mb-9 flex items-end gap-1 md:-mb-14 md:gap-3">
        {pokemon.map((entry) => {
          const name = formatPokemonName(entry.name)
          return (
            <li key={entry.id}>
              <Link
                to={`/pokemon/${entry.name}`}
                aria-label={`Xem ${name}`}
                className="group relative block rounded-2xl focus-visible:outline-dex-yellow"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full rounded-full bg-scrim px-2.5 py-1 text-xs font-extrabold whitespace-nowrap text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  {name}
                </span>
                <PokemonSprite
                  id={entry.id}
                  alt=""
                  variant="artwork"
                  size={112}
                  className="size-20 object-contain drop-shadow-lg transition-transform duration-200 ease-out group-hover:-translate-y-2.5 group-focus-visible:-translate-y-2.5 md:size-28"
                />
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function ContactLink({ contact }: { contact: Contact }) {
  return (
    <a
      href={contact.href}
      {...(contact.external ? { target: '_blank', rel: 'noreferrer' } : {})}
      className={`group flex min-h-11 items-center gap-3 rounded-xl py-1 ${FOCUS_ON_DARK}`}
    >
      <span className="grid size-10 flex-none place-items-center rounded-full bg-white/10 text-white transition-colors duration-150 group-hover:bg-dex-yellow group-hover:text-scrim">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-5 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]"
        >
          {contact.icon}
        </svg>
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="font-extrabold text-white">{contact.label}</span>
        <span className="text-sm [overflow-wrap:anywhere] text-white/70 group-hover:text-white">
          {contact.detail}
        </span>
      </span>
    </a>
  )
}

export function Footer() {
  return (
    <footer className="text-white">
      <div className="relative">
        <PokemonParade />
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="block h-12 w-full fill-scrim md:h-20"
        >
          <path d="M0 80V58c180 0 300-16 480-28 220-12 340-24 560-26h400v76z" />
        </svg>
      </div>
      <div className="bg-scrim">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 pt-6 pb-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.8fr)_minmax(0,1fr)] md:gap-10 md:px-6 md:pt-2">
          <div className="flex flex-col items-start gap-3">
            <Link
              to="/"
              className={`flex min-h-10 items-center gap-2.5 rounded-[10px] ${FOCUS_ON_DARK}`}
            >
              <span
                aria-hidden="true"
                className="size-7 rounded-full border-3 border-white bg-radial-[at_35%_30%] from-white from-10% via-dex-red via-40% to-dex-red-hover"
              />
              <span className="font-display text-3xl">PokeNexus</span>
            </Link>
            <p className="max-w-[40ch] text-white/80">
              Bách khoa Pokémon và công cụ phân tích đội hình VGC: tra chỉ số, tương khắc, so sánh
              và dựng đội 6 thành viên.
            </p>
          </div>
          <nav aria-label="Điều hướng chân trang">
            <h2 className="font-extrabold text-dex-yellow">Khám phá</h2>
            <ul className="mt-2 grid grid-cols-2 gap-x-4 md:grid-cols-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`inline-flex min-h-10 items-center rounded-sm font-bold text-white/85 hover:text-dex-yellow ${FOCUS_ON_DARK}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h2 id={CONTACT_TITLE_ID} className="font-extrabold text-dex-yellow">
              Liên hệ
            </h2>
            <ul aria-labelledby={CONTACT_TITLE_ID} className="mt-2 flex flex-col gap-1.5">
              {CONTACTS.map((contact) => (
                <li key={contact.label}>
                  <ContactLink contact={contact} />
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/15">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-sm text-white/75 md:flex-row md:items-center md:justify-between md:gap-8 md:px-6">
            <p className="max-w-prose">
              Dữ liệu từ{' '}
              <a href={POKEAPI_URL} className={TEXT_LINK} target="_blank" rel="noreferrer">
                PokéAPI
              </a>
              . Pokémon và các tên liên quan thuộc Nintendo, Game Freak và The Pokémon Company.
              PokeNexus là dự án phi thương mại.
            </p>
            <a
              href={REPOSITORY_URL}
              className={`inline-flex min-h-10 items-center self-start md:self-auto ${TEXT_LINK}`}
              target="_blank"
              rel="noreferrer"
            >
              Mã nguồn
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
