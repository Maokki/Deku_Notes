import { useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system/legacy'

import { Observe } from 'expo-observe'

const EMPTY_FORM = { itemName: '', itemTags: '', itemDesc: '', images: [] } //added new field for images

export const useItemModal = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const setField = (field) => (value) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const openModal = () => setModalVisible(true)

  const closeModal = () => {
    setModalVisible(false)
    setEditingItem(null)
    setForm(EMPTY_FORM)
  }

  const openEditModal = (item) => {
    console.log('item.images on edit:', item.images)
    setForm({
      itemName: item.name,
      itemTags: item.tags.join(', '),
      itemDesc: item.description,
      images: item.images || [], // populate images if they exist
    })
    setEditingItem(item)
    setModalVisible(true)
  }

  // Copy picked image to permanent app storage so URI persists across restarts
  const saveImagePermanently = async (tempUri) => {
    const fileName = `deku_img_${Date.now()}.jpg`
    const destUri = FileSystem.documentDirectory + fileName
    console.log('copying image to:', destUri)
    await FileSystem.copyAsync({ from: tempUri, to: destUri })
    console.log('image saved successfully')
    return destUri
  }

  const pickImage = async () => {
    console.log('pickImage called')
    try {
      // Request permission
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (!permission.granted) {
        alert('Please allow access to your gallery in your device settings.')
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],      // replaces deprecated MediaTypeOptions.Images
        allowsMultipleSelection: true,
        allowsEditing: false,
        quality: 0.7,
        selectionLimit: 5,
        orderedSelection: true,
      })

      if (result.canceled) return

      const assets = result.assets || []
      if (assets.length === 0) return

      const permanentUris = await Promise.all(
        assets.map((asset) => saveImagePermanently(asset.uri))
      )

      Observe.logEvent('photo_added', { source: 'gallery', count: permanentUris.length })

      setForm((prev) => {
        const combined = [...prev.images, ...permanentUris]
        return { ...prev, images: combined.slice(0, 5) }
      })

    } catch (error) {
      console.error('Image picker error:', error)
      alert('Something went wrong while picking images. Please try again.')
    }
  }
  
  const pickFromCamera = async () => {
    Observe.logEvent('photo_added', { source: 'camera' })
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync()
      if (!permission.granted) {
        alert('Please allow camera access in your device settings.')
        return
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,   // lets user crop/adjust after taking the photo
        quality: 0.7,
      })

      if (result.canceled) return

      const asset = result.assets?.[0]
      if (!asset) return

      const permanentUri = await saveImagePermanently(asset.uri)

      setForm((prev) => {
        const combined = [...prev.images, permanentUri]
        return { ...prev, images: combined.slice(0, 5) }
      })

    } catch (error) {
      console.error('Camera error:', error)
      alert('Something went wrong with the camera. Please try again.')
    }
  }

  const removeImage = (uri) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== uri),
    }))
  }

  const getItemData = () => ({
    name: form.itemName,
    tags: form.itemTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    description: form.itemDesc,
    images: form.images, // include images in the returned data
  })

  return {
    modalVisible,
    itemName: form.itemName,
    setItemName: setField('itemName'),
    itemTags: form.itemTags,
    setItemTags: setField('itemTags'),
    itemDesc: form.itemDesc,
    setItemDesc: setField('itemDesc'),
    images: form.images, // expose images for display in the modal
    editingItem,
    openModal,
    closeModal,
    openEditModal,
    pickImage, // function to pick images from gallery
    pickFromCamera, 
    removeImage,
    getItemData,
  }
}