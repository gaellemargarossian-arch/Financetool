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
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../config/firebase';
import { budgetService } from '../services/budgetService';
import { DEFAULT_CATEGORIES } from '../constants/categories';
import i18n from '../i18n';

export default function AddBudgetScreen() {
  const navigation = useNavigation();
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState<'monthly' | 'weekly' | 'yearly'>('monthly');
  const [alertThreshold, setAlertThreshold] = useState('80');

  const handleSave = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid budget amount');
      return;
    }

    const user = auth.currentUser;
    if (!user) return;

    try {
      await budgetService.createBudget(user.uid, {
        category: category || undefined,
        amount: parseFloat(amount),
        currency: 'AED',
        period,
        startDate: new Date(),
        alertThreshold: parseFloat(alertThreshold),
        isActive: true,
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to create budget');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>Budget Type</Text>
        <View style={styles.typeContainer}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              !category && styles.typeButtonActive,
            ]}
            onPress={() => setCategory('')}
          >
            <Text
              style={[
                styles.typeButtonText,
                !category && styles.typeButtonTextActive,
              ]}
            >
              Overall
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              category && styles.typeButtonActive,
            ]}
            onPress={() => setCategory(category || DEFAULT_CATEGORIES[0].name)}
          >
            <Text
              style={[
                styles.typeButtonText,
                category && styles.typeButtonTextActive,
              ]}
            >
              Category
            </Text>
          </TouchableOpacity>
        </View>

        {category && (
          <>
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
          </>
        )}

        <Text style={styles.label}>{i18n.t('budgets.budgetAmount')}</Text>
        <TextInput
          style={styles.input}
          placeholder="0.00"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Period</Text>
        <View style={styles.typeContainer}>
          {(['weekly', 'monthly', 'yearly'] as const).map((periodOption) => (
            <TouchableOpacity
              key={periodOption}
              style={[
                styles.typeButton,
                period === periodOption && styles.typeButtonActive,
              ]}
              onPress={() => setPeriod(periodOption)}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  period === periodOption && styles.typeButtonTextActive,
                ]}
              >
                {periodOption.charAt(0).toUpperCase() + periodOption.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>{i18n.t('budgets.alertThreshold')} (%)</Text>
        <TextInput
          style={styles.input}
          placeholder="80"
          value={alertThreshold}
          onChangeText={setAlertThreshold}
          keyboardType="number-pad"
        />
        <Text style={styles.hint}>
          You&apos;ll receive an alert when you reach this percentage of your budget
        </Text>

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
  hint: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
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

