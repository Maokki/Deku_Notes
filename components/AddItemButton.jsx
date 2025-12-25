import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

const AddItemButton = ({ onPress, selectedCategory }) => {
  if (!selectedCategory) return null;

  return (
    <TouchableOpacity style={styles.addItemBtn} onPress={onPress}>
      <Ionicons name="add-circle-outline" size={22} color="#fff" />
      <Text style={styles.addItemText}>Add Item</Text>
    </TouchableOpacity>
  )
}

export default AddItemButton

const styles = StyleSheet.create({
  addItemBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    marginBottom: 8,
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  addItemText: { 
    color: "#fff", 
    marginLeft: 6, 
    fontWeight: "bold" 
  },
})