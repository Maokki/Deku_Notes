// utils/sortUtils.js

/**
 * Natural sort comparator that handles numbers intelligently
 * Sorts "Item 2" before "Item 10" instead of after
 */
export const naturalSort = (a, b) => {
  const ax = [];
  const bx = [];

  // Split strings into chunks of numbers and non-numbers
  a.replace(/(\d+)|(\D+)/g, (_, num, str) => {
    ax.push([num || Infinity, str || '']);
  });
  
  b.replace(/(\d+)|(\D+)/g, (_, num, str) => {
    bx.push([num || Infinity, str || '']);
  });

  // Compare chunk by chunk
  while (ax.length && bx.length) {
    const an = ax.shift();
    const bn = bx.shift();
    const nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
    if (nn) return nn;
  }

  return ax.length - bx.length;
};

/**
 * Sort items based on sortOrder preference
 * @param {Array} items - Array of items to sort
 * @param {string} sortOrder - 'alphabetical', 'newest', or 'oldest'
 * @returns {Array} Sorted array
 */
export const sortItems = (items, sortOrder = 'alphabetical') => {
  if (!items || items.length === 0) return [];
  
  const itemsCopy = [...items];
  
  switch (sortOrder) {
    case 'alphabetical':
      return itemsCopy.sort((a, b) => naturalSort(a.name, b.name));
    
    case 'newest':
      return itemsCopy.sort((a, b) => {
        // Always use createdAt for date sorting, never updatedAt
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA; // Newest first (descending)
      });
    
    case 'oldest':
      return itemsCopy.sort((a, b) => {
        // Always use createdAt for date sorting, never updatedAt
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateA - dateB; // Oldest first (ascending)
      });
    
    default:
      return itemsCopy;
  }
};