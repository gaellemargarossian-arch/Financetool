import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../config/firebase';
import { insightsService } from '../services/insightsService';
import { transactionService } from '../services/transactionService';
import { formatCurrency } from '../i18n';
import i18n from '../i18n';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen() {
  const navigation = useNavigation();
  const [summary, setSummary] = useState<any>(null);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [weeklyInsights, setWeeklyInsights] = useState<any>(null);

  const loadData = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const [dashboardSummary, transactions, insights] = await Promise.all([
        insightsService.getDashboardSummary(user.uid),
        transactionService.getUserTransactions(user.uid, 10),
        insightsService.getWeeklyInsights(user.uid),
      ]);

      setSummary(dashboardSummary);
      setRecentTransactions(transactions);
      setWeeklyInsights(insights);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const chartData = summary?.topCategories?.slice(0, 5).map((cat: any, index: number) => ({
    name: cat.category,
    amount: cat.amount,
    color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#95E1D3'][index % 5],
    legendFontColor: '#333',
    legendFontSize: 12,
  })) || [];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.content}>
        {/* Net Balance Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>{i18n.t('dashboard.netBalance')}</Text>
          <Text style={styles.netBalance}>
            {summary ? formatCurrency(summary.netBalance, 'AED') : 'AED 0.00'}
          </Text>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.card, styles.summaryCard]}>
            <Text style={styles.summaryLabel}>{i18n.t('dashboard.totalIncome')}</Text>
            <Text style={styles.summaryAmount}>
              {summary ? formatCurrency(summary.totalIncome, 'AED') : 'AED 0.00'}
            </Text>
          </View>
          <View style={[styles.card, styles.summaryCard]}>
            <Text style={styles.summaryLabel}>{i18n.t('dashboard.totalExpenses')}</Text>
            <Text style={[styles.summaryAmount, styles.expenseAmount]}>
              {summary ? formatCurrency(summary.totalExpenses, 'AED') : 'AED 0.00'}
            </Text>
          </View>
        </View>

        {/* Top Categories Chart */}
        {chartData.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{i18n.t('dashboard.topCategories')}</Text>
            <PieChart
              data={chartData}
              width={screenWidth - 60}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        )}

        {/* Weekly Insights */}
        {weeklyInsights && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{i18n.t('dashboard.weeklyInsights')}</Text>
            <Text style={styles.insightText}>
              Average daily spend: {formatCurrency(weeklyInsights.averageDailySpend, 'AED')}
            </Text>
            <Text style={styles.insightText}>
              Total this week: {formatCurrency(weeklyInsights.totalSpent, 'AED')}
            </Text>
          </View>
        )}

        {/* Recent Transactions */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{i18n.t('dashboard.recentTransactions')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AddTransaction' as never)}>
              <Text style={styles.addButton}>+ {i18n.t('transactions.addTransaction')}</Text>
            </TouchableOpacity>
          </View>
          {recentTransactions.length === 0 ? (
            <Text style={styles.emptyText}>{i18n.t('dashboard.noTransactions')}</Text>
          ) : (
            recentTransactions.map((transaction) => (
              <View key={transaction.id} style={styles.transactionItem}>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionCategory}>{transaction.category}</Text>
                  <Text style={styles.transactionMerchant}>
                    {transaction.merchant || transaction.description}
                  </Text>
                  <Text style={styles.transactionDate}>
                    {transaction.date.toLocaleDateString()}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.transactionAmount,
                    transaction.type === 'expense' && styles.expenseAmount,
                  ]}
                >
                  {transaction.type === 'expense' ? '-' : '+'}
                  {formatCurrency(transaction.amount, transaction.currency)}
                </Text>
              </View>
            ))
          )}
        </View>
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
    padding: 15,
  },
  card: {
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
  cardLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  netBalance: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryCard: {
    flex: 1,
    marginHorizontal: 5,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  expenseAmount: {
    color: '#FF6B6B',
  },
  insightText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  transactionMerchant: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    padding: 20,
  },
  addButton: {
    color: '#4ECDC4',
    fontSize: 14,
    fontWeight: '600',
  },
});

