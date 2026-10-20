const REPOSITORY_URL = 'https://github.com/Nha-Cong-Dong/PokeNexus'
const POKEAPI_URL = 'https://pokeapi.co'

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-text-muted md:flex-row md:items-center md:justify-between">
        <p>
          Nguồn dữ liệu{' '}
          <a
            href={POKEAPI_URL}
            className="underline hover:text-text"
            target="_blank"
            rel="noreferrer"
          >
            PokéAPI
          </a>
          . Pokémon thuộc bản quyền của Nintendo, Game Freak và The Pokémon Company; dự án phi
          thương mại.
        </p>
        <a
          href={REPOSITORY_URL}
          className="underline hover:text-text"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </div>
    </footer>
  )
}
