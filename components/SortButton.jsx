import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

const SortButton = ({ sortOrder, onSortChange, selectedCategory }) => {
  if (!selectedCategory) return null

  const sortOptions = [
    { key: 'alphabetical', label: 'A-Z', icon: 'text-outline' },
    { key: 'date', label: 'Date', icon: 'calendar-outline' }
  ]

  const currentSort = sortOptions.find(option => option.key === sortOrder) || sortOptions[0]

  const handleSortPress = () => {
    const currentIndex = sortOptions.findIndex(option => option.key === sortOrder)
    const nextIndex = (currentIndex + 1) % sortOptions.length
    onSortChange(sortOptions[nextIndex].key)
  }

  return (
    <TouchableOpacity style={styles.sortButton} onPress={handleSortPress}>
      <Ionicons name={currentSort.icon} size={18} color="#fff" />
      <Text style={styles.sortText}>Sort: {currentSort.label}</Text>
    </TouchableOpacity>
  )
}

export default SortButton

const styles = StyleSheet.create({
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    marginBottom: 8,
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  sortText: {
    color: "#fff", 
    marginLeft: 6, 
    fontWeight: "bold" 
  },
})