import { useState, useEffect, useCallback } from 'react'

export const useDashboardStats = (categories) => {
  const [stats, setStats] = useState({
    totalItems: 0,
    totalCategories: 0,
  })

  const calculateStats = useCallback(() => {
    if (!categories || categories.length === 0) {
      setStats({
        totalItems: 0,
        totalCategories: 0,
      })
      return
    }

    // Calculate total items
    const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0)

    setStats({
      totalItems,
      totalCategories: categories.length,
    })
  }, [categories])

  useEffect(() => {
    calculateStats()
  }, [calculateStats])

  const refreshStats = useCallback(async () => {
    // Simulate a small delay for refresh animation
    await new Promise(resolve => setTimeout(resolve, 500))
    calculateStats()
  }, [calculateStats])

  return {
    ...stats,
    refreshStats
  }
}