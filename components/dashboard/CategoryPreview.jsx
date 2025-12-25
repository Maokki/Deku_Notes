import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'

const CategoryPreview = ({ category }) => {
  const handlePress = () => {
    router.push(`/notes?category=${category.id}`)
  }

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.titleRow}>
        <Ionicons name="folder" size={18} color="#4CAF50" />
        <Text style={styles.categoryName}>{category.name}</Text>
      </View>
      <View style={styles.itemCount}>
        <Text style={styles.countText}>{category.items.length}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default CategoryPreview

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    width: '48%',
    borderWidth: 1,
    borderColor: '#e9ecef',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 6,
  },
  itemCount: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  countText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
})