import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs, getDoc, Timestamp, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Transaction, TransactionType } from '../types';
import { accountService } from './accountService';

export const transactionService = {
  async createTransaction(userId: string, transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const transactionData = {
      ...transaction,
      userId,
      date: Timestamp.fromDate(transaction.date),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    
    const docRef = await addDoc(collection(db, 'transactions'), transactionData);
    
    // Update account balance
    if (transaction.type === 'expense') {
      const account = await accountService.getAccount(transaction.accountId);
      if (account) {
        await accountService.updateAccountBalance(transaction.accountId, account.balance - transaction.amount);
      }
    } else if (transaction.type === 'income') {
      const account = await accountService.getAccount(transaction.accountId);
      if (account) {
        await accountService.updateAccountBalance(transaction.accountId, account.balance + transaction.amount);
      }
    }
    
    return docRef.id;
  },

  async updateTransaction(transactionId: string, updates: Partial<Transaction>): Promise<void> {
    const transactionRef = doc(db, 'transactions', transactionId);
    const transaction = await this.getTransaction(transactionId);
    
    if (!transaction) return;
    
    const updateData: any = {
      ...updates,
      updatedAt: Timestamp.now(),
    };
    
    if (updates.date) {
      updateData.date = Timestamp.fromDate(updates.date);
    }
    
    await updateDoc(transactionRef, updateData);
    
    // Recalculate account balance if amount changed
    if (updates.amount !== undefined) {
      const account = await accountService.getAccount(transaction.accountId);
      if (account) {
        // Revert old transaction
        const oldAmount = transaction.type === 'expense' ? transaction.amount : -transaction.amount;
        const newAmount = updates.type === 'expense' ? updates.amount : -updates.amount;
        const diff = oldAmount - newAmount;
        await accountService.updateAccountBalance(transaction.accountId, account.balance + diff);
      }
    }
  },

  async deleteTransaction(transactionId: string): Promise<void> {
    const transaction = await this.getTransaction(transactionId);
    if (!transaction) return;
    
    // Revert account balance
    if (transaction.type === 'expense') {
      const account = await accountService.getAccount(transaction.accountId);
      if (account) {
        await accountService.updateAccountBalance(transaction.accountId, account.balance + transaction.amount);
      }
    } else if (transaction.type === 'income') {
      const account = await accountService.getAccount(transaction.accountId);
      if (account) {
        await accountService.updateAccountBalance(transaction.accountId, account.balance - transaction.amount);
      }
    }
    
    await deleteDoc(doc(db, 'transactions', transactionId));
  },

  async getTransaction(transactionId: string): Promise<Transaction | null> {
    const transactionRef = doc(db, 'transactions', transactionId);
    const transactionSnap = await getDoc(transactionRef);
    if (!transactionSnap.exists()) return null;
    
    const data = transactionSnap.data();
    return {
      id: transactionSnap.id,
      ...data,
      date: data.date?.toDate() || new Date(),
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Transaction;
  },

  async getUserTransactions(userId: string, limitCount?: number): Promise<Transaction[]> {
    let q = query(
      collection(db, 'transactions'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Transaction;
    });
  },

  async getTransactionsByAccount(accountId: string): Promise<Transaction[]> {
    const q = query(
      collection(db, 'transactions'),
      where('accountId', '==', accountId),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Transaction;
    });
  },

  async getTransactionsByCategory(userId: string, category: string, startDate?: Date, endDate?: Date): Promise<Transaction[]> {
    let q = query(
      collection(db, 'transactions'),
      where('userId', '==', userId),
      where('category', '==', category),
      orderBy('date', 'desc')
    );
    
    if (startDate) {
      q = query(q, where('date', '>=', Timestamp.fromDate(startDate)));
    }
    if (endDate) {
      q = query(q, where('date', '<=', Timestamp.fromDate(endDate)));
    }
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Transaction;
    });
  },
};

