import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

interface WordItem {
  id: number;
  word: string;
  translation: string;
  mastered: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  description: string;
  totalWords: number;
  progress: number;
  image: string;
}

export default function CategoryDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample category data - In a real app, this would be fetched based on categoryId
  const categoryId = (route.params as any)?.categoryId || 1;
  
  const categories: Category[] = [
    {
      id: 1,
      name: 'Cơ bản',
      icon: 'seedling',
      color: '#4CD964',
      description: 'Bộ từ vựng cơ bản cho người mới bắt đầu học tiếng Anh.',
      totalWords: 500,
      progress: 30,
      image: 'https://api.a0.dev/assets/image?text=basic%20english%20vocabulary%20learning&aspect=16:9'
    },
    {
      id: 2,
      name: 'Kinh doanh',
      icon: 'briefcase',
      color: '#007AFF',
      description: 'Từ vựng chuyên ngành dành cho môi trường doanh nghiệp và kinh doanh.',
      totalWords: 650,
      progress: 15,
      image: 'https://api.a0.dev/assets/image?text=business%20english%20vocabulary%20professional&aspect=16:9'
    },
    {
      id: 3,
      name: 'Du lịch',
      icon: 'plane',
      color: '#FF9500',
      description: 'Học từ vựng cần thiết khi đi du lịch và giao tiếp ở nước ngoài.',
      totalWords: 450,
      progress: 45,
      image: 'https://api.a0.dev/assets/image?text=travel%20vocabulary%20tourism%20language&aspect=16:9'
    },
    {
      id: 4,
      name: 'Công nghệ',
      icon: 'laptop-code',
      color: '#5856D6',
      description: 'Từ vựng về công nghệ, máy tính và khoa học.',
      totalWords: 700,
      progress: 10,
      image: 'https://api.a0.dev/assets/image?text=technology%20vocabulary%20computers%20science&aspect=16:9'
    },
  ];
  
  const category = categories.find(cat => cat.id === categoryId) || categories[0];
  
  // Sample words for this category
  const [words, setWords] = useState<WordItem[]>([
    { id: 1, word: 'Accomplish', translation: 'Hoàn thành', mastered: true, difficulty: 'medium' },
    { id: 2, word: 'Beneficial', translation: 'Có lợi', mastered: false, difficulty: 'easy' },
    { id: 3, word: 'Collaborate', translation: 'Hợp tác', mastered: true, difficulty: 'medium' },
    { id: 4, word: 'Demonstrate', translation: 'Chứng minh', mastered: false, difficulty: 'hard' },
    { id: 5, word: 'Efficient', translation: 'Hiệu quả', mastered: true, difficulty: 'easy' },
    { id: 6, word: 'Fundamental', translation: 'Cơ bản', mastered: false, difficulty: 'medium' },
    { id: 7, word: 'Generate', translation: 'Tạo ra', mastered: false, difficulty: 'easy' },
    { id: 8, word: 'Hierarchy', translation: 'Thứ bậc', mastered: false, difficulty: 'hard' },
    { id: 9, word: 'Implement', translation: 'Thực hiện', mastered: true, difficulty: 'medium' },
    { id: 10, word: 'Justify', translation: 'Biện minh', mastered: false, difficulty: 'hard' },
  ]);

  const filteredWords = words.filter(word => 
    word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
    word.translation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleMastered = (id: number) => {
    setWords(words.map(word => 
      word.id === id ? { ...word, mastered: !word.mastered } : word
    ));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'easy': return '#4CD964';
      case 'medium': return '#FF9500';
      case 'hard': return '#FF3B30';
      default: return '#007AFF';
    }
  };

  const renderWordItem = ({ item }: { item: WordItem }) => (
    <TouchableOpacity 
      style={styles.wordItem}
      onPress={() => navigation.navigate('WordDetail' as never, { wordId: item.id } as never)}
    >
      <View style={styles.wordItemContent}>
        <View>
          <Text style={styles.wordText}>{item.word}</Text>
          <Text style={styles.translationText}>{item.translation}</Text>
        </View>
        
        <View style={styles.wordItemRight}>
          <View 
            style={[
              styles.difficultyTag, 
              { backgroundColor: getDifficultyColor(item.difficulty) + '20', }
            ]}
          >
            <Text style={[styles.difficultyText, { color: getDifficultyColor(item.difficulty) }]}>
              {item.difficulty === 'easy' ? 'Dễ' : 
              item.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[
              styles.masteredButton,
              item.mastered && styles.masteredButtonActive
            ]}
            onPress={() => toggleMastered(item.id)}
          >
            <Ionicons 
              name={item.mastered ? "checkmark-circle" : "checkmark-circle-outline"} 
              size={24} 
              color={item.mastered ? "white" : "#999"} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('Home' as never)}
        >
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category.name}</Text>
        <View style={styles.spacer} />
      </View>

      <View style={styles.categoryBanner}>
        <Image 
          source={{ uri: category.image }} 
          style={styles.categoryImage} 
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.gradientOverlay}
        >
          <View style={styles.bannerContent}>
            <View style={[styles.iconCircle, { backgroundColor: category.color }]}>
              <FontAwesome5 name={category.icon} size={22} color="white" />
            </View>
            <Text style={styles.bannerTitle}>{category.name}</Text>
            <Text style={styles.bannerDescription}>{category.description}</Text>
            <View style={styles.bannerStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{category.totalWords}</Text>
                <Text style={styles.statLabel}>Tổng số từ</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{Math.round(category.totalWords * (category.progress / 100))}</Text>
                <Text style={styles.statLabel}>Đã học</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{category.progress}%</Text>
                <Text style={styles.statLabel}>Tiến độ</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm từ vựng..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <Ionicons name="close-circle" size={18} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('FlashcardStudy' as never, { categoryId } as never)}
          >
            <LinearGradient
              colors={[category.color, category.color]}
              style={styles.actionButtonGradient}
            >
              <Ionicons name="flash" size={20} color="white" />
              <Text style={styles.actionButtonText}>Học ngay</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('ReviewSession' as never, { categoryId } as never)}
          >
            <View style={styles.secondaryButton}>
              <Ionicons name="repeat" size={20} color={category.color} />
              <Text style={[styles.secondaryButtonText, { color: category.color }]}>Ôn tập</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.wordsListHeader}>
          <Text style={styles.wordsListTitle}>Danh sách từ vựng</Text>
          <Text style={styles.wordsListCount}>{filteredWords.length} từ</Text>
        </View>

        <FlatList
          data={filteredWords}
          renderItem={renderWordItem}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.wordsList}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  spacer: {
    width: 40,
  },
  categoryBanner: {
    height: 220,
    position: 'relative',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
  },
  bannerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  bannerDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
  },
  bannerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: '#333',
  },
  clearButton: {
    padding: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  secondaryButtonText: {
    fontWeight: 'bold',
    marginLeft: 8,
  },
  wordsListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  wordsListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  wordsListCount: {
    fontSize: 14,
    color: '#666',
  },
  wordsList: {
    paddingBottom: 20,
  },
  wordItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  wordItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wordText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  translationText: {
    fontSize: 14,
    color: '#666',
  },
  wordItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 10,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '500',
  },
  masteredButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F7',
  },
  masteredButtonActive: {
    backgroundColor: '#4CD964',
  },
});