import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../config/firebase';
import { transactionService } from '../services/transactionService';
import { accountService } from '../services/accountService';
import { categorizationService } from '../services/categorizationService';
import { Account, TransactionType } from '../types';
import { DEFAULT_CATEGORIES } from '../constants/categories';
import i18n from '../i18n';

export default function AddTransactionScreen() {
  const navigation = useNavigation();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountId, setAccountId] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [merchant, setMerchant] = useState('');
  const [category, setCategory] = useState('Other');
  const [description, setDescription] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringPattern, setRecurringPattern] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    if (merchant) {
      autoCategorize();
    }
  }, [merchant]);

  const loadAccounts = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userAccounts = await accountService.getUserAccounts(user.uid);
      setAccounts(userAccounts);
      if (userAccounts.length > 0) {
        setAccountId(userAccounts[0].id);
      }
    } catch (error) {
      console.error('Error loading accounts:', error);
    }
  };

  const autoCategorize = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const suggestedCategory = await categorizationService.categorizeTransaction(merchant, user.uid);
      setCategory(suggestedCategory);
    } catch (error) {
      console.error('Error auto-categorizing:', error);
    }
  };

  const handleSave = async () => {
    if (!accountId) {
      Alert.alert('Error', 'Please select an account');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const user = auth.currentUser;
    if (!user) return;

    try {
      await transactionService.createTransaction(user.uid, {
        accountId,
        type,
        amount: parseFloat(amount),
        currency: 'AED',
        merchant: merchant.trim() || undefined,
        category,
        description: description.trim() || merchant.trim() || category,
        date: new Date(),
        isRecurring,
        recurringPattern: isRecurring ? recurringPattern : undefined,
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to create transaction');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>Account</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={accountId}
            onValueChange={setAccountId}
            style={styles.picker}
          >
            {accounts.map((account) => (
              <Picker.Item
                key={account.id}
                label={`${account.name} (${account.type})`}
                value={account.id}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>{i18n.t('transactions.type')}</Text>
        <View style={styles.typeContainer}>
          {(['expense', 'income', 'transfer'] as TransactionType[]).map((transactionType) => (
            <TouchableOpacity
              key={transactionType}
              style={[
                styles.typeButton,
                type === transactionType && styles.typeButtonActive,
              ]}
              onPress={() => setType(transactionType)}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  type === transactionType && styles.typeButtonTextActive,
                ]}
              >
                {i18n.t(`transactions.${transactionType}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>{i18n.t('transactions.amount')}</Text>
        <TextInput
          style={styles.input}
          placeholder="0.00"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>{i18n.t('transactions.merchant')}</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Carrefour"
          value={merchant}
          onChangeText={setMerchant}
        />

        <Text style={styles.label}>{i18n.t('transactions.category')}</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            onValueChange={setCategory}
            style={styles.picker}
          >
            {DEFAULT_CATEGORIES.map((cat) => (
              <Picker.Item
                key={cat.name}
                label={cat.name}
                value={cat.name}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>{i18n.t('transactions.description')}</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Optional description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />

        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setIsRecurring(!isRecurring)}
        >
          <View style={[styles.checkbox, isRecurring && styles.checkboxChecked]}>
            {isRecurring && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>{i18n.t('transactions.recurring')}</Text>
        </TouchableOpacity>

        {isRecurring && (
          <>
            <Text style={styles.label}>{i18n.t('transactions.recurringPattern')}</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={recurringPattern}
                onValueChange={(value) => setRecurringPattern(value)}
                style={styles.picker}
              >
                <Picker.Item label="Daily" value="daily" />
                <Picker.Item label="Weekly" value="weekly" />
                <Picker.Item label="Monthly" value="monthly" />
                <Picker.Item label="Yearly" value="yearly" />
              </Picker>
            </View>
          </>
        )}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>{i18n.t('common.save')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  typeButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  typeButtonActive: {
    borderColor: '#4ECDC4',
    backgroundColor: '#4ECDC4',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4ECDC4',
    borderColor: '#4ECDC4',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 30,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

