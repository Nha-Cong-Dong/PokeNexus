import { useRef } from 'react'

import { usePauseOffscreen } from '../components/motion/usePauseOffscreen'
import { ClosingCta } from '../features/landing/components/ClosingCta'
import { DailyPokemon } from '../features/landing/components/DailyPokemon'
import { FeatureRegions } from '../features/landing/components/FeatureRegions'
import { GenerationChart } from '../features/landing/components/GenerationChart'
import { LandingHero } from '../features/landing/components/LandingHero'
import { TeamSteps } from '../features/landing/components/TeamSteps'
import { TrainerQuiz } from '../features/landing/components/TrainerQuiz'
import { TypeTicker } from '../features/landing/components/TypeTicker'
import { TypeWheel } from '../features/landing/components/TypeWheel'

export function LandingPage() {
  const blocksRef = useRef<HTMLDivElement>(null)
  usePauseOffscreen(blocksRef)

  return (
    <div ref={blocksRef} className="overflow-x-clip">
      <LandingHero />
      <TypeTicker />
      <FeatureRegions />
      <TypeWheel />
      <DailyPokemon />
      <TeamSteps />
      <GenerationChart />
      <TrainerQuiz />
      <ClosingCta />
    </div>
  )
}
