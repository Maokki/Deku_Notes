// utils/dataManager.js
import { Alert } from 'react-native'
import * as FileSystem from 'expo-file-system/legacy'
import * as Sharing from 'expo-sharing'

import { Observe } from 'expo-observe'

export const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).substring(2, 7)

export const exportData = async (categories) => {
  try {
    const payload = {
      categories: categories.map((cat) => ({
        ...cat,
        items: cat.items.map((item) => ({
          ...item,
          createdAt: item.createdAt || new Date().toISOString(),
          updatedAt: item.updatedAt || new Date().toISOString(),
        })),
      })),
      exportedAt: new Date().toISOString(),
      version: '1.0',
    }

    const jsonString = JSON.stringify(payload, null, 2)
    const fileName = `deku_notes_${new Date().toISOString().split('T')[0]}.json`
    const fileUri = FileSystem.documentDirectory + fileName

    await FileSystem.writeAsStringAsync(fileUri, jsonString)
    Observe.logEvent('backup_created', { categoryCount: categories.length })

    const isAvailable = await Sharing.isAvailableAsync()
    if (isAvailable) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: 'Export Deku Notes Data',
        UTI: 'public.json',
      })
    } else {
      Alert.alert('Export Complete', `Data saved to: ${fileName}`)
    }
  } catch (error) {
    console.error('Export error:', error)
    Alert.alert('Error', 'Failed to export data: ' + error.message)
  }
}

export const validateImportData = (data) => {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid data format. Please select a valid JSON file.' }
  }
  if (!Array.isArray(data.categories)) {
    return { valid: false, error: 'Invalid file format. Categories array is required.' }
  }

  for (let i = 0; i < data.categories.length; i++) {
    const cat = data.categories[i]
    if (!cat.name || typeof cat.name !== 'string') {
      return { valid: false, error: `Category ${i + 1} must have a valid name.` }
    }
    if (!Array.isArray(cat.items)) {
      return { valid: false, error: `Category "${cat.name}" must have an items array.` }
    }
    for (let j = 0; j < cat.items.length; j++) {
      const item = cat.items[j]
      if (!item.name || typeof item.name !== 'string') {
        return { valid: false, error: `Item ${j + 1} in "${cat.name}" must have a valid name.` }
      }
      if (!Array.isArray(item.tags)) {
        return { valid: false, error: `Item "${item.name}" must have a tags array.` }
      }
    }
  }

  return { valid: true }
}

export const processImportData = (data) =>
  data.categories.map((cat) => ({
    id: cat.id || generateId(),
    name: cat.name,
    sortOrder: cat.sortOrder || 'alphabetical',
    favorite: cat.favorite || false,
    createdAt: cat.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: cat.items.map((item) => ({
      id: item.id || generateId(),
      name: item.name,
      tags: Array.isArray(item.tags) ? item.tags : [],
      description: item.description || '',
      images: Array.isArray(item.images) ? item.images : [],
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),
  }))