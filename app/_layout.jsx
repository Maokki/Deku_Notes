// app/_layout.jsx
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { ThemeProvider, useThemeContext } from '../context'
import { Observe, ObserveRoot } from 'expo-observe'

Observe.configure({
  integrations: { 'expo-router': true },
})

function AppContent() {
  const { isDark } = useThemeContext()
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </>
  )
}

function RootLayout() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default ObserveRoot.wrap(RootLayout)