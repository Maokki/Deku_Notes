import { Alert } from 'react-native'
import * as FileSystem from 'expo-file-system/legacy'
import * as Sharing from 'expo-sharing'

export const exportData = async (categories) => {
  try {
    const exportData = {
      categories: categories.map(cat => ({
        ...cat,
        items: cat.items.map(item => ({
          ...item,
          createdAt: item.createdAt || new Date().toISOString(),
          updatedAt: item.updatedAt || new Date().toISOString()
        }))
      })),
      exportedAt: new Date().toISOString(),
      version: '1.0'
    }

    const jsonString = JSON.stringify(exportData, null, 2)
    const fileName = `maomao_notes_${new Date().toISOString().split('T')[0]}.json`
    
    // Use legacy API for better compatibility
    const fileUri = FileSystem.documentDirectory + fileName
    
    // Write the JSON file
    await FileSystem.writeAsStringAsync(fileUri, jsonString)

    // Check if sharing is available
    const isAvailable = await Sharing.isAvailableAsync()
    if (isAvailable) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: 'Export MaoMao Notes Data',
        UTI: 'public.json'
      })
      Alert.alert('Success', 'Data exported successfully!')
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

  if (!data.categories || !Array.isArray(data.categories)) {
    return { valid: false, error: 'Invalid file format. Categories array is required.' }
  }

  for (let i = 0; i < data.categories.length; i++) {
    const category = data.categories[i]
    if (!category.name || typeof category.name !== 'string') {
      return { valid: false, error: `Category ${i + 1} must have a valid name.` }
    }

    if (!category.items || !Array.isArray(category.items)) {
      return { valid: false, error: `Category "${category.name}" must have an items array.` }
    }

    for (let j = 0; j < category.items.length; j++) {
      const item = category.items[j]
      if (!item.name || typeof item.name !== 'string') {
        return { valid: false, error: `Item ${j + 1} in category "${category.name}" must have a valid name.` }
      }
      if (!item.tags || !Array.isArray(item.tags)) {
        return { valid: false, error: `Item "${item.name}" must have a tags array.` }
      }
    }
  }

  return { valid: true }
}

export const processImportData = (data) => {
  return data.categories.map(cat => ({
    id: cat.id || generateId(),
    name: cat.name,
    sortOrder: cat.sortOrder || 'alphabetical',
    createdAt: cat.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: cat.items.map(item => ({
      id: item.id || generateId(),
      name: item.name,
      tags: Array.isArray(item.tags) ? item.tags : [],
      description: item.description || '',
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }))
  }))
}

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
}