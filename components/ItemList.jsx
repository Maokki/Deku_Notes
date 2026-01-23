//ItemList.jsx
import { StyleSheet, Text, View, TouchableOpacity, FlatList, LayoutAnimation, Platform, UIManager } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { sortItems } from '../utils/sortUtils' // Add this import

// Enable LayoutAnimation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ItemList = ({ 
  items,
  selectedCategory,
  expandedIndex, 
  setExpandedIndex, 
  onEditItem, 
  onDeleteItem,
  selectedTag 
}) => {
  const toggleExpand = (itemId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === itemId ? null : itemId);
  };

  if (!selectedCategory) {
    return <Text>Select a category to view items.</Text>
  }

  // Sort items based on category's sortOrder (with natural sort for alphabetical)
  const sortedItems = sortItems(items, selectedCategory?.sortOrder || 'alphabetical');
  
  // Filter items based on selectedTag
  const filteredItems = selectedTag
    ? sortedItems.filter(item => item.tags?.includes(selectedTag))
    : sortedItems;

  return (
    <>
      {filteredItems.length === 0 ? (
        <Text>No items</Text>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            const expanded = expandedIndex === item.id;
            return (
              <TouchableOpacity
                onPress={() => toggleExpand(item.id)}
                activeOpacity={0.8}
              >
                <View style={styles.itemBox}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  {expanded && (
                    <View style={styles.itemDetails}>
                      {item.tags && item.tags.length > 0 && (
                        <View style={styles.tagsContainer}>
                          <View style={styles.tagsWrapper}>
                            {item.tags.map((tag, tagIndex) => (
                              <View key={tagIndex} style={styles.tagChip}>
                                <Text style={styles.tagText}>{tag}</Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}
                      <Text style={styles.itemDescription}>{item.description}</Text>

                      {/* Item actions */}
                      <View style={styles.itemActions}>
                        <TouchableOpacity onPress={() => onEditItem(item)} style={styles.editBtn}>
                          <Ionicons name="create-outline" size={18} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onDeleteItem(item.id)} style={styles.deleteBtn}>
                          <Ionicons name="trash-outline" size={18} color="#fff" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </>
  )
}

export default ItemList

const styles = StyleSheet.create({
  itemBox: { 
    backgroundColor: "#f0f0f0", 
    padding: 10, 
    marginVertical: 6, 
    borderRadius: 6 
  },
  itemName: { 
    fontWeight: "bold", 
    fontSize: 16, 
    padding: 3 
  },
  tagsContainer: {
    marginTop: 8,
    marginBottom: 4,
  },
  tagsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  tagChip: {
    backgroundColor: "#e3f2fd",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2196F3",
  },
  tagText: {
    fontSize: 11,
    color: "#1976d2",
    fontWeight: "500",
  },
  itemDescription: { 
    fontSize: 14, 
    marginTop: 4 
  },
  itemDetails: { 
    marginTop: 6 
  },
  itemActions: { 
    flexDirection: "row", 
    marginTop: 8, 
    gap: 5,
    alignSelf: "flex-end",

  },
  editBtn: { 
    backgroundColor: "#4a90e2", 
    padding: 6, 
    borderRadius: 6 
  },
  deleteBtn: { 
    backgroundColor: "#e74c3c", 
    padding: 6, 
    borderRadius: 6 
  },
})