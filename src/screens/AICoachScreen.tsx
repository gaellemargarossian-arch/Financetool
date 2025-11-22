import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { auth } from '../config/firebase';
import { aiCoachService } from '../services/aiCoachService';
import i18n from '../i18n';

export default function AICoachScreen() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  React.useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const suggs = await aiCoachService.getSuggestions(user.uid);
      setSuggestions(suggs);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) return;

    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);
    setResponse('');

    try {
      const answer = await aiCoachService.askQuestion(user.uid, question);
      setResponse(answer);
    } catch (error) {
      setResponse('Sorry, I encountered an error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (suggestion: string): void => {
    setQuestion(suggestion);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>{i18n.t('aiCoach.title')}</Text>
          <Text style={styles.subtitle}>
            {i18n.t('aiCoach.askQuestion')}
          </Text>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionsTitle}>{i18n.t('aiCoach.suggestions')}</Text>
              {suggestions.map((suggestion: string, index: number) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionButton}
                  onPress={() => handleSuggestion(suggestion)}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Response */}
          {response ? (
            <View style={styles.responseContainer}>
              <Text style={styles.responseTitle}>Response:</Text>
              <Text style={styles.responseText}>{response}</Text>
            </View>
          ) : loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4ECDC4" />
              <Text style={styles.loadingText}>{i18n.t('aiCoach.analyzing')}</Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Ask me anything about your finances!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={i18n.t('aiCoach.placeholder')}
          value={question}
          onChangeText={setQuestion}
          multiline
          editable={!loading}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!question.trim() || loading) && styles.sendButtonDisabled]}
          onPress={handleAsk}
          disabled={!question.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.sendButtonText}>Ask</Text>
          )}
        </TouchableOpacity>
      </View>
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
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  suggestionsContainer: {
    marginBottom: 20,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  suggestionButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
  },
  responseContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  responseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  responseText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    padding: 12,
    paddingHorizontal: 15,
    maxHeight: 100,
    marginRight: 10,
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 20,
    padding: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

