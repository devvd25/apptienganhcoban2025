import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  TouchableOpacity, 
  Dimensions, 
  PanResponder, 
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';

const { width, height } = Dimensions.get('window');

interface Flashcard {
  id: number;
  word: string;
  translation: string;
  example: string;
  pronunciation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  image?: string;
}

export default function FlashcardStudy() {
  const navigation = useNavigation();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const position = useRef(new Animated.ValueXY()).current;
  const rotation = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });
  
  // Sample flashcards data
  const [flashcards, setFlashcards] = useState<Flashcard[]>([
    {
      id: 1,
      word: 'Abundance',
      translation: 'Sự dồi dào, phong phú',
      example: 'The region has an abundance of natural resources.',
      pronunciation: '/əˈbʌnd(ə)ns/',
      difficulty: 'medium',
      image: 'https://api.a0.dev/assets/image?text=abundance%20plenty%20resources&aspect=16:9'
    },
    {
      id: 2,
      word: 'Diligent',
      translation: 'Chăm chỉ, cần cù',
      example: 'She is a diligent student who always completes her homework.',
      pronunciation: '/ˈdɪlɪdʒ(ə)nt/',
      difficulty: 'easy',
      image: 'https://api.a0.dev/assets/image?text=diligent%20student%20studying&aspect=16:9'
    },
    {
      id: 3,
      word: 'Eloquent',
      translation: 'Hùng biện, lưu loát',
      example: 'His eloquent speech moved the entire audience.',
      pronunciation: '/ˈɛləkwənt/',
      difficulty: 'hard',
      image: 'https://api.a0.dev/assets/image?text=eloquent%20speaker%20giving%20speech&aspect=16:9'
    },
    {
      id: 4,
      word: 'Perseverance',
      translation: 'Sự kiên trì, bền bỉ',
      example: 'Through perseverance, she finally reached her goal.',
      pronunciation: '/ˌpəːsɪˈvɪər(ə)ns/',
      difficulty: 'hard',
      image: 'https://api.a0.dev/assets/image?text=perseverance%20climbing%20mountain&aspect=16:9'
    },
    {
      id: 5,
      word: 'Amiable',
      translation: 'Thân thiện, dễ mến',
      example: 'He has an amiable personality that people are drawn to.',
      pronunciation: '/ˈeɪmɪəb(ə)l/',
      difficulty: 'medium',
      image: 'https://api.a0.dev/assets/image?text=amiable%20friendly%20person&aspect=16:9'
    },
  ]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > 120) {
        swipeRight();
      } else if (gesture.dx < -120) {
        swipeLeft();
      } else {
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
          friction: 5,
        }).start();
      }
    },
  });

  // Play pronunciation audio
  const playSound = async () => {
    try {
      // In a real app, you would use a real TTS API or pre-recorded audio files
      console.log('Playing pronunciation');
      // Simulating audio playback for demonstration
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: 'https://example.com/audio.mp3' },
        { shouldPlay: true }
      );
      setSound(newSound);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const swipeLeft = () => {
    Animated.timing(position, {
      toValue: { x: -width, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setCurrentIndex(prevIndex => 
        prevIndex === flashcards.length - 1 ? 0 : prevIndex + 1
      );
      position.setValue({ x: 0, y: 0 });
      setShowTranslation(false);
    });
  };

  const swipeRight = () => {
    Animated.timing(position, {
      toValue: { x: width, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      // Mark as known and move to next card
      setCurrentIndex(prevIndex => 
        prevIndex === flashcards.length - 1 ? 0 : prevIndex + 1
      );
      position.setValue({ x: 0, y: 0 });
      setShowTranslation(false);
    });
  };

  const currentCard = flashcards[currentIndex];
  
  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'easy': return '#4CD964';
      case 'medium': return '#FF9500';
      case 'hard': return '#FF3B30';
      default: return '#007AFF';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('Home' as never)}
        >
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Flashcards</Text>
        <View style={styles.spacer} />
      </View>

      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${((currentIndex) / flashcards.length) * 100}%` }
          ]} 
        />
      </View>
      
      <Text style={styles.counter}>
        {currentIndex + 1} / {flashcards.length}
      </Text>

      <View style={styles.cardContainer}>
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.card,
            {
              transform: [
                { translateX: position.x },
                { rotate: rotation },
              ],
            },
          ]}
        >
          <View style={styles.difficultyTag}>
            <View 
              style={[
                styles.difficultyDot, 
                { backgroundColor: getDifficultyColor(currentCard.difficulty) }
              ]} 
            />
            <Text style={styles.difficultyText}>
              {currentCard.difficulty === 'easy' ? 'Dễ' : 
               currentCard.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
            </Text>
          </View>

          {currentCard.image && (
            <Image 
              source={{ uri: currentCard.image }} 
              style={styles.cardImage} 
              resizeMode="cover"
            />
          )}

          <View style={styles.cardContent}>
            <Text style={styles.wordText}>{currentCard.word}</Text>
            
            <View style={styles.pronunciationContainer}>
              <Text style={styles.pronunciationText}>{currentCard.pronunciation}</Text>
              <TouchableOpacity style={styles.speakerButton} onPress={playSound}>
                <Ionicons name="volume-medium" size={20} color="#007AFF" />
              </TouchableOpacity>
            </View>

            {showTranslation ? (
              <>
                <Text style={styles.translationText}>{currentCard.translation}</Text>
                <Text style={styles.exampleTitle}>Ví dụ:</Text>
                <Text style={styles.exampleText}>{currentCard.example}</Text>
              </>
            ) : (
              <TouchableOpacity 
                style={styles.showTranslationButton}
                onPress={() => setShowTranslation(true)}
              >
                <Text style={styles.showTranslationText}>Xem nghĩa</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.hardButton]}
          onPress={swipeLeft}
        >
          <FontAwesome5 name="times" size={24} color="white" />
          <Text style={styles.actionButtonText}>Chưa thuộc</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.flipButton}
          onPress={() => setShowTranslation(!showTranslation)}
        >
          <FontAwesome5 name="exchange-alt" size={18} color="#333" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.easyButton]}
          onPress={swipeRight}
        >
          <FontAwesome5 name="check" size={24} color="white" />
          <Text style={styles.actionButtonText}>Đã thuộc</Text>
        </TouchableOpacity>
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
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  progressFill: {
    height: 6,
    backgroundColor: '#4F7FFA',
    borderRadius: 3,
  },
  counter: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginBottom: 20,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 100,
  },
  card: {
    width: width - 40,
    height: height * 0.55,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  difficultyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  difficultyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  cardImage: {
    width: '100%',
    height: '40%',
  },
  cardContent: {
    padding: 20,
    paddingTop: 15,
    flex: 1,
  },
  wordText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  pronunciationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  pronunciationText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  speakerButton: {
    marginLeft: 10,
    padding: 5,
  },
  translationText: {
    fontSize: 20,
    color: '#333',
    marginBottom: 20,
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
  },
  exampleText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  showTranslationButton: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  showTranslationText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: '40%',
  },
  hardButton: {
    backgroundColor: '#FF3B30',
  },
  easyButton: {
    backgroundColor: '#4CD964',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 8,
  },
  flipButton: {
    backgroundColor: 'white',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
});