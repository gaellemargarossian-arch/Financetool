import { transactionService } from './transactionService';
import { accountService } from './accountService';
import { WeeklyInsight, MonthlyReport, Transaction } from '../types';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths, subWeeks, isWithinInterval } from 'date-fns';

export const insightsService = {
  async getWeeklyInsights(userId: string, weekStart?: Date): Promise<WeeklyInsight | null> {
    const now = new Date();
    const weekStartDate = weekStart || startOfWeek(now);
    const weekEndDate = endOfWeek(weekStartDate);
    
    const transactions = await transactionService.getUserTransactions(userId);
    const weekTransactions = transactions.filter(t => 
      isWithinInterval(t.date, { start: weekStartDate, end: weekEndDate })
    );
    
    if (weekTransactions.length === 0) return null;
    
    const expenses = weekTransactions.filter(t => t.type === 'expense');
    const incomes = weekTransactions.filter(t => t.type === 'income');
    
    const totalSpent = expenses.reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);
    
    // Calculate top categories
    const categoryMap = new Map<string, number>();
    expenses.forEach(t => {
      const current = categoryMap.get(t.category) || 0;
      categoryMap.set(t.category, current + t.amount);
    });
    
    const topCategories = Array.from(categoryMap.entries())
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
    
    const averageDailySpend = totalSpent / 7;
    
    // Find unusual transactions (high amount or high frequency)
    const avgAmount = totalSpent / expenses.length;
    const unusualTransactions = expenses.filter(t => 
      t.amount > avgAmount * 2 || 
      expenses.filter(e => e.merchant === t.merchant).length > 5
    );
    
    return {
      week: weekStartDate.toISOString(),
      totalSpent,
      totalIncome,
      topCategories,
      averageDailySpend,
      unusualTransactions,
    };
  },

  async getMonthlyReport(userId: string, month?: Date): Promise<MonthlyReport | null> {
    const now = month || new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const previousMonthStart = startOfMonth(subMonths(now, 1));
    const previousMonthEnd = endOfMonth(subMonths(now, 1));
    
    const transactions = await transactionService.getUserTransactions(userId);
    const monthTransactions = transactions.filter(t => 
      isWithinInterval(t.date, { start: monthStart, end: monthEnd })
    );
    const previousMonthTransactions = transactions.filter(t => 
      isWithinInterval(t.date, { start: previousMonthStart, end: previousMonthEnd })
    );
    
    if (monthTransactions.length === 0) return null;
    
    const expenses = monthTransactions.filter(t => t.type === 'expense');
    const incomes = monthTransactions.filter(t => t.type === 'income');
    
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);
    const netBalance = totalIncome - totalExpenses;
    
    // Category breakdown
    const categoryMap = new Map<string, number>();
    expenses.forEach(t => {
      const current = categoryMap.get(t.category) || 0;
      categoryMap.set(t.category, current + t.amount);
    });
    
    const categoryBreakdown = Array.from(categoryMap.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / totalExpenses) * 100,
      }))
      .sort((a, b) => b.amount - a.amount);
    
    // Trends
    const previousMonthExpenses = previousMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const change = totalExpenses - previousMonthExpenses;
    const changePercentage = previousMonthExpenses > 0 
      ? (change / previousMonthExpenses) * 100 
      : 0;
    
    // Generate insights
    const insights: string[] = [];
    
    if (changePercentage > 20) {
      insights.push(`Your spending increased by ${changePercentage.toFixed(1)}% compared to last month.`);
    } else if (changePercentage < -20) {
      insights.push(`Great job! Your spending decreased by ${Math.abs(changePercentage).toFixed(1)}% compared to last month.`);
    }
    
    const topCategory = categoryBreakdown[0];
    if (topCategory) {
      insights.push(`${topCategory.category} is your largest expense category at ${topCategory.percentage.toFixed(1)}% of total spending.`);
    }
    
    if (netBalance < 0) {
      insights.push(`You're spending more than you earn. Consider reviewing your expenses.`);
    } else if (netBalance > totalIncome * 0.2) {
      insights.push(`Excellent! You're saving ${((netBalance / totalIncome) * 100).toFixed(1)}% of your income.`);
    }
    
    return {
      month: monthStart.toISOString(),
      totalIncome,
      totalExpenses,
      netBalance,
      categoryBreakdown,
      trends: {
        previousMonth: previousMonthExpenses,
        change,
        changePercentage,
      },
      insights,
    };
  },

  async getDashboardSummary(userId: string): Promise<{
    netBalance: number;
    totalIncome: number;
    totalExpenses: number;
    topCategories: Array<{ category: string; amount: number }>;
  }> {
    const accounts = await accountService.getUserAccounts(userId);
    const transactions = await transactionService.getUserTransactions(userId);
    
    const netBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    
    const expenses = transactions.filter(t => t.type === 'expense');
    const incomes = transactions.filter(t => t.type === 'income');
    
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);
    
    // Top categories (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentExpenses = expenses.filter(t => t.date >= thirtyDaysAgo);
    const categoryMap = new Map<string, number>();
    recentExpenses.forEach(t => {
      const current = categoryMap.get(t.category) || 0;
      categoryMap.set(t.category, current + t.amount);
    });
    
    const topCategories = Array.from(categoryMap.entries())
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
    
    return {
      netBalance,
      totalIncome,
      totalExpenses,
      topCategories,
    };
  },
};

