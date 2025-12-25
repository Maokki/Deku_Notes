import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

const StatisticsCard = ({ title, value, icon, color, subtitle, onPress }) => {
  const CardComponent = onPress ? TouchableOpacity : View

  return (
    <CardComponent style={[styles.card, { borderLeftColor: color }]} onPress={onPress}>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Ionicons name={icon} size={24} color={color} />
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
        <Text style={[styles.cardValue, { color }]}>{value}</Text>
        {subtitle && (
          <Text style={styles.cardSubtitle}>{subtitle}</Text>
        )}
      </View>
    </CardComponent>
  )
}

export default StatisticsCard

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: '48%',
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    fontWeight: '500',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
})