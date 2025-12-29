//Sidebar.js from hooks
import { useState, useRef } from 'react'
import { Animated } from 'react-native'

export const useSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const slideAnim = useRef(new Animated.Value(-250)).current

  const toggleSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: sidebarOpen ? -250 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start()
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: -250,
      duration: 300,
      useNativeDriver: true,
    }).start()
    setSidebarOpen(false)
  }

  return {
    sidebarOpen,
    slideAnim,
    toggleSidebar,
    closeSidebar
  }
}