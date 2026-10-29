import { Link } from 'react-router'

import { Reveal } from '../../../components/motion/Reveal'

import { buttonClassName } from '../../../components/ui/buttonStyles'

export function ClosingCta() {
  return (
    <section aria-labelledby="cta-title" className="bg-bg px-4 pt-8 pb-16 md:px-6 md:pb-24">
      <Reveal
        variant="zoom"
        className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border-3 border-ink bg-dex-red px-6 py-10 text-white shadow-block-lg md:px-12 md:py-14"
      >
        <span
          aria-hidden="true"
          className="absolute -top-16 -right-16 size-56 rounded-full border-6 border-white bg-radial-[at_34%_30%] from-white from-10% via-primary via-40% to-primary-hover shadow-[0_0_0_3px_var(--color-ink)] md:size-72"
        />
        <div className="relative max-w-2xl">
          <h2
            id="cta-title"
            className="font-display text-display font-normal [text-shadow:4px_4px_0_var(--color-ink)] md:text-[3.25rem]/[3.625rem]"
          >
            Sẵn sàng cho trận tới?
          </h2>
          <p className="mt-4 max-w-[46ch] text-lg/7">
            Tra cứu một Pokémon, kiểm tra lỗ hổng của đội, rồi gửi link đội cho đồng đội trước giờ
            thi đấu.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/pokedex" className={buttonClassName('cta')}>
              Mở Pokédex
            </Link>
            <Link to="/team-builder" className={buttonClassName('secondary')}>
              Xây đội ngay
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
