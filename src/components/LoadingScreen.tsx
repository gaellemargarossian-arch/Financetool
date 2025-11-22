import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import i18n from '../i18n';

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4ECDC4" />
      <Text style={styles.text}>{i18n.t('common.loading')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});

