// components/UpdateBanner.jsx

import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import * as Updates from 'expo-updates'
import { useThemeContext } from '../context'

const UpdateBanner = () => {
  const { theme } = useThemeContext()
  const { isUpdateAvailable, isUpdatePending } = Updates.useUpdates()

  if (!isUpdateAvailable && !isUpdatePending) return null

  const handleReload = async () => {
    try {
      await Updates.reloadAsync()
    } catch (error) {
      console.error('Error reloading app:', error)
    }
  }

  return (
    <TouchableOpacity style={[styles.banner, { backgroundColor: theme.secondary }]} onPress={handleReload}>
      <Ionicons name="refresh-circle" size={20} color="#fff" />
      <Text style={styles.text}>Update ready — tap to reload</Text>
    </TouchableOpacity>
  )
}

export default UpdateBanner

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  text: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: 'bold',
  },
})