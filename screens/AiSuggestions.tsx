import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  ActivityIndicator,
  Image,
  ScrollView,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

interface SuggestedWord {
  id: number;
  word: string;
  translation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface WordGroup {
  id: number;
  title: string;
  description: string;
  words: SuggestedWord[];
}

export default function AiSuggestions() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Sample word groups
  const [wordGroups, setWordGroups] = useState<WordGroup[]>([
    {
      id: 1,
      title: 'Từ vựng phỏng vấn công việc',
      description: 'Các từ vựng thường dùng trong phỏng vấn xin việc và CV',
      words: [
        { id: 101, word: 'Accomplishment', translation: 'Thành tựu', category: 'Công việc', difficulty: 'medium' },
        { id: 102, word: 'Initiative', translation: 'Sáng kiến', category: 'Công việc', difficulty: 'medium' },
        { id: 103, word: 'Proficient', translation: 'Thành thạo', category: 'Công việc', difficulty: 'medium' },
        { id: 104, word: 'Leadership', translation: 'Lãnh đạo', category: 'Công việc', difficulty: 'easy' },
        { id: 105, word: 'Qualification', translation: 'Bằng cấp', category: 'Công việc', difficulty: 'easy' },
      ]
    },
    {
      id: 2,
      title: 'Từ vựng về công nghệ',
      description: 'Từ vựng liên quan đến công nghệ và máy tính',
      words: [
        { id: 201, word: 'Algorithm', translation: 'Thuật toán', category: 'Công nghệ', difficulty: 'hard' },
        { id: 202, word: 'Interface', translation: 'Giao diện', category: 'Công nghệ', difficulty: 'medium' },
        { id: 203, word: 'Database', translation: 'Cơ sở dữ liệu', category: 'Công nghệ', difficulty: 'medium' },
        { id: 204, word: 'Bandwidth', translation: 'Băng thông', category: 'Công nghệ', difficulty: 'medium' },
        { id: 205, word: 'Compatibility', translation: 'Tính tương thích', category: 'Công nghệ', difficulty: 'hard' },
      ]
    }
  ]);

  const generateAiSuggestions = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    
    try {
      // Using the AI API to generate suggestions
      const response = await fetch('https://api.a0.dev/ai/llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are an AI assistant that helps language learners with English vocabulary. Generate relevant English vocabulary words with Vietnamese translations based on the user\'s topic or interest.'
            },
            {
              role: 'user',
              content: `Generate 5 English vocabulary words with Vietnamese translations related to: ${aiPrompt}. Format the response as a JSON array with objects containing: word, translation, difficulty (easy, medium, or hard), and category.`
            }
          ]
        }),
      });
      
      const data = await response.json();
      
      // Parse the AI response to extract the word list
      let newWords: SuggestedWord[] = [];
      try {
        // Extract JSON from the text response
        const jsonMatch = data.completion.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const jsonStr = jsonMatch[0];
          const parsedWords = JSON.parse(jsonStr);
          
          newWords = parsedWords.map((item: any, index: number) => ({
            id: 1000 + wordGroups.length * 100 + index,
            word: item.word,
            translation: item.translation,
            category: item.category || aiPrompt,
            difficulty: item.difficulty || 'medium',
          }));
        }
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        // Fallback to dummy data if parsing fails
        newWords = [
          { id: 1001, word: 'Example', translation: 'Ví dụ', category: aiPrompt, difficulty: 'easy' },
          { id: 1002, word: 'Generated', translation: 'Được tạo ra', category: aiPrompt, difficulty: 'medium' },
          { id: 1003, word: 'Custom', translation: 'Tùy chỉnh', category: aiPrompt, difficulty: 'medium' },
          { id: 1004, word: 'Vocabulary', translation: 'Từ vựng', category: aiPrompt, difficulty: 'easy' },
          { id: 1005, word: 'Learning', translation: 'Học tập', category: aiPrompt, difficulty: 'easy' },
        ];
      }
      
      // Create a new word group with the generated words
      const newGroup: WordGroup = {
        id: wordGroups.length + 1,
        title: `Từ vựng về ${aiPrompt}`,
        description: `Các từ vựng liên quan đến ${aiPrompt}`,
        words: newWords
      };
      
      setWordGroups([newGroup, ...wordGroups]);
      setAiPrompt('');
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
    } finally {
      setIsGenerating(false);
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

  const renderWordItem = ({ item }: { item: SuggestedWord }) => (
    <TouchableOpacity 
      style={styles.wordItem}
      onPress={() => navigation.navigate('WordDetail' as never, { wordId: item.id } as never)}
    >
      <View>
        <Text style={styles.wordText}>{item.word}</Text>
        <Text style={styles.translationText}>{item.translation}</Text>
      </View>
      
      <View style={styles.wordItemRight}>
        <View 
          style={[
            styles.difficultyTag, 
            { backgroundColor: getDifficultyColor(item.difficulty) }
          ]}
        >
          <Text style={styles.difficultyText}>
            {item.difficulty === 'easy' ? 'Dễ' : 
             item.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderWordGroup = ({ item }: { item: WordGroup }) => (
    <View style={styles.wordGroupContainer}>
      <View style={styles.wordGroupHeader}>
        <Text style={styles.wordGroupTitle}>{item.title}</Text>
        <Text style={styles.wordGroupDescription}>{item.description}</Text>
      </View>
      
      <FlatList
        data={item.words}
        renderItem={renderWordItem}
        keyExtractor={word => word.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.wordsContainer}
      />
    </View>
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
        <Text style={styles.headerTitle}>AI Đề xuất</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.aiPromptContainer}>
          <LinearGradient
            colors={['#4F7FFA', '#335CC5']}
            style={styles.aiPromptGradient}
          >
            <View style={styles.aiPromptContent}>
              <Text style={styles.aiPromptTitle}>Tạo từ vựng với AI</Text>
              <Text style={styles.aiPromptDescription}>
                Nhập chủ đề hoặc lĩnh vực bạn quan tâm để AI đề xuất các từ vựng phù hợp
              </Text>
              
              <View style={styles.aiInputContainer}>
                <TextInput
                  style={styles.aiInput}
                  placeholder="Ví dụ: du lịch, công nghệ, ẩm thực..."
                  placeholderTextColor="#A0A0A0"
                  value={aiPrompt}
                  onChangeText={setAiPrompt}
                />
                
                <TouchableOpacity 
                  style={[
                    styles.generateButton,
                    !aiPrompt.trim() && styles.disabledButton
                  ]}
                  onPress={generateAiSuggestions}
                  disabled={!aiPrompt.trim() || isGenerating}
                >
                  {isGenerating ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <>
                      <FontAwesome5 name="magic" size={16} color="white" />
                      <Text style={styles.generateButtonText}>Tạo</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.recentSuggestionsContainer}>
          <Text style={styles.sectionTitle}>Gợi ý từ vựng</Text>
          
          {loading ? (
            <ActivityIndicator size="large" color="#4F7FFA" style={styles.loader} />
          ) : (
            <FlatList
              data={wordGroups}
              renderItem={renderWordGroup}
              keyExtractor={group => group.id.toString()}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.groupSeparator} />}
            />
          )}
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
  spacer: {
    width: 40,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  aiPromptContainer: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  aiPromptGradient: {
    borderRadius: 16,
  },
  aiPromptContent: {
    padding: 20,
  },
  aiPromptTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  aiPromptDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
  },
  aiInputContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 4,
  },
  aiInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: 'white',
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
    paddingHorizontal: 16,
    margin: 2,
  },
  disabledButton: {
    opacity: 0.6,
  },
  generateButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  recentSuggestionsContainer: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  loader: {
    marginTop: 40,
  },
  wordGroupContainer: {
    marginBottom: 16,
  },
  wordGroupHeader: {
    marginBottom: 12,
  },
  wordGroupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  wordGroupDescription: {
    fontSize: 14,
    color: '#666',
  },
  wordsContainer: {
    paddingVertical: 4,
  },
  wordItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: 240,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  wordText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  translationText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  wordItemRight: {
    alignItems: 'flex-start',
  },
  difficultyTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
  },
  groupSeparator: {
    height: 16,
  },
});