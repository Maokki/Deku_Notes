//Sidebar.jsx from components
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Animated, Alert, ScrollView, Modal } from 'react-native'
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
  onRenameCategory, //added here 
  onExportImportPress
}) => {

  //for functions to handle rename and delete
  const [menuVisible, setMenuVisible] = useState(null); 
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [categoryToRename, setCategoryToRename] = useState(null);
  const [renameCategoryValue, setRenameCategoryValue] = useState('');

  const handleRenamePress = (category) => { //when rename is pressed
    setCategoryToRename(category);
    setRenameCategoryValue(category.name);
    setMenuVisible(null);
    setRenameModalVisible(true);
  };

  const handleRenameSubmit = () => { //then saved
    if (renameCategoryValue.trim() && categoryToRename) {
      onRenameCategory(categoryToRename.id, renameCategoryValue.trim());
      setRenameModalVisible(false);
      setCategoryToRename(null);
      setRenameCategoryValue('');
    }
  };

  const handleDeletePress = (category) => { //delete function moved here, shows a dialog
    setMenuVisible(null);
    Alert.alert(
      "Delete Category",
      `Are you sure you want to delete "${category.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => onDeleteCategory(category.id) 
        }
      ]
    );
  };

  return (
    <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
      <ScrollView>
        {/* Top Row: Backup Button */}
        <View style={styles.topRow}>
          <TouchableOpacity 
            style={[styles.exportImportBtn, { backgroundColor: '#FF9800' }]} 
            onPress={onExportImportPress}
          >
            <Ionicons name="cloud-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Backup</Text>
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
          {[...categories]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((cat, index) => (
              <View key={cat.id || index} style={styles.categoryRow}>
                <TouchableOpacity
                  onPress={() => onSelectCategory(cat)}
                  style={styles.categoryTouchable}
                >
                  <Text style={styles.categoryItem}>📂 {cat.name}</Text>
                </TouchableOpacity>

                {/* Three-dot menu button */}
                <TouchableOpacity 
                  onPress={() => setMenuVisible(menuVisible === cat.id ? null : cat.id)}
                  style={styles.menuButton}
                >
                  <Ionicons name="ellipsis-vertical" size={20} color="#aaa" />
                </TouchableOpacity>

                {/* Dropdown menu, dialog after 3 dotted is pressed */}
                {menuVisible === cat.id && (
                  <View style={styles.dropdownMenu}>
                    <TouchableOpacity //rename button
                      style={styles.menuItem}
                      onPress={() => handleRenamePress(cat)}
                    >
                      <Ionicons name="create-outline" size={18} color="#fff" />
                      <Text style={styles.menuItemText}>Rename</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity //delete button moved here
                      style={[styles.menuItem, styles.deleteMenuItem]}
                      onPress={() => handleDeletePress(cat)}
                    >
                      <Ionicons name="trash-outline" size={18} color="#f66" />
                      <Text style={[styles.menuItemText, { color: '#f66' }]}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
        </View>
      </ScrollView>

      {/* Rename Modal */}
      <Modal
        visible={renameModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setRenameModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setRenameModalVisible(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Rename Category</Text>
            
            <TextInput
              value={renameCategoryValue}
              onChangeText={setRenameCategoryValue}
              placeholder="Category name"
              placeholderTextColor="#aaa"
              style={styles.modalInput}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setRenameModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleRenameSubmit}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
    marginBottom: 16,
  },
  exportImportBtn: {
    height: 40,
    backgroundColor: '#FF9800',
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 6,
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
    position: 'relative',
  },
  categoryTouchable: {
    flex: 1,
  },
  categoryItem: { 
    color: "#fff", 
    fontSize: 16, 
    paddingVertical: 8 
  },
  menuButton: {
    padding: 8,
  },
  dropdownMenu: {
    position: 'absolute',
    right: 0,
    top: 40,
    backgroundColor: '#444',
    borderRadius: 8,
    minWidth: 130,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  deleteMenuItem: {
    borderTopWidth: 1,
    borderTopColor: '#555',
  },
  menuItemText: {
    color: '#fff',
    fontSize: 15,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#444',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 6,
    padding: 12,
    color: '#fff',
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
  cancelButton: {
    backgroundColor: '#666',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
})