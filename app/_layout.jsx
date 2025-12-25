import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import Navbar from '../components/Navbar';

export default function RootLayout() {
  return (
    <>
      <View style={{ flex: 1 }}>
        <Navbar />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="notes" />
        <Stack.Screen name="+not-found" />
      </Stack>
      </View>
      <StatusBar style="auto" />
    </>
  );
}