export type UserType = 'customer' | 'business';

export interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  newProjects: boolean;
  projectUpdates: boolean;
  messages: boolean;
  reviews: boolean;
  marketing: boolean;
  weeklyDigest: boolean;
}

export interface PrivacySettings {
  profileVisible: boolean;
  showEmail: boolean;
  showPhone: boolean;
  dataCollection: boolean;
  analytics: boolean;
  marketing: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  userType: UserType;
  createdAt: string;
  location?: Location;
  logo?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  canton?: string;
  preferredContactMethod?: 'email' | 'phone' | 'both';
  profileImage?: string;
  notificationSettings?: NotificationSettings;
  privacySettings?: PrivacySettings;
}

export interface Customer extends User {
  userType: 'customer';
  firstName: string;
  lastName: string;
  phone?: string;
  gender?: 'male' | 'female';
  projects: string[]; // Project IDs
}

export interface Business extends User {
  userType: 'business';
  description?: string;
  logo?: string;
  gallery?: string[];
  services: string[]; // Service IDs
  categories: string[]; // Category names that the business offers
  rating: number;
  reviewCount: number;
  isPremium: boolean;
  credits: number;
  canton: string;
}

export interface Location {
  address: string;
  city: string;
  canton: string;
  postalCode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Service {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  type?: string;
  surfaces?: string[];
  materials?: string[];
  icon: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  service: Service;
  location: Location;
  timeframe: {
    start: string;
    end?: string;
  };
  budget?: {
    min: number;
    max: number;
  };
  images?: string[];
  status: 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  customerId: string;
  businessId?: string;
  createdAt: string;
  updatedAt: string;
  area?: string;
  viewCount: number;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface Review {
  id: string;
  projectId: string;
  customerId: string;
  businessId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  discountPercent?: number;
  isPremiumOnly?: boolean;
}

export interface Subscription {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  creditDiscount: number;
}