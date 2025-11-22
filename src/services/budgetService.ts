import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Budget, BudgetProgress } from '../types';
import { transactionService } from './transactionService';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';

export const budgetService = {
  async createBudget(userId: string, budget: Omit<Budget, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const budgetData = {
      ...budget,
      userId,
      startDate: Timestamp.fromDate(budget.startDate),
      endDate: budget.endDate ? Timestamp.fromDate(budget.endDate) : null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    const docRef = await addDoc(collection(db, 'budgets'), budgetData);
    return docRef.id;
  },

  async updateBudget(budgetId: string, updates: Partial<Budget>): Promise<void> {
    const budgetRef = doc(db, 'budgets', budgetId);
    const updateData: any = {
      ...updates,
      updatedAt: Timestamp.now(),
    };
    
    if (updates.startDate) {
      updateData.startDate = Timestamp.fromDate(updates.startDate);
    }
    if (updates.endDate) {
      updateData.endDate = Timestamp.fromDate(updates.endDate);
    }
    
    await updateDoc(budgetRef, updateData);
  },

  async deleteBudget(budgetId: string): Promise<void> {
    await deleteDoc(doc(db, 'budgets', budgetId));
  },

  async getBudget(budgetId: string): Promise<Budget | null> {
    const budgetRef = doc(db, 'budgets', budgetId);
    const budgetSnap = await getDoc(budgetRef);
    if (!budgetSnap.exists()) return null;
    
    const data = budgetSnap.data();
    return {
      id: budgetSnap.id,
      ...data,
      startDate: data.startDate?.toDate() || new Date(),
      endDate: data.endDate?.toDate(),
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Budget;
  },

  async getUserBudgets(userId: string): Promise<Budget[]> {
    const q = query(collection(db, 'budgets'), where('userId', '==', userId), where('isActive', '==', true));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        startDate: data.startDate?.toDate() || new Date(),
        endDate: data.endDate?.toDate(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Budget;
    });
  },

  async getBudgetProgress(budgetId: string): Promise<BudgetProgress | null> {
    const budget = await this.getBudget(budgetId);
    if (!budget) return null;
    
    const now = new Date();
    let startDate: Date;
    let endDate: Date;
    
    if (budget.period === 'monthly') {
      startDate = startOfMonth(now);
      endDate = endOfMonth(now);
    } else if (budget.period === 'weekly') {
      startDate = startOfWeek(now);
      endDate = endOfWeek(now);
    } else {
      // yearly
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31);
    }
    
    let spent = 0;
    
    if (budget.category) {
      const transactions = await transactionService.getTransactionsByCategory(
        budget.userId,
        budget.category,
        startDate,
        endDate
      );
      spent = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    } else {
      // Overall budget
      const transactions = await transactionService.getUserTransactions(budget.userId);
      spent = transactions
        .filter(t => t.type === 'expense' && t.date >= startDate && t.date <= endDate)
        .reduce((sum, t) => sum + t.amount, 0);
    }
    
    const remaining = budget.amount - spent;
    const percentage = (spent / budget.amount) * 100;
    const isOverBudget = spent > budget.amount;
    const alertTriggered = percentage >= budget.alertThreshold;
    
    return {
      budgetId,
      spent,
      remaining,
      percentage,
      isOverBudget,
      alertTriggered,
    };
  },

  async getAllBudgetProgresses(userId: string): Promise<BudgetProgress[]> {
    const budgets = await this.getUserBudgets(userId);
    const progresses = await Promise.all(
      budgets.map(budget => this.getBudgetProgress(budget.id))
    );
    return progresses.filter((p): p is BudgetProgress => p !== null);
  },
};

