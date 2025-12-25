export const filterItems = (items, searchQuery) => {
  if (!searchQuery.trim()) return items

  const query = searchQuery.toLowerCase()
  
  return items.filter(item => {
    const nameMatch = item.name.toLowerCase().includes(query)
    const descMatch = item.description?.toLowerCase().includes(query)
    const tagMatch = item.tags.some(tag => tag.toLowerCase().includes(query))
    
    return nameMatch || descMatch || tagMatch
  })
}

export const sortItems = (items, sortOrder) => {
  const sortedItems = [...items]
  
  switch (sortOrder) {
    case 'alphabetical':
      return sortedItems.sort((a, b) => a.name.localeCompare(b.name))
    
    case 'date':
      return sortedItems.sort((a, b) => {
        const aDate = new Date(a.createdAt || 0)
        const bDate = new Date(b.createdAt || 0)
        return bDate - aDate // Newest first
      })
    
    default:
      return sortedItems
  }
}