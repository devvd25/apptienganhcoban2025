import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import ProgressCircle from './ProgressCircle';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  showProgress?: boolean;
  progress?: number;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  color,
  showProgress = false,
  progress = 0
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        {showProgress ? (
          <View style={styles.progressContainer}>
            <ProgressCircle
              progress={progress}
              size={40}
              strokeWidth={5}
              color={color}
            />
            <View style={styles.iconOverlay}>
              <FontAwesome5 name={icon} size={15} color={color} />
            </View>
          </View>
        ) : (
          <View style={[styles.iconBackground, { backgroundColor: color }]}>
            <FontAwesome5 name={icon} size={16} color="white" />
          </View>
        )}
      </View>
      
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '31%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  iconBackground: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    position: 'relative',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 2,
  },
  title: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
});

export default StatsCard;