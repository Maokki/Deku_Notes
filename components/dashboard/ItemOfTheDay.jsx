import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'

const ITEM_OF_DAY_KEY = 'maomao_item_of_day'

const ItemOfTheDay = ({ categories }) => {
  const [itemOfDay, setItemOfDay] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadItemOfDay()
  }, [categories])

  const getAllItems = () => {
    const allItems = []
    categories.forEach(category => {
      category.items.forEach(item => {
        allItems.push({
          ...item,
          categoryName: category.name
        })
      })
    })
    return allItems
  }

  const loadItemOfDay = async () => {
    try {
      const allItems = getAllItems()
      if (allItems.length === 0) {
        setItemOfDay(null)
        setLoading(false)
        return
      }

      const today = new Date().toDateString()
      const stored = await AsyncStorage.getItem(ITEM_OF_DAY_KEY)
      
      if (stored) {
        const { date, item } = JSON.parse(stored)
        if (date === today && allItems.find(i => i.id === item.id)) {
          setItemOfDay(item)
          setLoading(false)
          return
        }
      }

      // Generate new item of the day
      const randomItem = allItems[Math.floor(Math.random() * allItems.length)]
      await AsyncStorage.setItem(ITEM_OF_DAY_KEY, JSON.stringify({
        date: today,
        item: randomItem
      }))
      
      setItemOfDay(randomItem)
    } catch (error) {
      console.error('Error loading item of day:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshItemOfDay = async () => {
    const allItems = getAllItems()
    if (allItems.length === 0) return

    const randomItem = allItems[Math.floor(Math.random() * allItems.length)]
    const today = new Date().toDateString()
    
    try {
      await AsyncStorage.setItem(ITEM_OF_DAY_KEY, JSON.stringify({
        date: today,
        item: randomItem
      }))
      setItemOfDay(randomItem)
    } catch (error) {
      console.error('Error refreshing item of day:', error)
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Item of the Day</Text>
        <View style={styles.card}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    )
  }

  if (!itemOfDay) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Item of the Day</Text>
        <View style={styles.emptyCard}>
          <Ionicons name="document-outline" size={48} color="#ccc" />
          <Text style={styles.emptyText}>No items available</Text>
          <Text style={styles.emptySubtext}>Add some items to see your daily pick!</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Item of the Day</Text>
        <TouchableOpacity onPress={refreshItemOfDay} style={styles.refreshButton}>
          <Ionicons name="refresh" size={20} color="#4CAF50" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.itemName}>{itemOfDay.name}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{itemOfDay.categoryName}</Text>
          </View>
        </View>
        
        {itemOfDay.tags && itemOfDay.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {itemOfDay.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
        
        {itemOfDay.description && (
          <Text style={styles.description} numberOfLines={10}>
            {itemOfDay.description}
          </Text>
        )}
        
        <View style={styles.cardFooter}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.footerText}>Today's featured item</Text>
        </View>
      </View>
    </View>
  )
}

export default ItemOfTheDay

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    marginTop: -12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f8f0',
  },
  card: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  categoryBadge: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    color: '#1976d2',
    fontSize: 12,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
    fontStyle: 'italic',
  },
  emptyCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  emptyText: {
    fontSize: 16,
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
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
})