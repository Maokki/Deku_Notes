import { useState } from 'react'

export const useItemModal = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [itemName, setItemName] = useState("")
  const [itemTags, setItemTags] = useState("")
  const [itemDesc, setItemDesc] = useState("")
  const [editingItem, setEditingItem] = useState(null)

  const openModal = () => setModalVisible(true)
  
  const closeModal = () => {
    setModalVisible(false)
    setItemName("")
    setItemTags("")
    setItemDesc("")
    setEditingItem(null)
  }

  const openEditModal = (item) => {
    setItemName(item.name)
    setItemTags(item.tags.join(", "))
    setItemDesc(item.description)
    setEditingItem(item)
    setModalVisible(true)
  }

  const getItemData = () => ({
    name: itemName,
    tags: itemTags.split(",").map(t => t.trim()),
    description: itemDesc
  })

  return {
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
  }
}