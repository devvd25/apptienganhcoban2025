import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';

interface WordDetail {
  id: number;
  word: string;
  translation: string;
  pronunciation: string;
  partOfSpeech: string;
  definition: string;
  examples: string[];
  synonyms: string[];
  antonyms: string[];
  isFavorite: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  learningStatus: 'new' | 'learning' | 'mastered';
  image: string;
  relatedWords: { id: number; word: string; translation: string }[];
}

const { width } = Dimensions.get('window');

export default function WordDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Sample word detail data - In a real app, this would be fetched based on wordId
  const wordId = (route.params as any)?.wordId || 1;
  
  const [wordDetail, setWordDetail] = useState<WordDetail>({
    id: 1,
    word: 'Perseverance',
    translation: 'Sự kiên trì',
    pronunciation: '/ˌpəːsɪˈvɪər(ə)ns/',
    partOfSpeech: 'noun',
    definition: 'Persistence in doing something despite difficulty or delay in achieving success.',
    examples: [
      'His perseverance was finally rewarded when he passed the exam.',
      'Through perseverance, she overcame all obstacles.',
      'It takes perseverance to master a new language.'
    ],
    synonyms: ['persistence', 'determination', 'endurance', 'tenacity'],
    antonyms: ['laziness', 'idleness', 'sloth', 'apathy'],
    isFavorite: false,
    difficulty: 'medium',
    learningStatus: 'learning',
    image: 'https://api.a0.dev/assets/image?text=perseverance%20determination%20climbing&aspect=16:9',
    relatedWords: [
      { id: 2, word: 'Persistent', translation: 'Kiên trì' },
      { id: 3, word: 'Diligent', translation: 'Chăm chỉ' },
      { id: 4, word: 'Tenacious', translation: 'Bền bỉ' },
    ]
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

  const toggleFavorite = () => {
    setWordDetail(prev => ({
      ...prev,
      isFavorite: !prev.isFavorite
    }));
  };

  const getLearningStatusColor = (status: string) => {
    switch(status) {
      case 'new': return '#007AFF';
      case 'learning': return '#FF9500';
      case 'mastered': return '#4CD964';
      default: return '#007AFF';
    }
  };

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
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết từ vựng</Text>
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={toggleFavorite}
        >
          <Ionicons 
            name={wordDetail.isFavorite ? "heart" : "heart-outline"} 
            size={24} 
            color={wordDetail.isFavorite ? "#FF3B30" : "#333"} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.wordBanner}>
          <Image 
            source={{ uri: wordDetail.image }} 
            style={styles.wordImage} 
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.gradientOverlay}
          >
            <View style={styles.bannerContent}>
              <Text style={styles.wordText}>{wordDetail.word}</Text>
              <Text style={styles.translationText}>{wordDetail.translation}</Text>
              
              <View style={styles.tagsContainer}>
                <View style={[
                  styles.learningStatusTag,
                  { backgroundColor: getLearningStatusColor(wordDetail.learningStatus) }
                ]}>
                  <Text style={styles.learningStatusText}>
                    {wordDetail.learningStatus === 'new' ? 'Mới' : 
                     wordDetail.learningStatus === 'learning' ? 'Đang học' : 'Đã thuộc'}
                  </Text>
                </View>
                
                <View style={[
                  styles.difficultyTag,
                  { backgroundColor: getDifficultyColor(wordDetail.difficulty) }
                ]}>
                  <Text style={styles.difficultyText}>
                    {wordDetail.difficulty === 'easy' ? 'Dễ' : 
                     wordDetail.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                  </Text>
                </View>
                
                <View style={styles.partOfSpeechTag}>
                  <Text style={styles.partOfSpeechText}>{wordDetail.partOfSpeech}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.pronunciationContainer}>
          <Text style={styles.pronunciationText}>{wordDetail.pronunciation}</Text>
          <TouchableOpacity style={styles.speakerButton} onPress={playSound}>
            <Ionicons name="volume-medium" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Definition</Text>
          <Text style={styles.definitionText}>{wordDetail.definition}</Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Examples</Text>
          {wordDetail.examples.map((example, index) => (
            <View key={index} style={styles.exampleItem}>
              <MaterialIcons name="format-quote" size={18} color="#007AFF" />
              <Text style={styles.exampleText}>{example}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Synonyms & Antonyms</Text>
          
          <View style={styles.wordRelationsContainer}>
            <View style={styles.wordRelationColumn}>
              <Text style={styles.wordRelationTitle}>Synonyms</Text>
              {wordDetail.synonyms.map((word, index) => (
                <View key={index} style={styles.wordChip}>
                  <Text style={styles.wordChipText}>{word}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.wordRelationColumn}>
              <Text style={styles.wordRelationTitle}>Antonyms</Text>
              {wordDetail.antonyms.map((word, index) => (
                <View key={index} style={styles.wordChip}>
                  <Text style={styles.wordChipText}>{word}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Related Words</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {wordDetail.relatedWords.map(word => (
              <TouchableOpacity 
                key={word.id}
                style={styles.relatedWordCard}
                onPress={() => navigation.navigate('WordDetail' as never, { wordId: word.id } as never)}
              >
                <Text style={styles.relatedWordText}>{word.word}</Text>
                <Text style={styles.relatedWordTranslation}>{word.translation}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.studyButton]}
            onPress={() => navigation.navigate('FlashcardStudy' as never, { wordId } as never)}
          >
            <LinearGradient
              colors={['#4F7FFA', '#335CC5']}
              style={styles.actionButtonGradient}
            >
              <FontAwesome5 name="book" size={16} color="white" />
              <Text style={styles.actionButtonText}>Học ngay</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.practiceButton]}
            onPress={() => navigation.navigate('PronunciationPractice' as never, { wordId } as never)}
          >
            <LinearGradient
              colors={['#FF9500', '#E68600']}
              style={styles.actionButtonGradient}
            >
              <FontAwesome5 name="microphone" size={16} color="white" />
              <Text style={styles.actionButtonText}>Luyện phát âm</Text>
            </LinearGradient>
          </TouchableOpacity>
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
  favoriteButton: {
    padding: 8,
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  wordBanner: {
    height: 200,
    position: 'relative',
  },
  wordImage: {
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
  wordText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  translationText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  learningStatusTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  learningStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  difficultyTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  partOfSpeechTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  partOfSpeechText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  pronunciationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'white',
    marginTop: -20,
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pronunciationText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  speakerButton: {
    marginLeft: 12,
    padding: 4,
  },
  sectionContainer: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  definitionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  exampleItem: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingLeft: 4,
  },
  exampleText: {
    fontSize: 15,
    color: '#333',
    fontStyle: 'italic',
    lineHeight: 22,
    marginLeft: 8,
    flex: 1,
  },
  wordRelationsContainer: {
    flexDirection: 'row',
  },
  wordRelationColumn: {
    flex: 1,
  },
  divider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },
  wordRelationTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  wordChip: {
    backgroundColor: '#F0F0F0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  wordChipText: {
    fontSize: 14,
    color: '#333',
  },
  relatedWordCard: {
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    padding: 12,
    marginRight: 10,
    width: 140,
  },
  relatedWordText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  relatedWordTranslation: {
    fontSize: 14,
    color: '#666',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  studyButton: {
    marginRight: 8,
  },
  practiceButton: {
    marginLeft: 8,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 8,
  },
});