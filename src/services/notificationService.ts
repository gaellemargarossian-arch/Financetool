import * as Notifications from 'expo-notifications';
import { budgetService } from './budgetService';
import { insightsService } from './insightsService';
import i18n from '../i18n';
import { formatCurrency } from '../i18n';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const notificationService = {
  async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    return finalStatus === 'granted';
  },

  async scheduleBudgetAlerts(userId: string): Promise<void> {
    const budgets = await budgetService.getUserBudgets(userId);
    
    for (const budget of budgets) {
      const progress = await budgetService.getBudgetProgress(budget.id);
      if (!progress) continue;

      // Check if alert threshold is reached
      if (progress.alertTriggered && !progress.isOverBudget) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: i18n.t('notifications.budgetAlert'),
            body: i18n.t('notifications.budgetWarning', {
              percentage: progress.percentage.toFixed(0),
              category: budget.category || 'overall',
            }),
            sound: true,
          },
          trigger: null, // Send immediately
        });
      }

      // Check if over budget
      if (progress.isOverBudget) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: i18n.t('notifications.budgetAlert'),
            body: `You've exceeded your ${budget.category || 'overall'} budget by ${formatCurrency(Math.abs(progress.remaining), budget.currency)}`,
            sound: true,
          },
          trigger: null,
        });
      }
    }
  },

  async scheduleWeeklySummary(userId: string): Promise<void> {
    const insights = await insightsService.getWeeklyInsights(userId);
    if (!insights) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: i18n.t('notifications.weeklySummary'),
        body: i18n.t('notifications.weeklySummaryText', {
          amount: formatCurrency(insights.totalSpent, 'AED'),
        }),
        sound: true,
      },
      trigger: {
        weekday: 1, // Monday
        hour: 9,
        minute: 0,
        repeats: true,
      },
    });
  },

  async scheduleBillReminders(userId: string): Promise<void> {
    // This would check for recurring transactions and upcoming bills
    // For now, it's a placeholder for future implementation
    // You could query recurring transactions and schedule reminders
  },

  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },

  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    return await Notifications.getAllScheduledNotificationsAsync();
  },
};

