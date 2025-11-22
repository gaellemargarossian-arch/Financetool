export type AccountType = 'bank' | 'credit_card' | 'cash' | 'loan';

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TransactionType = 'expense' | 'income' | 'transfer';

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  merchant?: string;
  category: string;
  subcategory?: string;
  description: string;
  date: Date;
  isRecurring: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  nameAr?: string;
  icon?: string;
  color?: string;
  parentCategory?: string;
  isDefault: boolean;
}

export interface Budget {
  id: string;
  userId: string;
  category?: string;
  amount: number;
  currency: string;
  period: 'monthly' | 'weekly' | 'yearly';
  startDate: Date;
  endDate?: Date;
  alertThreshold: number; // Percentage (e.g., 80)
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetProgress {
  budgetId: string;
  spent: number;
  remaining: number;
  percentage: number;
  isOverBudget: boolean;
  alertTriggered: boolean;
}

export interface CategorizationRule {
  id: string;
  userId: string;
  merchant: string;
  category: string;
  subcategory?: string;
  confidence: number; // 0-1
  usageCount: number;
  lastUsed: Date;
}

export interface WeeklyInsight {
  week: string;
  totalSpent: number;
  totalIncome: number;
  topCategories: Array<{ category: string; amount: number }>;
  averageDailySpend: number;
  unusualTransactions: Transaction[];
}

export interface MonthlyReport {
  month: string;
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  categoryBreakdown: Array<{ category: string; amount: number; percentage: number }>;
  trends: {
    previousMonth: number;
    change: number;
    changePercentage: number;
  };
  insights: string[];
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  language: 'en' | 'ar';
  currency: string;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface NotificationSettings {
  userId: string;
  budgetAlerts: boolean;
  billReminders: boolean;
  weeklySummaries: boolean;
  goalMilestones: boolean;
  alertThreshold: number;
}

