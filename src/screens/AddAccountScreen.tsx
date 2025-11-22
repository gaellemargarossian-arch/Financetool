import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../config/firebase';
import { accountService } from '../services/accountService';
import { AccountType } from '../types';
import i18n from '../i18n';

export default function AddAccountScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('bank');
  const [balance, setBalance] = useState('');

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter an account name');
      return;
    }

    const balanceNum = parseFloat(balance) || 0;
    const user = auth.currentUser;
    if (!user) return;

    try {
      await accountService.createAccount(user.uid, {
        name: name.trim(),
        type,
        balance: balanceNum,
        currency: 'AED',
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to create account');
    }
  };

  const accountTypes: { label: string; value: AccountType }[] = [
    { label: 'Bank', value: 'bank' },
    { label: 'Credit Card', value: 'credit_card' },
    { label: 'Cash', value: 'cash' },
    { label: 'Loan', value: 'loan' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>{i18n.t('accounts.accountName')}</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Emirates NBD"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>{i18n.t('accounts.accountType')}</Text>
        <View style={styles.typeContainer}>
          {accountTypes.map((accountType) => (
            <TouchableOpacity
              key={accountType.value}
              style={[
                styles.typeButton,
                type === accountType.value && styles.typeButtonActive,
              ]}
              onPress={() => setType(accountType.value)}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  type === accountType.value && styles.typeButtonTextActive,
                ]}
              >
                {accountType.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>{i18n.t('accounts.balance')}</Text>
        <TextInput
          style={styles.input}
          placeholder="0.00"
          value={balance}
          onChangeText={setBalance}
          keyboardType="decimal-pad"
        />

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
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  typeButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    paddingHorizontal: 20,
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

