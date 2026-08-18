import {
  StyleSheet, Text, View, TouchableOpacity, FlatList,
  LayoutAnimation, Platform, UIManager, Image, ScrollView
} from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useThemeContext } from '../context'

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

const TagChip = ({ tag, theme }) => (
  <View style={[styles.tagChip, { backgroundColor: theme.surface, borderColor: theme.secondary }]}>
    <Text style={[styles.tagText, { color: theme.secondary }]}>{tag}</Text>
  </View>
)

const ItemRow = ({ item, expanded, onToggle, onEdit, onDelete, theme }) => (
  <TouchableOpacity onPress={onToggle} activeOpacity={0.8}>
    <View style={[styles.itemBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Text style={[styles.itemName, { color: theme.textPrimary }]}>{item.name}</Text>
      {expanded && (
        <View style={styles.itemDetails}>
          {item.tags?.length > 0 && (
            <View style={styles.tagsWrapper}>
              {item.tags.map((tag, i) => (
                <TagChip key={i} tag={tag} theme={theme} />
              ))}
            </View>
          )}
          {!!item.description && (
            <Text style={[styles.itemDescription, { color: theme.textSecondary }]}>
              {item.description}
            </Text>
          )}

          {item.images?.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageRow}   contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
              {item.images.map((uri, i) => (
                <Image
                  key={i}
                  source={{ uri }}
                  style={styles.itemImage}
                  resizeMode="contain"
                />
              ))}
            </ScrollView>
          )}

          <View style={styles.itemActions}>
            <TouchableOpacity
              onPress={() => onEdit(item)}
              style={[styles.editBtn, { backgroundColor: theme.secondary }]}
            >
              <Ionicons name="create-outline" size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onDelete(item.id)}
              style={[styles.deleteBtn, { backgroundColor: theme.danger }]}
            >
              <Ionicons name="trash-outline" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  </TouchableOpacity>
)

const ItemList = ({ items, selectedCategory, expandedIndex, setExpandedIndex, onEditItem, onDeleteItem }) => {
  const { theme } = useThemeContext()

  const toggleExpand = (itemId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setExpandedIndex(expandedIndex === itemId ? null : itemId)
  }

  if (!selectedCategory) {
    return <Text style={[styles.hint, { color: theme.textSecondary }]}>Tap the Notes tab again to view categories.</Text>
  }

  if (items.length === 0) {
    return <Text style={[styles.hint, { color: theme.textSecondary }]}>No items found.</Text>
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ItemRow
          item={item}
          expanded={expandedIndex === item.id}
          onToggle={() => toggleExpand(item.id)}
          onEdit={onEditItem}
          onDelete={onDeleteItem}
          theme={theme}
        />
      )}
    />
  )
}

export default ItemList

const styles = StyleSheet.create({
  hint: { textAlign: 'center', marginTop: 32, fontSize: 16 },
  itemBox: { padding: 10, marginVertical: 6, borderRadius: 6, borderWidth: 1 },
  itemName: { fontWeight: 'bold', fontSize: 16, padding: 3 },
  itemDetails: { marginTop: 6 },
  tagsWrapper: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 6 },
  tagChip: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1 },
  tagText: { fontSize: 11, fontWeight: '500' },
  itemDescription: { fontSize: 14, marginTop: 4 },
  itemActions: { flexDirection: 'row', marginTop: 8, gap: 5, alignSelf: 'flex-end' },
  imageRow: { marginTop: 8, marginBottom: 4  },
  itemImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginRight: 6,
  },
  editBtn: { padding: 6, borderRadius: 6 },
  deleteBtn: { padding: 6, borderRadius: 6 },
})