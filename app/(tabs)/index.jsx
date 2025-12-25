import { StyleSheet, View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native'
import React, { useState, useCallback } from 'react'
import { Ionicons } from '@expo/vector-icons'

// Components
import StatisticsCard from '../../components/dashboard/StatisticsCard'
import ItemOfTheDay from '../../components/dashboard/ItemOfTheDay'
import CategoryPreview from '../../components/dashboard/CategoryPreview'


// Hooks
import { useCategories } from '../../hooks/useCategories'
import { useDashboardStats } from '../../hooks/useDashboardStats'

const Dashboard = () => {
  const [refreshing, setRefreshing] = useState(false)
  
  const {
    categories,
    isLoading,
  } = useCategories()

  const {
    totalItems,
    totalCategories,
    refreshStats
  } = useDashboardStats(categories)

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await refreshStats()
    setRefreshing(false)
  }, [refreshStats])

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome back! 👋</Text>
          <Text style={styles.welcomeSubtitle}>
            Here's what's happening with your notes
          </Text>
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsGrid}>
            <StatisticsCard
              title="Total Items"
              value={totalItems}
              icon="document-text"
              color="#4CAF50"
            />
            <StatisticsCard
              title="Categories"
              value={totalCategories}
              icon="folder"
              color="#2196F3"
            />
          </View>
        </View>

        {/* Item of the Day */}
        <ItemOfTheDay categories={categories} />

        {/* Category Previews */}
        <View style={styles.previewSection}>
          <Text style={styles.sectionTitle}>Category Previews</Text>
          {categories.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="folder-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No categories yet</Text>
              <Text style={styles.emptySubtext}>
                Create your first category to get started
              </Text>
            </View>
          ) : (
          <View style={styles.categoriesGrid}>
            {categories.slice(0, 4).map((category) => (
              <CategoryPreview key={category.id} category={category} 
                    onPress={category.id}   // <-- add this
              />
            ))}
          </View>
          )}
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  )
}

export default Dashboard

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  welcomeSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  statsSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  previewSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 4,
  },
  bottomSpacing: {
    height: 20,
  },
})