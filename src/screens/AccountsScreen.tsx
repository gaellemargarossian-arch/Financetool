import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../config/firebase';
import { accountService } from '../services/accountService';
import { Account } from '../types';
import { formatCurrency } from '../i18n';
import i18n from '../i18n';

export default function AccountsScreen() {
  const navigation = useNavigation();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadAccounts = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userAccounts = await accountService.getUserAccounts(user.uid);
      setAccounts(userAccounts);
    } catch (error) {
      console.error('Error loading accounts:', error);
    }
  };

  useEffect(() => {
    loadAccounts();
    const unsubscribe = navigation.addListener('focus', loadAccounts);
    return unsubscribe;
  }, [navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAccounts();
    setRefreshing(false);
  };

  const getAccountTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      bank: 'Bank',
      credit_card: 'Credit Card',
      cash: 'Cash',
      loan: 'Loan',
    };
    return labels[type] || type;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {accounts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{i18n.t('accounts.noAccounts')}</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('AddAccount' as never)}
            >
              <Text style={styles.addButtonText}>{i18n.t('accounts.addFirstAccount')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          accounts.map((account) => (
            <View key={account.id} style={styles.accountCard}>
              <View style={styles.accountHeader}>
                <Text style={styles.accountName}>{account.name}</Text>
                <Text style={styles.accountType}>{getAccountTypeLabel(account.type)}</Text>
              </View>
              <Text style={styles.accountBalance}>
                {formatCurrency(account.balance, account.currency)}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddAccount' as never)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 15,
  },
  accountCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  accountName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  accountType: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
  },
  accountBalance: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 20,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 10,
    padding: 15,
    paddingHorizontal: 30,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

