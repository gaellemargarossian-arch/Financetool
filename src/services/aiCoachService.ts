import { openai, AI_MODEL } from '../config/openai';
import { transactionService } from './transactionService';
import { accountService } from './accountService';
import { budgetService } from './budgetService';
import { insightsService } from './insightsService';
import { Transaction, Account, BudgetProgress } from '../types';
import { formatCurrency } from '../i18n';

export const aiCoachService = {
  async askQuestion(userId: string, question: string): Promise<string> {
    try {
      // Gather user's financial data
      const accounts = await accountService.getUserAccounts(userId);
      const transactions = await transactionService.getUserTransactions(userId);
      const budgets = await budgetService.getUserBudgets(userId);
      const budgetProgresses = await Promise.all(
        budgets.map(b => budgetService.getBudgetProgress(b.id))
      );
      const dashboardSummary = await insightsService.getDashboardSummary(userId);
      
      // Prepare context for AI
      const context = this.prepareContext(
        accounts,
        transactions,
        budgets,
        budgetProgresses.filter((p): p is BudgetProgress => p !== null),
        dashboardSummary
      );
      
      const prompt = `You are a helpful financial coach for a personal finance app user in Dubai, UAE. 
The user's financial data is provided below. Answer their question in a friendly, concise, and actionable way.
Use AED currency format when mentioning amounts.

User's Financial Data:
${context}

User's Question: ${question}

Provide a helpful, specific answer based on the data above. If the question cannot be answered with the available data, say so politely.`;

      const completion = await openai.chat.completions.create({
        model: AI_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful financial coach assistant for a personal finance app. Provide clear, actionable advice based on the user\'s financial data.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      });
      
      return completion.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response. Please try again.';
    } catch (error) {
      console.error('AI Coach error:', error);
      return 'I apologize, but I encountered an error. Please check your OpenAI API key and try again.';
    }
  },

  prepareContext(
    accounts: Account[],
    transactions: Transaction[],
    budgets: any[],
    budgetProgresses: BudgetProgress[],
    dashboardSummary: any
  ): string {
    let context = `Net Balance: ${formatCurrency(dashboardSummary.netBalance, 'AED')}\n`;
    context += `Total Income: ${formatCurrency(dashboardSummary.totalIncome, 'AED')}\n`;
    context += `Total Expenses: ${formatCurrency(dashboardSummary.totalExpenses, 'AED')}\n\n`;
    
    context += `Accounts (${accounts.length}):\n`;
    accounts.forEach(acc => {
      context += `- ${acc.name} (${acc.type}): ${formatCurrency(acc.balance, acc.currency)}\n`;
    });
    
    context += `\nRecent Transactions (last 10):\n`;
    transactions.slice(0, 10).forEach(t => {
      context += `- ${t.date.toLocaleDateString()}: ${t.type} ${formatCurrency(t.amount, t.currency)} - ${t.category}${t.merchant ? ` (${t.merchant})` : ''}\n`;
    });
    
    context += `\nTop Spending Categories:\n`;
    dashboardSummary.topCategories.forEach((cat: any) => {
      context += `- ${cat.category}: ${formatCurrency(cat.amount, 'AED')}\n`;
    });
    
    if (budgetProgresses.length > 0) {
      context += `\nBudget Status:\n`;
      budgetProgresses.forEach(progress => {
        const budget = budgets.find(b => b.id === progress.budgetId);
        if (budget) {
          context += `- ${budget.category || 'Overall'}: ${progress.percentage.toFixed(1)}% used (${formatCurrency(progress.spent, 'AED')} / ${formatCurrency(budget.amount, 'AED')})\n`;
        }
      });
    }
    
    return context;
  },

  async getSuggestions(userId: string): Promise<string[]> {
    const dashboardSummary = await insightsService.getDashboardSummary(userId);
    const budgets = await budgetService.getUserBudgets(userId);
    const budgetProgresses = await Promise.all(
      budgets.map(b => budgetService.getBudgetProgress(b.id))
    );
    
    const suggestions: string[] = [];
    
    // Budget alerts
    budgetProgresses.forEach(progress => {
      if (progress.alertTriggered && !progress.isOverBudget) {
        const budget = budgets.find(b => b.id === progress.budgetId);
        if (budget) {
          suggestions.push(`You've used ${progress.percentage.toFixed(0)}% of your ${budget.category || 'overall'} budget.`);
        }
      }
    });
    
    // Spending insights
    if (dashboardSummary.netBalance < 0) {
      suggestions.push('You\'re spending more than you earn. Consider reviewing your expenses.');
    }
    
    const topCategory = dashboardSummary.topCategories[0];
    if (topCategory && topCategory.amount > dashboardSummary.totalExpenses * 0.3) {
      suggestions.push(`${topCategory.category} accounts for ${((topCategory.amount / dashboardSummary.totalExpenses) * 100).toFixed(0)}% of your spending.`);
    }
    
    return suggestions;
  },
};

