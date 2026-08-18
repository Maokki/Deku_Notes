// app/(tabs)/notes.jsx
import { StyleSheet, View, Text, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation, useLocalSearchParams } from 'expo-router'
import { useObserve } from 'expo-observe'

import {
  Sidebar, AddItemButton, ItemList, ItemModal, SearchBar,
  SortButton, TagsDropdown, ExportImportModal, FlashcardModal, FlashcardButton,
} from '../../components'
import { useCategories, useSidebar, useItemModal, useSearch } from '../../hooks'
import { useThemeContext } from '../../context'
import { exportData, processImportData, validateImportData } from '../../utils'

const Notes = () => {
  const navigation = useNavigation()
  const { category: categoryIdFromDashboard } = useLocalSearchParams()
  const { theme } = useThemeContext()
  const { markInteractive } = useObserve()

  const {
    categories, selectedCategory, isLoading,
    setSelectedCategory, addCategory, renameCategory,
    deleteCategory, addItem, editItem, deleteItem,
    updateCategorySortOrder, toggleFavorite, importData,
  } = useCategories()

  const { slideAnim, toggleSidebar, closeSidebar } = useSidebar()

  const {
    modalVisible, itemName, setItemName,
    itemTags, setItemTags, itemDesc, setItemDesc, images, setImages,
    editingItem, openModal, closeModal, openEditModal, pickImage, pickFromCamera, removeImage, getItemData,
  } = useItemModal()

  const [selectedTag, setSelectedTag] = useState(null)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [expandedIndex, setExpandedIndex] = useState(null)
  const [exportImportModalVisible, setExportImportModalVisible] = useState(false)
  const [flashcardModalVisible, setFlashcardModalVisible] = useState(false)

  const { searchQuery, setSearchQuery, filteredAndSortedItems, clearSearch } =
    useSearch(selectedCategory, selectedTag)

    
  useEffect(() => {
    if (!isLoading) markInteractive()
  }, [isLoading, markInteractive])

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', () => toggleSidebar())
    return unsubscribe
  }, [navigation, toggleSidebar])

  useEffect(() => {
    const itemCount = selectedCategory ? filteredAndSortedItems.length : 0
    const tagSuffix = selectedTag ? ` - ${selectedTag}` : ''
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.textPrimary }}>
            {selectedCategory?.name || 'Notes'}
          </Text>
          <Text style={{ fontSize: 16, color: theme.textSecondary, marginLeft: 6 }}>
            ({itemCount}つ){tagSuffix}
          </Text>
        </View>
      ),
      headerStyle: { backgroundColor: theme.surface },
    })
  }, [selectedCategory, filteredAndSortedItems.length, selectedTag, theme])

  useEffect(() => {
    if (!categoryIdFromDashboard || isLoading || categories.length === 0) return
    const match = categories.find((c) => c.id === categoryIdFromDashboard)
    if (match) { setSelectedCategory(match); closeSidebar() }
  }, [categoryIdFromDashboard, isLoading, categories])

  const handleAddCategory = () => { addCategory(newCategoryName); setNewCategoryName('') }

  const handleSelectCategory = (category) => {
    setSelectedCategory(category)
    setSelectedTag(null)
    clearSearch()
    closeSidebar()
  }

  const handleSaveItem = () => {
    const itemData = getItemData()
    if (editingItem !== null) { editItem(editingItem.id, itemData) } else { addItem(itemData) }
    closeModal()
    setExpandedIndex(null)
  }

  const handleDeleteItem = (itemId) => {
    Alert.alert(
      'Delete Item', 'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel', onPress: () => setExpandedIndex(null) },
        { text: 'Delete', style: 'destructive', onPress: () => { deleteItem(itemId); setExpandedIndex(null) } },
      ],
      { cancelable: true }
    )
  }

  const handleSortChange = (sortOrder) => {
    if (selectedCategory) updateCategorySortOrder(selectedCategory.id, sortOrder)
  }

  const handleImport = (data) => {
    const validation = validateImportData(data)
    if (!validation.valid) { Alert.alert('Error', validation.error); return }
    importData({ categories: processImportData(data) })
  }

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ fontSize: 18, color: theme.textSecondary }}>Loading your notes...</Text>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} onClear={clearSearch} />

      <View style={styles.topRow}>
        <SortButton
          sortOrder={selectedCategory?.sortOrder || 'alphabetical'}
          onSortChange={handleSortChange}
          selectedCategory={selectedCategory}
        />
        <FlashcardButton selectedCategory={selectedCategory} onPress={() => setFlashcardModalVisible(true)} />
      </View>

      <View style={styles.topRow}>
        <AddItemButton selectedCategory={selectedCategory} onPress={openModal} />
        <TagsDropdown
          selectedCategory={selectedCategory}
          selectedTag={selectedTag}
          onTagSelect={setSelectedTag}
        />
      </View>

      <View style={styles.body}>
        <ItemList
          items={filteredAndSortedItems}
          selectedCategory={selectedCategory}
          expandedIndex={expandedIndex}
          setExpandedIndex={setExpandedIndex}
          onEditItem={openEditModal}
          onDeleteItem={handleDeleteItem}
        />
      </View>

      <Sidebar
        slideAnim={slideAnim}
        onClose={closeSidebar}
        categories={categories}
        newCategoryName={newCategoryName}
        setNewCategoryName={setNewCategoryName}
        onAddCategory={handleAddCategory}
        onSelectCategory={handleSelectCategory}
        onDeleteCategory={deleteCategory}
        onRenameCategory={renameCategory}
        onExportImportPress={() => setExportImportModalVisible(true)}
        onToggleFavorite={toggleFavorite}
        selectedCategory={selectedCategory}
        handleSortChange={handleSortChange}
      />

      <ItemModal
        visible={modalVisible}
        onClose={closeModal}
        itemName={itemName}
        setItemName={setItemName}
        itemTags={itemTags}
        setItemTags={setItemTags}
        itemDesc={itemDesc}
        setItemDesc={setItemDesc}
        onSave={handleSaveItem}
        editingItem={editingItem}
        selectedCategory={selectedCategory}
        onPickImage={pickImage}
        onPickFromCamera={pickFromCamera}
        onRemoveImage={removeImage}
        images={images}
        setImages={setImages}
      />

      <ExportImportModal
        visible={exportImportModalVisible}
        onClose={() => setExportImportModalVisible(false)}
        onExport={() => exportData(categories)}
        onImport={handleImport}
      />

      <FlashcardModal
        visible={flashcardModalVisible}
        onClose={() => setFlashcardModalVisible(false)}
        items={filteredAndSortedItems}
        categoryName={selectedCategory?.name}
      />
    </View>
  )
}

export default Notes

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { justifyContent: 'center', alignItems: 'center' },
  body: { flex: 1, padding: 16,   paddingBottom: 100, },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
})