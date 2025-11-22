import { formatCurrency } from '../i18n';

/**
 * Format a number as currency
 */
export const formatMoney = (amount: number, currency: string = 'AED'): string => {
  return formatCurrency(amount, currency);
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

/**
 * Get color based on percentage (for progress bars)
 */
export const getProgressColor = (percentage: number): string => {
  if (percentage >= 100) return '#FF6B6B'; // Red - over budget
  if (percentage >= 80) return '#FFA07A'; // Orange - warning
  return '#4ECDC4'; // Teal - good
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Get start and end dates for a period
 */
export const getPeriodDates = (period: 'weekly' | 'monthly' | 'yearly'): { start: Date; end: Date } => {
  const now = new Date();
  let start: Date;
  let end: Date;

  if (period === 'weekly') {
    start = new Date(now);
    start.setDate(now.getDate() - now.getDay()); // Start of week
    end = new Date(start);
    end.setDate(start.getDate() + 6);
  } else if (period === 'monthly') {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  } else {
    // yearly
    start = new Date(now.getFullYear(), 0, 1);
    end = new Date(now.getFullYear(), 11, 31);
  }

  return { start, end };
};

