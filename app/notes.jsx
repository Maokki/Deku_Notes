// app/notes.jsx
import { StyleSheet, View, Text, Alert } from 'react-native'
import React, { useState } from 'react'

// Components
import Sidebar from '../components/Sidebar'
import AddItemButton from '../components/AddItemButton'
import ItemList from '../components/ItemList'
import ItemModal from '../components/ItemModal'
import SearchBar from '../components/SearchBar'
import SortButton from '../components/SortButton'
import TagsDropdown from '../components/TagsDropdown'
import ExportImportModal from '../components/ExportImportModal'
import FlashcardModal from '../components/FlashcardModal'
import FlashcardButton from '../components/FlashcardButton'

// Hooks
import { useCategories } from '../hooks/useCategories'
import { useSidebar } from '../hooks/useSidebar'
import { useItemModal } from '../hooks/useItemModal'
import { useSearch } from '../hooks/useSearch'
import { useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'

// Utils
import { exportData, processImportData, validateImportData } from '../utils/dataManager'

const Notes = () => {
  // Custom hooks
  const {
    categories,
    selectedCategory,
    isLoading,
    categorySortOrder,
    setSelectedCategory,
    addCategory,
    deleteCategory,
    addItem,
    editItem,
    deleteItem,
    updateCategorySortOrder,
    changeCategorySortOrder,
    importData,
    clearAllData
  } = useCategories()

  const {
    sidebarOpen,
    slideAnim,
    toggleSidebar,
    closeSidebar
  } = useSidebar()

  const {
    modalVisible,
    itemName,
    setItemName,
    itemTags,
    setItemTags,
    itemDesc,
    setItemDesc,
    editingItem,
    openModal,
    closeModal,
    openEditModal,
    getItemData
  } = useItemModal()

  const {
    searchQuery,
    setSearchQuery,
    filteredAndSortedItems,
    clearSearch
  } = useSearch(selectedCategory, selectedTag)

  // Local state
  const [newCategoryName, setNewCategoryName] = useState("")
  const [expandedIndex, setExpandedIndex] = useState(null)
  const [selectedTag, setSelectedTag] = useState(null)
  const [exportImportModalVisible, setExportImportModalVisible] = useState(false)
  const [flashcardModalVisible, setFlashcardModalVisible] = useState(false)

  // Open sidebar when Notes tab is focused
  useFocusEffect(
    useCallback(() => {
      if (!sidebarOpen) {
        toggleSidebar()
      }
    }, [])
  )
  // Handlers
  const handleAddCategory = () => {
    addCategory(newCategoryName)
    setNewCategoryName("")
  }

  const handleSelectCategory = (category) => {
    setSelectedCategory(category)
    setSelectedTag(null) // Clear tag filter when switching categories
    clearSearch() // Clear search when switching categories
    closeSidebar()
  }

  const handleSaveItem = () => {
    const itemData = getItemData()
    
    if (editingItem !== null) {
      editItem(editingItem.id, itemData)
    } else {
      addItem(itemData)
    }
    
    closeModal()
    setExpandedIndex(null)
  }

  const handleEditItem = (item) => {
    openEditModal(item)
  }

  const handleDeleteItem = (itemId) => {
    deleteItem(itemId)
    setExpandedIndex(null)
  }

  const handleSortChange = (sortOrder) => {
    if (selectedCategory) {
      updateCategorySortOrder(selectedCategory.id, sortOrder)
    }
  }

  const handleExport = async () => {
    await exportData(categories)
  }

  const handleImport = (data) => {
    const validation = validateImportData(data)
    if (!validation.valid) {
      Alert.alert('Error', validation.error)
      return
    }
    
    const processedCategories = processImportData(data)
    importData({ categories: processedCategories })
    Alert.alert('Success', 'Data imported successfully!')
  }

  const handleOpenFlashcards = () => {
    setFlashcardModalVisible(true)
  }

  const handleTagSelect = (tag) => {
    setSelectedTag(tag)
  }

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Loading your notes...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <SearchBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onClear={clearSearch}
      />

      <View style={styles.topRow}>
        <SortButton 
          sortOrder={selectedCategory?.sortOrder || 'alphabetical'}
          onSortChange={handleSortChange}
          selectedCategory={selectedCategory}
        />
        <FlashcardButton 
          selectedCategory={selectedCategory} 
          onPress={handleOpenFlashcards} 
        />
      </View>

      <View style={styles.topRow2}>
        <AddItemButton 
          selectedCategory={selectedCategory} 
          onPress={openModal} 
        />
        <TagsDropdown 
          selectedCategory={selectedCategory}
          selectedTag={selectedTag}
          onTagSelect={handleTagSelect}
        />
      </View>

      <View style={styles.body}>
        <ItemList
          items={filteredAndSortedItems}
          selectedCategory={selectedCategory}
          expandedIndex={expandedIndex}
          selectedTag={selectedTag}
          setExpandedIndex={setExpandedIndex}
          onEditItem={handleEditItem}
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
        onExportImportPress={() => setExportImportModalVisible(true)}
        selectedCategory={selectedCategory}       // add this
        handleSortChange={handleSortChange}       // add this
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
      />

      <ExportImportModal
        visible={exportImportModalVisible}
        onClose={() => setExportImportModalVisible(false)}
        onExport={handleExport}
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
  container: { 
    flex: 1, 
    backgroundColor: "#fdfdfd" 
  },
  body: { 
    flex: 1, 
    padding: 16 
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  topRow2: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 8,
  }
})