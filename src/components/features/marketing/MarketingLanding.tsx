import { AnimatedBlobs } from '@/components/features/auth/AnimatedBlobs'
import { MarketingNav } from './MarketingNav'
import { HeroSection } from './HeroSection'
import { FeaturesSection } from './FeaturesSection'
import { HowItWorksSection } from './HowItWorksSection'
import { ShowcaseSection } from './ShowcaseSection'
import { TestimonialSection } from './TestimonialSection'
import { FinalCtaSection } from './FinalCtaSection'
import { MarketingFooter } from './MarketingFooter'

export function MarketingLanding() {
  return (
    <>
      <AnimatedBlobs />
      <MarketingNav />
      <main className="flex flex-col">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ShowcaseSection />
        <TestimonialSection />
        <FinalCtaSection />
      </main>
      <MarketingFooter />
    </>
  )
}
