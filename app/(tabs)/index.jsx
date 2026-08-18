// app/(tabs)/index.jsx
import { StyleSheet, View, Text, ScrollView, RefreshControl } from 'react-native'
import React, { useState, useCallback } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { StatisticsCard, ItemOfTheDay, CategoryPreview } from '../../components'
import { useCategories, useDashboardStats } from '../../hooks'
import { useThemeContext } from '../../context'
import { useEffect } from 'react'
import { useObserve } from 'expo-observe'

const Dashboard = () => {
  const [refreshing, setRefreshing] = useState(false)
  const { categories, isLoading } = useCategories()
  const { totalItems, totalCategories, refreshStats } = useDashboardStats(categories)
  const { theme } = useThemeContext()
  const { markInteractive } = useObserve()

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await refreshStats()
    setRefreshing(false)
  }, [refreshStats])

    useEffect(() => {
      if (!isLoading) markInteractive()
    }, [isLoading, markInteractive])

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: theme.background }]}>
        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading dashboard...</Text>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <Text style={[styles.welcomeTitle, { color: theme.textPrimary }]}>Welcome back! 👋</Text>
          <Text style={[styles.welcomeSubtitle, { color: theme.textSecondary }]}>
            Here's what's happening with your notes
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Statistics</Text>
          <View style={styles.statsGrid}>
            <StatisticsCard title="Total Items" value={totalItems} icon="document-text" color={theme.primary} />
            <StatisticsCard title="Categories" value={totalCategories} icon="folder" color={theme.secondary} />
          </View>
        </View>

        <ItemOfTheDay categories={categories} />

        {categories.some((c) => c.favorite) && (
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <View style={styles.favoritesHeader}>
              <Ionicons name="star" size={18} color="#FFD700" />
              <Text style={[styles.sectionTitle, { color: theme.textPrimary, marginBottom: 0, marginLeft: 6 }]}>
                Favorites
              </Text>
            </View>
            <View style={styles.categoriesGrid}>
              {categories.filter((c) => c.favorite).map((category) => (
                <CategoryPreview key={category.id} category={category} />
              ))}
            </View>
          </View>
        )}

        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Category Previews</Text>
          {categories.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="folder-outline" size={48} color={theme.textMuted} />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No categories yet</Text>
              <Text style={[styles.emptySubtext, { color: theme.textMuted }]}>
                Create your first category to get started
              </Text>
            </View>
          ) : (
            <View style={styles.categoriesGrid}>
              {categories.slice(0, 4).map((category) => (
                <CategoryPreview key={category.id} category={category} />
              ))}
            </View>
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  )
}

export default Dashboard

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 18 },
  scrollView: { flex: 1 },
  section: { padding: 20, marginBottom: 16 },
  welcomeTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  welcomeSubtitle: { fontSize: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  favoritesHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  emptyState: { alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 18, fontWeight: '600', marginTop: 12 },
  emptySubtext: { fontSize: 14, textAlign: 'center', marginTop: 4 },
  bottomSpacing: { height: 20 },
})