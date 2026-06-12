import { HeroSection } from '@/components/home/HeroSection'
import { ElectionBanner } from '@/components/home/ElectionBanner'
import { LaunchSection } from '@/components/home/LaunchSection'
import { StatsSection } from '@/components/home/StatsSection'
import { FeaturedJobsSection } from '@/components/home/FeaturedJobsSection'
import { FeaturedCompaniesSection } from '@/components/home/FeaturedCompaniesSection'
import { BrazilNewsSection } from '@/components/home/BrazilNewsSection'
import { CTASection } from '@/components/home/CTASection'
import { AdSlot } from '@/components/ads/AdSlot'
import { getSettings } from '@/actions/settings'

export const revalidate = 1800

export default async function HomePage() {
  const settings = await getSettings()
  const sec = settings.sections

  return (
    <>
      <HeroSection settings={settings.hero} brand={settings.brand} />
      {sec.election_banner && <ElectionBanner />}
      {sec.launch_section && <LaunchSection settings={settings.launch} />}
      {sec.stats && <StatsSection />}
      {sec.ad_slot && (
        <AdSlot position="home_hero" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 mb-4" />
      )}
      {sec.jobs && <FeaturedJobsSection />}
      {sec.companies && <FeaturedCompaniesSection />}
      {sec.news && <BrazilNewsSection />}
      {sec.cta && <CTASection />}
    </>
  )
}
