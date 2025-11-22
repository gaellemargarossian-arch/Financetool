import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { auth } from '../config/firebase';
import { insightsService } from '../services/insightsService';
import { MonthlyReport } from '../types';
import { formatCurrency } from '../i18n';
import i18n from '../i18n';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function ReportsScreen() {
  const [monthlyReport, setMonthlyReport] = useState<MonthlyReport | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadReport = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const report = await insightsService.getMonthlyReport(user.uid);
      setMonthlyReport(report);
    } catch (error) {
      console.error('Error loading report:', error);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReport();
    setRefreshing(false);
  };

  if (!monthlyReport) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>{i18n.t('reports.title')}</Text>
      </View>
    );
  }

  const categoryData = {
    labels: monthlyReport.categoryBreakdown.slice(0, 5).map(cat => cat.category),
    datasets: [
      {
        data: monthlyReport.categoryBreakdown.slice(0, 5).map(cat => cat.amount),
      },
    ],
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.content}>
        {/* Summary Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{i18n.t('reports.monthly')} Summary</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>{i18n.t('dashboard.totalIncome')}</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(monthlyReport.totalIncome, 'AED')}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>{i18n.t('dashboard.totalExpenses')}</Text>
              <Text style={[styles.summaryValue, styles.expenseValue]}>
                {formatCurrency(monthlyReport.totalExpenses, 'AED')}
              </Text>
            </View>
          </View>
          <View style={styles.netBalanceRow}>
            <Text style={styles.netBalanceLabel}>{i18n.t('dashboard.netBalance')}</Text>
            <Text
              style={[
                styles.netBalanceValue,
                monthlyReport.netBalance < 0 && styles.negativeBalance,
              ]}
            >
              {formatCurrency(monthlyReport.netBalance, 'AED')}
            </Text>
          </View>
        </View>

        {/* Trends */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{i18n.t('reports.trends')}</Text>
          <Text style={styles.trendText}>
            Previous Month: {formatCurrency(monthlyReport.trends.previousMonth, 'AED')}
          </Text>
          <Text
            style={[
              styles.trendChange,
              monthlyReport.trends.change > 0 && styles.positiveChange,
              monthlyReport.trends.change < 0 && styles.negativeChange,
            ]}
          >
            {monthlyReport.trends.change > 0 ? '+' : ''}
            {formatCurrency(monthlyReport.trends.change, 'AED')} (
            {monthlyReport.trends.changePercentage > 0 ? '+' : ''}
            {monthlyReport.trends.changePercentage.toFixed(1)}%)
          </Text>
        </View>

        {/* Category Breakdown Chart */}
        {categoryData.labels.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{i18n.t('reports.categoryBreakdown')}</Text>
            <BarChart
              data={categoryData}
              width={screenWidth - 60}
              height={220}
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(78, 205, 196, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              verticalLabelRotation={30}
              fromZero
            />
          </View>
        )}

        {/* Insights */}
        {monthlyReport.insights.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{i18n.t('reports.insights')}</Text>
            {monthlyReport.insights.map((insight, index) => (
              <View key={index} style={styles.insightItem}>
                <Text style={styles.insightBullet}>•</Text>
                <Text style={styles.insightText}>{insight}</Text>
              </View>
            ))}
          </View>
        )}
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  expenseValue: {
    color: '#FF6B6B',
  },
  netBalanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  netBalanceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  netBalanceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  negativeBalance: {
    color: '#FF6B6B',
  },
  trendText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  trendChange: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  positiveChange: {
    color: '#FF6B6B',
  },
  negativeChange: {
    color: '#4ECDC4',
  },
  insightItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  insightBullet: {
    fontSize: 16,
    color: '#4ECDC4',
    marginRight: 10,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 50,
    fontSize: 16,
  },
});

