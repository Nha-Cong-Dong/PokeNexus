import { Link } from 'react-router'

import { Reveal } from '../../../components/motion/Reveal'

import { buttonClassName } from '../../../components/ui/buttonStyles'
import { Aura, Blob, Spark } from './SectionDecor'

const SPEAKER_DOTS = Array.from({ length: 24 }, (_, index) => index)

export function ClosingCta() {
  return (
    <section
      aria-labelledby="cta-title"
      className="relative -mb-20 overflow-hidden bg-linear-to-b from-band-violet to-bg px-4 pt-8 pb-28 md:px-6 md:pt-[60px] md:pb-[120px]"
    >
      <Aura>
        <Blob className="top-0 -left-[30%] size-[440px] from-type-water/30 md:-top-[10%] md:left-[10%] md:size-[700px]" />
        <Blob
          drift="b"
          className="-right-[8%] -bottom-[20%] hidden size-[620px] from-dex-red/16 md:block"
        />
      </Aura>
      <div aria-hidden="true">
        <Spark
          className="top-3.5 left-2.5 w-5 fill-dex-yellow md:top-[60px] md:left-[5%] md:w-6"
          style={{ animationDelay: '0.6s' }}
        />
        <Spark
          className="top-[30px] right-[4%] w-[18px] fill-type-psychic max-md:hidden"
          style={{ animationDelay: '1.7s' }}
        />
      </div>
      <Reveal
        variant="zoom"
        className="relative mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] border-3 border-ink bg-dex-red px-5 pt-9 pb-6 text-white shadow-[inset_0_-6px_0_var(--color-dex-red-hover),0_6px_0_rgb(22_33_62/0.25)] md:rounded-[40px] md:border-4 md:px-12 md:py-16 md:shadow-[inset_0_-8px_0_var(--color-dex-red-hover),0_8px_0_rgb(22_33_62/0.25)]"
      >
        <span
          aria-hidden="true"
          className="absolute right-12 bottom-10 grid grid-cols-[repeat(6,10px)] gap-2 opacity-50 max-md:hidden"
        >
          {SPEAKER_DOTS.map((dot) => (
            <span key={dot} className="size-2.5 rounded-full bg-ink" />
          ))}
        </span>
        <span
          aria-hidden="true"
          className="absolute -top-[42px] -right-[42px] size-[124px] rounded-full border-6 border-white bg-radial-[at_34%_30%] from-white from-10% via-primary via-40% to-primary-hover shadow-[0_0_0_4px_var(--color-ink)] md:-top-[60px] md:-right-[60px] md:size-[300px] md:border-10 md:opacity-95 md:shadow-[0_0_0_6px_var(--color-ink)]"
        />
        <div className="relative max-w-180">
          <h2
            id="cta-title"
            className="pr-[66px] font-display text-display font-normal [text-shadow:4px_4px_0_var(--color-ink)] md:pr-0 md:text-[3.25rem]/[3.625rem]"
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
