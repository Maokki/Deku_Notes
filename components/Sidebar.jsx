import { StyleSheet, Text, View, TextInput, TouchableOpacity, Animated, Alert, ScrollView, Modal, KeyboardAvoidingView, Platform, Switch } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useThemeContext } from '../context'

const Sidebar = ({
  slideAnim,
  categories,
  newCategoryName,
  setNewCategoryName,
  onAddCategory,
  onSelectCategory,
  onDeleteCategory,
  onRenameCategory,
  onExportImportPress,
  onToggleFavorite,
}) => {
  const [menuVisible, setMenuVisible] = useState(null)
  const [renameModalVisible, setRenameModalVisible] = useState(false)
  const [categoryToRename, setCategoryToRename] = useState(null)
  const [renameCategoryValue, setRenameCategoryValue] = useState('')
  const { isDark, toggleTheme, theme } = useThemeContext()

  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [categorySearchQuery, setCategorySearchQuery] = useState('')
  const categoryInputRef = useRef(null)

  // Sidebar has its own surface colors since it overlays the screen
  const sb = {
    bg:           isDark ? '#1a1a1a' : '#2c2c2c',
    border:       isDark ? '#2e2e2e' : '#444444',
    text:         isDark ? '#e0e0e0' : '#ffffff',
    textMuted:    isDark ? '#888888' : '#aaaaaa',
    inputBg:      isDark ? '#2a2a2a' : '#3a3a3a',
    inputBorder:  isDark ? '#3a3a3a' : '#555555',
    dropdownBg:   isDark ? '#252525' : '#444444',
    dropdownBorder: isDark ? '#333333' : '#555555',
    modalBg:      isDark ? '#1e1e1e' : '#3a3a3a',
    cancelBtn:    isDark ? '#3a3a3a' : '#666666',
  }

  useEffect(() => {
    if (isAddingCategory) categoryInputRef.current?.focus()
  }, [isAddingCategory])

  const handleStartAdd = () => {
    setNewCategoryName('')
    setIsAddingCategory(true)
  }

  const handleConfirmAdd = () => {
    if (!newCategoryName.trim()) return
    onAddCategory()
    setIsAddingCategory(false)
  }

  const handleInputBlur = () => {
    if (isAddingCategory && !newCategoryName.trim()) {
      setIsAddingCategory(false)
    }
  }

  const visibleCategories = isAddingCategory
    ? categories
    : categories.filter((cat) =>
        cat.name.toLowerCase().includes(categorySearchQuery.trim().toLowerCase())
      )

  const handleRenamePress = (category) => {
    setCategoryToRename(category)
    setRenameCategoryValue(category.name)
    setMenuVisible(null)
    setRenameModalVisible(true)
  }

  const handleRenameSubmit = () => {
    if (renameCategoryValue.trim() && categoryToRename) {
      onRenameCategory(categoryToRename.id, renameCategoryValue.trim())
      setRenameModalVisible(false)
      setCategoryToRename(null)
      setRenameCategoryValue('')
    }
  }

  const handleDeletePress = (category) => {
    setMenuVisible(null)
    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${category.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDeleteCategory(category.id) }
      ]
    )
  }

  return (
    <Animated.View style={[styles.sidebar, { backgroundColor: sb.bg, transform: [{ translateX: slideAnim }] }]}>
      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">

        {/* Top Row: Cloud backup + Dark mode toggle */}
        <View style={[styles.topRow, { borderBottomColor: sb.border }]}>
          <TouchableOpacity style={[styles.exportBtn, {backgroundColor: theme.warning}]} onPress={onExportImportPress}>
            <Ionicons name="cloud-outline" size={22} color="#fff" />
          </TouchableOpacity>

          <View style={styles.themeRow}>
            <Ionicons
              name={isDark ? 'moon' : 'sunny-outline'}
              size={18}
              color={isDark ? '#7ecbff' : '#FFD700'}
            />
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#555', true: '#0067FF' }}
              thumbColor={isDark ? '#fff' : '#f0f0f0'}
            />
          </View>
        </View>

        {/* Add Category */}
        <View style={styles.addCategoryRow}>
          <TextInput
            ref={categoryInputRef}
            value={isAddingCategory ? newCategoryName : categorySearchQuery}
            onChangeText={isAddingCategory ? setNewCategoryName : setCategorySearchQuery}
            onBlur={handleInputBlur}
            onSubmitEditing={isAddingCategory ? handleConfirmAdd : undefined}
            placeholder={isAddingCategory ? 'New category name' : 'Search categories'}
            placeholderTextColor={sb.textMuted}
            style={[styles.categoryInput, { backgroundColor: sb.inputBg, borderColor: sb.inputBorder, color: sb.text }]}
          />
          <TouchableOpacity
            style={[styles.addCategoryBtn, { backgroundColor: theme.primary }]}
            onPress={isAddingCategory ? handleConfirmAdd : handleStartAdd}
          >
            <Ionicons name={isAddingCategory ? 'checkmark' : 'add'} size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Category list */}
        <View style={styles.categories}>
          {[...visibleCategories]
            .sort((a, b) => {
              if (!!a.favorite !== !!b.favorite) return a.favorite ? -1 : 1
              return a.name.localeCompare(b.name)
            })
            .map((cat, index) => {
              const isMenuOpen = menuVisible === cat.id
              const isLastTwo = index >= visibleCategories.length - 2

              return (
                <View
                  key={cat.id || index}
                  style={[
                    styles.categoryRow,
                    { borderBottomColor: sb.border },
                    isMenuOpen && { zIndex: 9999, elevation: 13 }
                  ]}
                >
                  <TouchableOpacity onPress={() => onSelectCategory(cat)} style={styles.categoryTouchable}>
                    <Text style={[styles.categoryItem, { color: sb.text }]}>{cat.favorite ? '⭐' : '📂'} {cat.name}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setMenuVisible(isMenuOpen ? null : cat.id)}
                    style={styles.menuButton}
                  >
                    <Ionicons name="ellipsis-vertical" size={20} color={sb.textMuted} />
                  </TouchableOpacity>

                  {isMenuOpen && (
                    <View style={[
                      styles.dropdownMenu,
                      { backgroundColor: sb.dropdownBg, borderColor: sb.dropdownBorder },
                      isLastTwo && styles.dropdownMenuBottom,
                    ]}>
                      {/* Favorite toggle */}
                      <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                          onToggleFavorite(cat.id)
                          setMenuVisible(null)
                        }}
                      >
                        <Ionicons
                          name={cat.favorite ? 'star' : 'star-outline'}
                          size={18}
                          color="#FFD700"
                        />
                        <Text style={[styles.menuItemText, { color: sb.text }]}>
                          {cat.favorite ? 'Unfavorite' : 'Favorite'}
                        </Text>
                      </TouchableOpacity>

                      {/* Rename */}
                      <TouchableOpacity
                        style={[styles.menuItem, { borderTopColor: sb.dropdownBorder, borderTopWidth: 1 }]}
                        onPress={() => handleRenamePress(cat)}
                      >
                        <Ionicons name="create-outline" size={18} color="#4CAF50" />
                        <Text style={[styles.menuItemText, { color: sb.text }]}>Rename</Text>
                      </TouchableOpacity>

                      {/* Delete */}
                      <TouchableOpacity
                        style={[styles.menuItem, { borderTopColor: sb.dropdownBorder, borderTopWidth: 1 }]}
                        onPress={() => handleDeletePress(cat)}
                      >
                        <Ionicons name="trash-outline" size={18} color="#e74c3c" />
                        <Text style={[styles.menuItemText, { color: '#e74c3c' }]}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )
            })}

            {visibleCategories.length === 0 && (
              <Text style={[styles.emptyText, { color: sb.textMuted }]}>
                No categories found
              </Text>
            )}
        </View>
      </ScrollView>

      {/* Rename Modal */}
      <Modal
        visible={renameModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setRenameModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setRenameModalVisible(false)}
          >
            <View
              style={[styles.modalContent, { backgroundColor: sb.modalBg, borderColor: sb.border, borderWidth: 1 }]}
              onStartShouldSetResponder={() => true}
            >
              <Text style={[styles.modalTitle, { color: sb.text }]}>Rename Category</Text>

              <TextInput
                value={renameCategoryValue}
                onChangeText={setRenameCategoryValue}
                placeholder="Category name"
                placeholderTextColor={sb.textMuted}
                style={[styles.modalInput, { backgroundColor: sb.inputBg, borderColor: sb.inputBorder, color: sb.text }]}
                autoFocus
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: sb.cancelBtn }]}
                  onPress={() => setRenameModalVisible(false)}
                >
                  <Text style={[styles.buttonText, { color: sb.text }]}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton, {backgroundColor: theme.primary}]}
                  onPress={handleRenameSubmit}
                >
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
    </Animated.View>
  )
}

export default Sidebar

const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 250,
    height: '100%',
    padding: 16,
    paddingTop: 24,
    paddingBottom: 100,
    zIndex: 100,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  exportBtn: {
    backgroundColor: '#FF9800',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categories: {
    marginTop: 20,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    borderBottomWidth: 1,
    paddingBottom: 4,
    position: 'relative',
  },
  categoryTouchable: {
    flex: 1,
  },
  categoryItem: {
    fontSize: 16,
    paddingVertical: 8,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 20,
    fontStyle: 'italic',
  },
  menuButton: {
    padding: 8,
  },
  dropdownMenu: {
    position: 'absolute',
    right: 0,
    top: 40,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 130,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 1000,
  },
  dropdownMenuBottom: {
    top: 'auto',
    bottom: 40,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  menuItemText: {
    fontSize: 15,
  },
  addCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    marginRight: 8,
  },
  addCategoryBtn: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
  },
  modalContent: {
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
})