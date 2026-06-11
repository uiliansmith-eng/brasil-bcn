import { HeroSection } from '@/components/home/HeroSection'
import { ElectionBanner } from '@/components/home/ElectionBanner'
import { LaunchSection } from '@/components/home/LaunchSection'
import { StatsSection } from '@/components/home/StatsSection'
import { CategoriesSection } from '@/components/home/CategoriesSection'
import { FeaturedJobsSection } from '@/components/home/FeaturedJobsSection'
import { FeaturedCompaniesSection } from '@/components/home/FeaturedCompaniesSection'
import { BrazilNewsSection } from '@/components/home/BrazilNewsSection'
import { CTASection } from '@/components/home/CTASection'
import { AdSlot } from '@/components/ads/AdSlot'
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ElectionBanner />
      <LaunchSection />
      <StatsSection />
      <AdSlot position="home_hero" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 mb-4" />
      <CategoriesSection />
      <FeaturedJobsSection />
      <FeaturedCompaniesSection />
      <BrazilNewsSection />
      <CTASection />
    </>
  )
}
