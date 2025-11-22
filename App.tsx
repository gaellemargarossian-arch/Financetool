import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './src/config/firebase';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LoadingScreen from './src/components/LoadingScreen';

// Screens
import AuthScreen from './src/screens/AuthScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import AccountsScreen from './src/screens/AccountsScreen';
import TransactionsScreen from './src/screens/TransactionsScreen';
import BudgetsScreen from './src/screens/BudgetsScreen';
import ReportsScreen from './src/screens/ReportsScreen';
import AICoachScreen from './src/screens/AICoachScreen';
import AddAccountScreen from './src/screens/AddAccountScreen';
import AddTransactionScreen from './src/screens/AddTransactionScreen';
import AddBudgetScreen from './src/screens/AddBudgetScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#4ECDC4',
        tabBarInactiveTintColor: '#999',
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen 
        name="Transactions" 
        component={TransactionsScreen}
        options={{ title: 'Transactions' }}
      />
      <Tab.Screen 
        name="Budgets" 
        component={BudgetsScreen}
        options={{ title: 'Budgets' }}
      />
      <Tab.Screen 
        name="Reports" 
        component={ReportsScreen}
        options={{ title: 'Reports' }}
      />
      <Tab.Screen 
        name="AI Coach" 
        component={AICoachScreen}
        options={{ title: 'AI Coach' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            <>
              <Stack.Screen name="MainTabs" component={MainTabs} />
              <Stack.Screen 
                name="Accounts" 
                component={AccountsScreen}
                options={{ headerShown: true, title: 'Accounts' }}
              />
              <Stack.Screen 
                name="AddAccount" 
                component={AddAccountScreen}
                options={{ headerShown: true, title: 'Add Account' }}
              />
              <Stack.Screen 
                name="AddTransaction" 
                component={AddTransactionScreen}
                options={{ headerShown: true, title: 'Add Transaction' }}
              />
              <Stack.Screen 
                name="AddBudget" 
                component={AddBudgetScreen}
                options={{ headerShown: true, title: 'Add Budget' }}
              />
            </>
          ) : (
            <Stack.Screen name="Auth" component={AuthScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

