export interface Product {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  longDescription: string;
  price: number;
  weight: string;
  rating: number;
  reviewsCount: number;
  image: string;
  ingredients: string[];
  benefits: string[];
  origin: string;
  usageInstructions: string;
  isFeatured?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Benefit {
  id: string;
  iconName: 'leaf' | 'hand' | 'heart' | 'map';
  title: string;
  description: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  location: string;
  rating: number;
  productUsed: string;
  avatarUrl: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type RequestStatus = 'pendiente' | 'contactada' | 'completada';

export interface CustomerRequest {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerCity?: string;
  customerAddress?: string;
  productId: string;
  productName: string;
  quantity: number;
  notes?: string;
  status: RequestStatus;
  total: number;
  createdAt: string;
  updatedAt?: string;
}

export interface SiteHeroContent {
  eyebrow: string;
  headlineMain: string;
  headlineAccent: string;
  headlineEnd: string;
  description: string;
  primaryCtaText: string;
  secondaryCtaText: string;
}

export interface SiteFeaturedContent {
  eyebrow: string;
  title: string;
  quote: string;
  description: string;
  ctaText: string;
}

export interface SiteAboutContent {
  eyebrow: string;
  title: string;
  paragraph: string;
  quote: string;
}

export interface SiteFinalCtaContent {
  eyebrow: string;
  headline: string;
  headlineAccent: string;
  description: string;
  buttonText: string;
}

export interface SiteContent {
  id?: string;
  hero: SiteHeroContent;
  benefits: Benefit[];
  featured: SiteFeaturedContent;
  about: SiteAboutContent;
  testimonial: TestimonialItem;
  finalCta: SiteFinalCtaContent;
  updatedAt?: string;
}

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  role: 'superadmin' | 'admin';
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface AnalyticsEvent {
  id?: string;
  eventType: 'page_view' | 'cta_click' | 'product_view' | 'request_submit';
  target: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export type AdminSection = 
  | 'dashboard'
  | 'prices'
  | 'products'
  | 'requests'
  | 'content'
  | 'analytics'
  | 'admins';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
