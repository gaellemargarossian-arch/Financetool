import { Category } from '../types';

// UAE-specific default categories
export const DEFAULT_CATEGORIES: Omit<Category, 'id' | 'userId'>[] = [
  // Housing
  { name: 'Rent', nameAr: 'إيجار', icon: 'home', color: '#FF6B6B', isDefault: true },
  { name: 'DEWA', nameAr: 'ديوا', icon: 'zap', color: '#4ECDC4', isDefault: true },
  { name: 'Internet', nameAr: 'إنترنت', icon: 'wifi', color: '#45B7D1', isDefault: true },
  { name: 'Maintenance', nameAr: 'صيانة', icon: 'tool', color: '#FFA07A', isDefault: true },
  
  // Transportation
  { name: 'Car Payment', nameAr: 'قسط السيارة', icon: 'car', color: '#95E1D3', isDefault: true },
  { name: 'Fuel', nameAr: 'وقود', icon: 'droplet', color: '#F38181', isDefault: true },
  { name: 'Parking', nameAr: 'موقف سيارات', icon: 'square', color: '#AA96DA', isDefault: true },
  { name: 'Taxi/Uber', nameAr: 'تاكسي/أوبر', icon: 'navigation', color: '#FCBAD3', isDefault: true },
  
  // Food & Dining
  { name: 'Groceries', nameAr: 'بقالة', icon: 'shopping-cart', color: '#A8E6CF', isDefault: true },
  { name: 'Restaurants', nameAr: 'مطاعم', icon: 'utensils', color: '#FFD3A5', isDefault: true },
  { name: 'Coffee', nameAr: 'قهوة', icon: 'coffee', color: '#FD9853', isDefault: true },
  
  // Utilities & Services
  { name: 'Telecom', nameAr: 'اتصالات', icon: 'phone', color: '#A8DADC', isDefault: true },
  { name: 'Insurance', nameAr: 'تأمين', icon: 'shield', color: '#457B9D', isDefault: true },
  { name: 'Healthcare', nameAr: 'رعاية صحية', icon: 'heart', color: '#E63946', isDefault: true },
  
  // Shopping & Entertainment
  { name: 'Shopping', nameAr: 'تسوق', icon: 'shopping-bag', color: '#FFB6C1', isDefault: true },
  { name: 'Entertainment', nameAr: 'ترفيه', icon: 'film', color: '#FFD700', isDefault: true },
  { name: 'Gym', nameAr: 'نادي رياضي', icon: 'activity', color: '#32CD32', isDefault: true },
  
  // Financial
  { name: 'Credit Card Payment', nameAr: 'دفع بطاقة ائتمان', icon: 'credit-card', color: '#9370DB', isDefault: true },
  { name: 'Loan Payment', nameAr: 'دفع قرض', icon: 'dollar-sign', color: '#FF6347', isDefault: true },
  { name: 'Savings', nameAr: 'مدخرات', icon: 'piggy-bank', color: '#20B2AA', isDefault: true },
  
  // Other
  { name: 'Education', nameAr: 'تعليم', icon: 'book', color: '#4169E1', isDefault: true },
  { name: 'Charity', nameAr: 'صدقة', icon: 'gift', color: '#FF1493', isDefault: true },
  { name: 'Other', nameAr: 'أخرى', icon: 'more-horizontal', color: '#808080', isDefault: true },
];

export const MERCHANT_CATEGORY_MAPPING: Record<string, string> = {
  'carrefour': 'Groceries',
  'lulu': 'Groceries',
  'spinneys': 'Groceries',
  'waitrose': 'Groceries',
  'starbucks': 'Coffee',
  'costa': 'Coffee',
  'tim hortons': 'Coffee',
  'adnoc': 'Fuel',
  'enoc': 'Fuel',
  'emirates nbd': 'Bank',
  'adcb': 'Bank',
  'dubai islamic bank': 'Bank',
  'etisalat': 'Telecom',
  'du': 'Telecom',
  'virgin mobile': 'Telecom',
};

