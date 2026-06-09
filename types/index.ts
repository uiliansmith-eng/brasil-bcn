export type {
  UserRole, JobType, JobCategory, CompanyCategory, EventCategory, GuideCategory, AdPosition,
  ListingCategory, ListingCondition,
  Profile, Company, Job, Event, Guide, Advertisement, Listing,
  JobWithCompany, CompanyWithOwner, EventWithOrganizer, ListingWithSeller,
  Database,
} from './database'

export interface NavItem {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  badge?: string
}

export interface SiteConfig {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    instagram: string
    whatsapp: string
  }
}
