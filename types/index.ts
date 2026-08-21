export type {
  UserRole, JobType, JobCategory, CompanyCategory, EventCategory, GuideCategory, AdPosition,
  ListingCategory, ListingCondition, StoreItemType, StorePlan, CouponDiscountType,
  CompanyStatus, StoreModuleKey, StoreEmployeeRole,
  OrderStatus, OrderPaymentStatus, FulfillmentMethod, PaymentStatus, ReservationStatus,
  QrCodeStatus, PromotionScope, SubscriptionStatus, BillingPeriod,
  Profile, Company, Job, Event, Guide, Advertisement, Listing, StoreItem, Coupon,
  StoreCategory, StoreSubcategory, StoreModule, StoreEmployee,
  Order, OrderItem, Payment, Reservation, StoreAvailability, QrCode, CouponRedemption,
  Review, Favorite, Notification, Promotion, SubscriptionPlan, Subscription,
  StoreAnalyticsEvent, AuditLog,
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
