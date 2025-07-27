import { CreditPackage, Subscription } from '@/types';

export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: 'basic',
    name: 'Basis Paket',
    credits: 10,
    price: 49,
  },
  {
    id: 'standard',
    name: 'Standard Paket',
    credits: 25,
    price: 99,
    discountPercent: 20,
  },
  {
    id: 'premium',
    name: 'Premium Paket',
    credits: 50,
    price: 179,
    discountPercent: 27,
  },
  {
    id: 'premium_plus',
    name: 'Premium+ Paket',
    credits: 100,
    price: 299,
    discountPercent: 40,
    isPremiumOnly: true,
  },
];

export const SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'premium_monthly',
    name: 'Premium Monatsabo',
    price: 29.90,
    billingCycle: 'monthly',
    features: [
      'Exklusiver Vorab-Zugang zu neuen Projekten (24h früher)',
      'Höhere Sichtbarkeit im Unternehmenskatalog',
      'Premium-Badge im öffentlichen Profil',
      '20% Rabatt auf Credit-Pakete',
    ],
    creditDiscount: 20,
  },
  {
    id: 'premium_yearly',
    name: 'Premium Jahresabo',
    price: 299,
    billingCycle: 'yearly',
    features: [
      'Exklusiver Vorab-Zugang zu neuen Projekten (24h früher)',
      'Höhere Sichtbarkeit im Unternehmenskatalog',
      'Premium-Badge im öffentlichen Profil',
      '30% Rabatt auf Credit-Pakete',
      '2 Monate gratis im Vergleich zum Monatsabo',
    ],
    creditDiscount: 30,
  },
];