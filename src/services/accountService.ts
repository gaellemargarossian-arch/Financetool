import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Account, AccountType } from '../types';

export const accountService = {
  async createAccount(userId: string, account: Omit<Account, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const accountData = {
      ...account,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    const docRef = await addDoc(collection(db, 'accounts'), accountData);
    return docRef.id;
  },

  async updateAccount(accountId: string, updates: Partial<Account>): Promise<void> {
    const accountRef = doc(db, 'accounts', accountId);
    await updateDoc(accountRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  },

  async deleteAccount(accountId: string): Promise<void> {
    await deleteDoc(doc(db, 'accounts', accountId));
  },

  async getAccount(accountId: string): Promise<Account | null> {
    const accountRef = doc(db, 'accounts', accountId);
    const accountSnap = await getDoc(accountRef);
    if (!accountSnap.exists()) return null;
    
    const data = accountSnap.data();
    return {
      id: accountSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Account;
  },

  async getUserAccounts(userId: string): Promise<Account[]> {
    const q = query(collection(db, 'accounts'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Account;
    });
  },

  async updateAccountBalance(accountId: string, newBalance: number): Promise<void> {
    await this.updateAccount(accountId, { balance: newBalance });
  },
};

