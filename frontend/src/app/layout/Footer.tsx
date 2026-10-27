const REPOSITORY_URL = 'https://github.com/Nha-Cong-Dong/PokeNexus'
const POKEAPI_URL = 'https://pokeapi.co'

const FOOTER_LINK_CLASS =
  'font-bold text-surface underline focus-visible:outline-surface hover:text-surface-muted'

export function Footer() {
  return (
    <footer className="bg-ink text-surface">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm md:flex-row md:items-center md:justify-between md:gap-8 md:px-6">
        <p className="max-w-prose text-surface/85">
          Dữ liệu từ{' '}
          <a href={POKEAPI_URL} className={FOOTER_LINK_CLASS} target="_blank" rel="noreferrer">
            PokéAPI
          </a>
          . Pokémon và các tên liên quan thuộc Nintendo, Game Freak và The Pokémon Company.
          PokeNexus là dự án phi thương mại.
        </p>
        <a
          href={REPOSITORY_URL}
          className={`inline-flex min-h-10 items-center self-start md:self-auto ${FOOTER_LINK_CLASS}`}
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </div>
    </footer>
  )
}
