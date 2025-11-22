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
import { budgetService } from '../services/budgetService';
import { Budget, BudgetProgress } from '../types';
import { formatCurrency } from '../i18n';
import i18n from '../i18n';

export default function BudgetsScreen() {
  const navigation = useNavigation();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [progresses, setProgresses] = useState<Map<string, BudgetProgress>>(new Map());
  const [refreshing, setRefreshing] = useState(false);

  const loadBudgets = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userBudgets = await budgetService.getUserBudgets(user.uid);
      setBudgets(userBudgets);

      const progressMap = new Map<string, BudgetProgress>();
      for (const budget of userBudgets) {
        const progress = await budgetService.getBudgetProgress(budget.id);
        if (progress) {
          progressMap.set(budget.id, progress);
        }
      }
      setProgresses(progressMap);
    } catch (error) {
      console.error('Error loading budgets:', error);
    }
  };

  useEffect(() => {
    loadBudgets();
    const unsubscribe = navigation.addListener('focus', loadBudgets);
    return unsubscribe;
  }, [navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBudgets();
    setRefreshing(false);
  };

  const getProgressColor = (progress: BudgetProgress) => {
    if (progress.isOverBudget) return '#FF6B6B';
    if (progress.alertTriggered) return '#FFA07A';
    return '#4ECDC4';
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {budgets.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{i18n.t('budgets.noBudgets')}</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('AddBudget' as never)}
            >
              <Text style={styles.addButtonText}>{i18n.t('budgets.setFirstBudget')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          budgets.map((budget) => {
            const progress = progresses.get(budget.id);
            if (!progress) return null;

            return (
              <View key={budget.id} style={styles.budgetCard}>
                <View style={styles.budgetHeader}>
                  <Text style={styles.budgetCategory}>
                    {budget.category || i18n.t('budgets.title')}
                  </Text>
                  <Text style={styles.budgetPeriod}>{budget.period}</Text>
                </View>
                <View style={styles.budgetAmounts}>
                  <View>
                    <Text style={styles.amountLabel}>{i18n.t('budgets.spent')}</Text>
                    <Text style={[styles.amountValue, { color: getProgressColor(progress) }]}>
                      {formatCurrency(progress.spent, budget.currency)}
                    </Text>
                  </View>
                  <View style={styles.amountDivider} />
                  <View>
                    <Text style={styles.amountLabel}>{i18n.t('budgets.budgetAmount')}</Text>
                    <Text style={styles.amountValue}>
                      {formatCurrency(budget.amount, budget.currency)}
                    </Text>
                  </View>
                </View>
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${Math.min(progress.percentage, 100)}%`,
                        backgroundColor: getProgressColor(progress),
                      },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {progress.percentage.toFixed(1)}% {i18n.t('budgets.remaining')}:{' '}
                  {formatCurrency(progress.remaining, budget.currency)}
                </Text>
                {progress.isOverBudget && (
                  <Text style={styles.overBudgetText}>{i18n.t('budgets.overBudget')}</Text>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddBudget' as never)}
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
  budgetCard: {
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
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  budgetCategory: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  budgetPeriod: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
  },
  budgetAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  amountLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  amountValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  amountDivider: {
    width: 1,
    backgroundColor: '#ddd',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  overBudgetText: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 5,
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

