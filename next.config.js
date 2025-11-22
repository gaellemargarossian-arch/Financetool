/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Exclude React Native files from webpack
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-navigation/native': false,
      '@react-navigation/native-stack': false,
      '@react-navigation/bottom-tabs': false,
      'react-native': false,
      'expo-status-bar': false,
      '@react-native-picker/picker': false,
    }
    return config
  },
  // Exclude React Native files from page compilation
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
}

module.exports = nextConfig

