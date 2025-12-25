import { StyleSheet, Text, View, TextInput, TouchableOpacity, Modal } from 'react-native'
import React from 'react'

const ItemModal = ({ 
  visible, 
  onClose, 
  itemName, 
  setItemName, 
  itemTags, 
  setItemTags, 
  itemDesc, 
  setItemDesc, 
  onSave, 
  editingItem 
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>
            {editingItem !== null ? "Edit Item" : "Add New Item"}
          </Text>

          <TextInput
            placeholder="Name"
            value={itemName}
            onChangeText={setItemName}
            style={styles.modalInput}
          />
          <TextInput
            placeholder="Tags (comma separated)"
            value={itemTags}
            onChangeText={setItemTags}
            style={styles.modalInput}
          />
          <TextInput
            placeholder="Description"
            value={itemDesc}
            onChangeText={setItemDesc}
            style={[styles.modalInput, { height: 220, textAlignVertical: "top" }]}
            multiline
          />

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
              <Text style={styles.btnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default ItemModal

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
  },
  modalTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginBottom: 12 
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  modalActions: { 
    flexDirection: "row", 
    justifyContent: "flex-end", 
    marginTop: 10 
  },
  cancelBtn: { 
    backgroundColor: "#aaa", 
    padding: 10, 
    borderRadius: 6, 
    marginRight: 10 
  },
  saveBtn: { 
    backgroundColor: "#4CAF50", 
    padding: 10, 
    borderRadius: 6 
  },
  btnText: { 
    color: "#fff", 
    fontWeight: "bold" 
  },
})