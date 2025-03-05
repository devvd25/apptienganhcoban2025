import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import ProgressCircle from '../components/ProgressCircle';
import StatsCard from '../components/StatsCard';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('Học viên');
  const [streak, setStreak] = useState(7);
  const [dailyGoal, setDailyGoal] = useState(80);
  const [learnedToday, setLearnedToday] = useState(45);
  const [suggestedWords, setSuggestedWords] = useState([
    { id: 1, word: 'Diligent', translation: 'Chăm chỉ', category: 'Tính cách' },
    { id: 2, word: 'Enhance', translation: 'Nâng cao', category: 'Hành động' },
    { id: 3, word: 'Profound', translation: 'Sâu sắc', category: 'Mô tả' },
  ]);
  
  const categories = [
    { id: 1, name: 'Cơ bản', icon: 'seedling', color: '#4CD964', words: 500, progress: 30 },
    { id: 2, name: 'Kinh doanh', icon: 'briefcase', color: '#007AFF', words: 650, progress: 15 },
    { id: 3, name: 'Du lịch', icon: 'plane', color: '#FF9500', words: 450, progress: 45 },
    { id: 4, name: 'Công nghệ', icon: 'laptop-code', color: '#5856D6', words: 700, progress: 10 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#4F7FFA', '#335CC5']}
          style={styles.header}
        >
          <View style={styles.userInfo}>
            <View>
              <Text style={styles.greeting}>Xin chào,</Text>
              <Text style={styles.username}>{username}</Text>
            </View>
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => navigation.navigate('Profile' as never)}
            >
              <Image 
                source={{ uri: 'https://api.a0.dev/assets/image?text=friendly%20profile%20avatar%20minimal%20design&aspect=1:1' }} 
                style={styles.avatar} 
              />
            </TouchableOpacity>
          </View>

          <View style={styles.statsContainer}>
            <StatsCard 
              title="Chuỗi ngày"
              value={streak}
              icon="fire"
              color="#FF9500"
            />
            <StatsCard 
              title="Mục tiêu"
              value={`${Math.round((learnedToday/dailyGoal) * 100)}%`}
              icon="target"
              color="#4CD964"
              showProgress
              progress={learnedToday/dailyGoal}
            />
            <StatsCard 
              title="Hôm nay"
              value={learnedToday}
              icon="book-open"
              color="#007AFF"
            />
          </View>
        </LinearGradient>

        {/* Main Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.mainActionButton}
            onPress={() => navigation.navigate('FlashcardStudy' as never)}
          >
            <LinearGradient
              colors={['#4CD964', '#34Ad4B']}
              style={styles.actionGradient}
            >
              <Ionicons name="flash" size={24} color="white" />
              <Text style={styles.actionButtonText}>Học từ mới</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.mainActionButton}
            onPress={() => navigation.navigate('ReviewSession' as never)}
          >
            <LinearGradient
              colors={['#FF3B30', '#C93029']}
              style={styles.actionGradient}
            >
              <Ionicons name="refresh" size={24} color="white" />
              <Text style={styles.actionButtonText}>Ôn tập</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Category Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Chủ đề từ vựng</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Categories' as never)}>
              <Text style={styles.seeAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
          >
            {categories.map(category => (
              <TouchableOpacity 
                key={category.id}
                style={styles.categoryCard}
                onPress={() => navigation.navigate('CategoryDetail' as never, { categoryId: category.id } as never)}
              >
                <View style={[styles.iconCircle, { backgroundColor: category.color }]}>
                  <FontAwesome5 name={category.icon} size={22} color="white" />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.wordCount}>{category.words} từ</Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${category.progress}%`, backgroundColor: category.color }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>{category.progress}%</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* AI Suggestions */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>AI đề xuất cho bạn</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AiSuggestions' as never)}>
              <Text style={styles.seeAllText}>Xem thêm</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.aiSuggestionsContainer}>
            {suggestedWords.map(word => (
              <TouchableOpacity 
                key={word.id}
                style={styles.wordCard}
                onPress={() => navigation.navigate('WordDetail' as never, { wordId: word.id } as never)}
              >
                <Text style={styles.englishWord}>{word.word}</Text>
                <Text style={styles.vietnameseWord}>{word.translation}</Text>
                <View style={styles.categoryTag}>
                  <Text style={styles.categoryTagText}>{word.category}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    padding: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: -25,
  },
  mainActionButton: {
    width: '48%',
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  sectionContainer: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    color: '#007AFF',
    fontSize: 14,
  },
  categoriesContainer: {
    flexDirection: 'row',
  },
  categoryCard: {
    width: 140,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  wordCount: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
    marginBottom: 8,
  },
  progressBar: {
    height: 5,
    backgroundColor: '#EAEAEA',
    borderRadius: 3,
    marginTop: 5,
  },
  progressFill: {
    height: 5,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'right',
  },
  aiSuggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  wordCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  englishWord: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
  },
  vietnameseWord: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 10,
  },
  categoryTagText: {
    fontSize: 12,
    color: '#666',
  },
});