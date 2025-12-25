import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

const FlashcardButton = ({ onPress, selectedCategory }) => {
  if (!selectedCategory || !selectedCategory.items || selectedCategory.items.length === 0) {
    return null;
  }

  return (
    <TouchableOpacity style={styles.flashcardBtn} onPress={onPress}>
      <Ionicons name="library-outline" size={22} color="#fff" />
      <Text style={styles.flashcardText}>Flashcards</Text>
    </TouchableOpacity>
  )
}

export default FlashcardButton

const styles = StyleSheet.create({
  flashcardBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    marginBottom: 8,
    backgroundColor: "#9C27B0",
    padding: 10,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  flashcardText: { 
    color: "#fff", 
    marginLeft: 6, 
    fontWeight: "bold" 
  },
})