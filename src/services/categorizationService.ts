import { collection, addDoc, updateDoc, doc, query, where, getDocs, getDoc, Timestamp, increment } from 'firebase/firestore';
import { db } from '../config/firebase';
import { CategorizationRule, Transaction } from '../types';
import { MERCHANT_CATEGORY_MAPPING } from '../constants/categories';

export const categorizationService = {
  async categorizeTransaction(merchant: string | undefined, userId: string): Promise<string> {
    if (!merchant) return 'Other';
    
    const merchantLower = merchant.toLowerCase().trim();
    
    // Check user-specific rules first
    const userRule = await this.getBestRuleForMerchant(merchantLower, userId);
    if (userRule) {
      await this.incrementRuleUsage(userRule.id);
      return userRule.category;
    }
    
    // Check default merchant mappings
    for (const [key, category] of Object.entries(MERCHANT_CATEGORY_MAPPING)) {
      if (merchantLower.includes(key)) {
        // Create a rule for future use
        await this.createRule(userId, merchantLower, category);
        return category;
      }
    }
    
    return 'Other';
  },

  async createRule(userId: string, merchant: string, category: string, subcategory?: string): Promise<string> {
    const ruleData: Omit<CategorizationRule, 'id'> = {
      userId,
      merchant: merchant.toLowerCase(),
      category,
      subcategory,
      confidence: 1.0,
      usageCount: 1,
      lastUsed: new Date(),
    };
    
    const docRef = await addDoc(collection(db, 'categorizationRules'), {
      ...ruleData,
      lastUsed: Timestamp.fromDate(ruleData.lastUsed),
    });
    
    return docRef.id;
  },

  async updateRule(ruleId: string, category: string, subcategory?: string): Promise<void> {
    const ruleRef = doc(db, 'categorizationRules', ruleId);
    await updateDoc(ruleRef, {
      category,
      subcategory,
      confidence: 1.0,
      lastUsed: Timestamp.now(),
    });
  },

  async incrementRuleUsage(ruleId: string): Promise<void> {
    const ruleRef = doc(db, 'categorizationRules', ruleId);
    await updateDoc(ruleRef, {
      usageCount: increment(1),
      lastUsed: Timestamp.now(),
    });
  },

  async getBestRuleForMerchant(merchant: string, userId: string): Promise<CategorizationRule | null> {
    const q = query(
      collection(db, 'categorizationRules'),
      where('userId', '==', userId),
      where('merchant', '==', merchant.toLowerCase())
    );
    
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    
    // Get the rule with highest confidence and usage
    let bestRule: CategorizationRule | null = null;
    let bestScore = 0;
    
    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      const rule = {
        id: doc.id,
        ...data,
        lastUsed: data.lastUsed?.toDate() || new Date(),
      } as CategorizationRule;
      
      const score = rule.confidence * rule.usageCount;
      if (score > bestScore) {
        bestScore = score;
        bestRule = rule;
      }
    });
    
    return bestRule;
  },

  async learnFromCorrection(transaction: Transaction, correctedCategory: string): Promise<void> {
    if (!transaction.merchant) return;
    
    const merchant = transaction.merchant.toLowerCase();
    const existingRule = await this.getBestRuleForMerchant(merchant, transaction.userId);
    
    if (existingRule) {
      // Update existing rule
      await this.updateRule(existingRule.id, correctedCategory);
    } else {
      // Create new rule
      await this.createRule(transaction.userId, merchant, correctedCategory);
    }
  },

  async getUserRules(userId: string): Promise<CategorizationRule[]> {
    const q = query(
      collection(db, 'categorizationRules'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        lastUsed: data.lastUsed?.toDate() || new Date(),
      } as CategorizationRule;
    });
  },
};

