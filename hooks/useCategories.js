//useCategories.js from hooks
import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { generateId } from '../utils/dataManager'

const STORAGE_KEY = 'maomao_notes_data'

export const useCategories = () => {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load data from AsyncStorage on app start
  useEffect(() => {
    loadData()
  }, [])

  // Save data to AsyncStorage whenever categories change
  useEffect(() => {
    if (!isLoading) {
      saveData()
    }
  }, [categories, isLoading])

  const loadData = async () => {
    try {
      const savedData = await AsyncStorage.getItem(STORAGE_KEY)
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        setCategories(parsedData.categories || [])
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveData = async () => {
    try {
      const dataToSave = {
        categories,
        savedAt: new Date().toISOString()
      }
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
    } catch (error) {
      console.error('Error saving data:', error)
    }
  }

  const addCategory = (name) => {
    if (name.trim() === "") return;
    const newCategory = {
      id: generateId(),
      name,
      items: [],
      sortOrder: 'alphabetical',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setCategories([newCategory, ...categories]); // prepend at top
  };

  const renameCategory = (categoryId, newName) => {
    if (newName.trim() === "") return;
    
    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          name: newName.trim(),
          updatedAt: new Date().toISOString()
        }
      }
      return cat
    })
    
    setCategories(updatedCategories)
    
    // Update selected category if it's the one being renamed
    if (selectedCategory && selectedCategory.id === categoryId) {
      const updatedSelected = updatedCategories.find(cat => cat.id === categoryId)
      setSelectedCategory(updatedSelected)
    }
  }

  const deleteCategory = (id) => {
    setCategories(categories.filter(cat => cat.id !== id))
    if (selectedCategory?.id === id) setSelectedCategory(null)
  }

  const addItem = (item) => {
    if (!selectedCategory) return
    if (item.name.trim() === "") return

    const newItem = {
      ...item,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const updatedCategories = categories.map(cat => {
      if (cat.id === selectedCategory.id) {
        return {
          ...cat,
          items: [...cat.items, newItem],
          updatedAt: new Date().toISOString()
        }
      }
      return cat
    })

    setCategories(updatedCategories)
    
    // Update selected category to reflect changes immediately
    const updatedSelectedCategory = updatedCategories.find(cat => cat.id === selectedCategory.id)
    setSelectedCategory(updatedSelectedCategory)
  }

  const editItem = (itemId, updatedItem) => {
    if (!selectedCategory) return

    const itemWithTimestamp = {
      ...updatedItem,
      id: itemId, // Preserve the original ID
      updatedAt: new Date().toISOString()
    }

    const updatedCategories = categories.map(cat => {
      if (cat.id === selectedCategory.id) {
        const updatedItems = cat.items.map(item =>
          item.id === itemId ? itemWithTimestamp : item
        )
        return { 
          ...cat, 
          items: updatedItems,
          updatedAt: new Date().toISOString()
        }
      }
      return cat
    })

    setCategories(updatedCategories)
    
    // Update selected category to reflect changes immediately
    const updatedSelectedCategory = updatedCategories.find(cat => cat.id === selectedCategory.id)
    setSelectedCategory(updatedSelectedCategory)
  }

  const deleteItem = (itemId) => {
    if (!selectedCategory) return

    const updatedCategories = categories.map(cat => {
      if (cat.id === selectedCategory.id) {
        return {
          ...cat,
          items: cat.items.filter(item => item.id !== itemId),
          updatedAt: new Date().toISOString()
        }
      }
      return cat
    })

    setCategories(updatedCategories)
    
    // Update selected category to reflect changes immediately
    const updatedSelectedCategory = updatedCategories.find(cat => cat.id === selectedCategory.id)
    setSelectedCategory(updatedSelectedCategory)
  }

  const updateCategorySortOrder = (categoryId, sortOrder) => {
    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          sortOrder,
          updatedAt: new Date().toISOString()
        }
      }
      return cat
    })
    setCategories(updatedCategories)
    
    // Update selected category if it's the one being modified
    if (selectedCategory && selectedCategory.id === categoryId) {
      const updatedSelected = updatedCategories.find(cat => cat.id === categoryId)
      setSelectedCategory(updatedSelected)
    }
  }

  const importData = (data) => {
    setCategories(data.categories)
    setSelectedCategory(null)
  }

  const clearAllData = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY)
      setCategories([])
      setSelectedCategory(null)
    } catch (error) {
      console.error('Error clearing data:', error)
    }
  }

  return {
    categories,
    selectedCategory,
    isLoading,
    setSelectedCategory,
    addCategory,
    renameCategory,
    deleteCategory,
    addItem,
    editItem,
    deleteItem,
    updateCategorySortOrder,
    importData,
    clearAllData
  }
}