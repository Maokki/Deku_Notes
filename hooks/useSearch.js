import { useState, useMemo } from 'react'
import { filterItems, sortItems } from '../utils/searchUtils'

export const useSearch = (selectedCategory, selectedTag = null) => {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredAndSortedItems = useMemo(() => {
    if (!selectedCategory || !selectedCategory.items) return []
    
    let items = selectedCategory.items
    
    // Apply tag filter first
    if (selectedTag) {
      items = items.filter(item => 
        item.tags && 
        Array.isArray(item.tags) && 
        item.tags.includes(selectedTag)
      )
    }
    
    // Apply search filter
    items = filterItems(items, searchQuery)
    
    // Apply sorting
    items = sortItems(items, selectedCategory.sortOrder || 'alphabetical')
    
    return items
  }, [selectedCategory, searchQuery, selectedTag])

  const clearSearch = () => {
    setSearchQuery('')
  }

  return {
    searchQuery,
    setSearchQuery,
    filteredAndSortedItems,
    clearSearch
  }
}