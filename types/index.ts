export type {
  UserRole, JobType, JobCategory, CompanyCategory, EventCategory, GuideCategory, AdPosition,
  ListingCategory, ListingCondition, StoreItemType, StorePlan, CouponDiscountType,
  Profile, Company, Job, Event, Guide, Advertisement, Listing, StoreItem, Coupon,
  JobWithCompany, CompanyWithOwner, EventWithOrganizer, ListingWithSeller, StoreWithItems,
  QuizStatus, Quiz, QuizResult, QuizQuestion, QuizAnswer, QuizEventType, QuizEvent,
  QuestionWithAnswers, QuizWithContent,
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
