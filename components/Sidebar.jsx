import { StyleSheet, Text, View, TextInput, TouchableOpacity, Animated, Alert, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'

const Sidebar = ({ 
  slideAnim, 
  categories, 
  newCategoryName, 
  setNewCategoryName, 
  onAddCategory, 
  onSelectCategory, 
  onDeleteCategory,
  onExportImportPress
}) => {
  const [showDeleteIcons, setShowDeleteIcons] = useState(false);

  return (
    <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
      <ScrollView>
      {/* Top Row: Back + Manage */}
      <View style={styles.topRow}>

        {/* Export/Import Button */}
        <TouchableOpacity 
          style={[styles.exportImportBtn, { backgroundColor: '#FF9800' }]} 
          onPress={onExportImportPress}
        >
          <Ionicons name="cloud-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Backup</Text>
        </TouchableOpacity>


        <TouchableOpacity 
          style={styles.squareBtn} 
          onPress={() => setShowDeleteIcons(!showDeleteIcons)}
        >
          <Ionicons 
            name={showDeleteIcons ? "checkmark" : "trash"} 
            size={20} 
            color="#fff" 
          />
        </TouchableOpacity>
      </View>

      {/* Add Category */}
      <View style={styles.addCategoryRow}>
        <TextInput
          value={newCategoryName}
          onChangeText={setNewCategoryName}
          placeholder="New Category"
          placeholderTextColor="#aaa"
          style={styles.categoryInput}
        />
        <TouchableOpacity style={styles.addCategoryBtn} onPress={onAddCategory}>
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Category list */}
      <View style={styles.categories}>
        {[...categories] // copy so you don’t mutate state
          .sort((a, b) => a.name.localeCompare(b.name)) // alphabetical sort
          .map((cat, index) => (
          <View key={cat.id || index} style={styles.categoryRow}>
            <TouchableOpacity
              onPress={() => onSelectCategory(cat)}
              style={{ flex: 1 }}
            >
              <Text style={styles.categoryItem}>📂 {cat.name}</Text>
            </TouchableOpacity>

            {showDeleteIcons && (
              <TouchableOpacity 
                onPress={() => {
                  Alert.alert(
                    "Delete Category",
                    `Are you sure you want to delete "${cat.name}"?`,
                    [
                      { text: "Cancel", style: "cancel" },
                      { text: "Delete", style: "destructive", onPress: () => onDeleteCategory(cat.id) }
                    ]
                  );
                }}
              >
                <Ionicons name="trash-outline" size={20} color="#f66" />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
    
    </Animated.View>
  )
}

export default Sidebar

const styles = StyleSheet.create({
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 250,
    height: "100%",
    backgroundColor: "#333",
    padding: 16,
    paddingTop: 24,
    zIndex: 100,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 73,
    marginBottom: 16,
  },
  squareBtn: {
    width: 40,
    height: 40,
    backgroundColor: "#444",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  exportImportBtn: {
    height: 40,
    backgroundColor: '#FF9800',
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",     // <--- put icon + text in a row
    paddingHorizontal: 12,    // <--- instead of fixed width
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 6,            // spacing between icon & text
  },

  categories: { 
    marginTop: 20 
  },
  categoryRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 8,
    borderBottomWidth: 1, 
    borderBottomColor: "#555",
    paddingBottom: 4,
  },
  categoryItem: { 
    color: "#fff", 
    fontSize: 16, 
    paddingVertical: 8 
  },
  addCategoryRow: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  categoryInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 6,
    padding: 8,
    color: "#fff",
    marginRight: 8,
  },
  addCategoryBtn: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 6,
  },
})
