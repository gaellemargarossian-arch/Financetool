# Budget App - AI-Powered Personal Finance Tool

An AI-powered personal finance application designed for working professionals in Dubai to gain complete control and clarity over their finances.

## Features

### Core Features

- **Unified Dashboard**: Central hub showing net balance, top categories, and weekly insights
- **Multi-Account Aggregation**: Manually add and manage multiple accounts (bank, credit card, cash, loan)
- **Smart Categorization Engine**: Automatically categorizes transactions by merchant and learns from user corrections
- **Monthly Budgets**: Set spending limits per category with progress tracking and alerts
- **AI Financial Coach**: Powered by OpenAI API to answer questions and provide insights
- **Reports & Insights**: Weekly and monthly reports with charts, trends, and key insights
- **Notifications & Alerts**: Push notifications for overspending, upcoming bills, and weekly summaries
- **Manual Expense Entry**: Simple interface to log expenses with category tagging and recurring setup
- **Localization**: Full support for AED currency and Arabic/English languages with UAE-specific categories

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Backend**: Firebase (Auth, Firestore, Cloud Messaging)
- **AI**: OpenAI API (GPT-4)
- **Charts**: react-native-chart-kit
- **Navigation**: React Navigation
- **Localization**: i18n-js with expo-localization

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Firebase project
- OpenAI API key

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Firebase**:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Copy your Firebase config and update `src/config/firebase.ts`

3. **Configure OpenAI**:
   - Get an API key from [OpenAI](https://platform.openai.com/)
   - Add it to your environment variables or update `src/config/openai.ts`

4. **Set up environment variables** (optional):
   Create a `.env` file:
   ```
   EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
   EXPO_PUBLIC_OPENAI_API_KEY=your-openai-key
   ```

5. **Run the app**:
   ```bash
   npm start
   ```

   Then press:
   - `i` for iOS simulator
   - `a` for Android emulator
   - `w` for web browser

## Project Structure

```
Budget/
├── App.tsx                 # Main app component with navigation
├── src/
│   ├── config/            # Firebase and OpenAI configuration
│   ├── constants/         # Default categories and constants
│   ├── i18n/              # Localization files (English/Arabic)
│   ├── screens/           # All screen components
│   ├── services/          # Business logic and API services
│   └── types/             # TypeScript type definitions
├── assets/                # Images and static assets
└── package.json
```

## Key Services

- **accountService**: Manages user accounts (CRUD operations)
- **transactionService**: Handles transactions and account balance updates
- **categorizationService**: Smart categorization with learning capabilities
- **budgetService**: Budget management and progress tracking
- **insightsService**: Generates weekly insights and monthly reports
- **aiCoachService**: OpenAI integration for financial coaching
- **notificationService**: Push notifications for alerts and reminders

## Data Models

- **Account**: Bank, credit card, cash, or loan accounts
- **Transaction**: Income, expense, or transfer transactions
- **Budget**: Monthly/weekly/yearly budgets with category or overall limits
- **Category**: Expense categories with Arabic/English support
- **CategorizationRule**: Learned rules for automatic categorization

## Security & Privacy

- Data stored securely in Firebase Firestore
- Authentication via Firebase Auth
- Local data encryption
- GDPR-style data protection standards
- UAE data protection compliance

## Future Enhancements

- Integration with Lean or Tarabut Gateway for real-time bank data sync
- Advanced analytics and forecasting
- Goal setting and tracking
- Bill reminders with calendar integration
- Export to PDF/CSV
- Multi-currency support
- Family/shared budgets

## License

This project is private and proprietary.

## Support

For issues or questions, please contact the development team.

