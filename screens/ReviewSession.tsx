import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  FlatList,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

interface ReviewWord {
  id: number;
  word: string;
  translation: string;
  lastReviewed: Date;
  dueDate: Date;
  level: number; // SRS level (0-5)
}

interface QuizQuestion {
  id: number;
  type: 'multiple-choice' | 'fill-in-blank' | 'matching';
  word?: string;
  translation?: string;
  sentence?: string;
  options?: string[];
  correctAnswer: string | number;
}

export default function ReviewSession() {
  const navigation = useNavigation();
  const [reviewMode, setReviewMode] = useState<'preview' | 'quiz'>('preview');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [score, setScore] = useState(0);
  const [reviewComplete, setReviewComplete] = useState(false);
  const [inputAnswer, setInputAnswer] = useState('');
  
  // Sample review words data
  const [reviewWords, setReviewWords] = useState<ReviewWord[]>([
    {
      id: 1,
      word: 'Diligent',
      translation: 'Chăm chỉ',
      lastReviewed: new Date(new Date().setDate(new Date().getDate() - 7)),
      dueDate: new Date(),
      level: 3,
    },
    {
      id: 2,
      word: 'Profound',
      translation: 'Sâu sắc',
      lastReviewed: new Date(new Date().setDate(new Date().getDate() - 4)),
      dueDate: new Date(),
      level: 2,
    },
    {
      id: 3,
      word: 'Enhance',
      translation: 'Nâng cao',
      lastReviewed: new Date(new Date().setDate(new Date().getDate() - 10)),
      dueDate: new Date(),
      level: 4,
    },
    {
      id: 4,
      word: 'Ambiguous',
      translation: 'Mơ hồ',
      lastReviewed: new Date(new Date().setDate(new Date().getDate() - 2)),
      dueDate: new Date(),
      level: 1,
    },
    {
      id: 5,
      word: 'Eloquent',
      translation: 'Hùng biện',
      lastReviewed: new Date(new Date().setDate(new Date().getDate() - 14)),
      dueDate: new Date(),
      level: 3,
    },
  ]);
  
  // Sample quiz questions
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([
    {
      id: 1,
      type: 'multiple-choice',
      word: 'Diligent',
      options: ['Lười biếng', 'Chăm chỉ', 'Mệt mỏi', 'Vui vẻ'],
      correctAnswer: 'Chăm chỉ',
    },
    {
      id: 2,
      type: 'fill-in-blank',
      sentence: 'She is very _______ in her studies and always gets good grades.',
      correctAnswer: 'diligent',
    },
    {
      id: 3,
      type: 'multiple-choice',
      translation: 'Sâu sắc',
      options: ['Shallow', 'Profound', 'Serious', 'Deep'],
      correctAnswer: 'Profound',
    },
    {
      id: 4,
      type: 'matching',
      word: 'Enhance',
      options: ['Giảm xuống', 'Nâng cao', 'Phá hủy', 'Thay thế'],
      correctAnswer: 'Nâng cao',
    },
    {
      id: 5,
      type: 'fill-in-blank',
      sentence: 'The speaker was very _______, moving the audience with his powerful speech.',
      correctAnswer: 'eloquent',
    },
  ]);

  const startQuiz = () => {
    setReviewMode('quiz');
    setCurrentQuestion(0);
    setScore(0);
    setReviewComplete(false);
    setSelectedAnswer(null);
    setInputAnswer('');
  };

  const handleAnswer = (answer: string | number) => {
    setSelectedAnswer(answer);
  };

  const checkAnswer = () => {
    const question = quizQuestions[currentQuestion];
    
    if (question.type === 'fill-in-blank') {
      if (inputAnswer.toLowerCase() === question.correctAnswer.toString().toLowerCase()) {
        setScore(score + 1);
      }
    } else {
      if (selectedAnswer === question.correctAnswer) {
        setScore(score + 1);
      }
    }
    
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setInputAnswer('');
    } else {
      setReviewComplete(true);
    }
  };

  const restartReview = () => {
    setReviewMode('preview');
    setReviewComplete(false);
  };

  const getDueDateColor = (level: number) => {
    switch(level) {
      case 0: return '#FF3B30'; // New
      case 1: return '#FF9500'; // Learning
      case 2: return '#FFCC00'; // Learning
      case 3: return '#34C759'; // Review
      case 4: return '#30B0C7'; // Review
      case 5: return '#007AFF'; // Mastered
      default: return '#007AFF';
    }
  };

  const renderReviewItem = ({ item }: { item: ReviewWord }) => (
    <View style={styles.reviewCard}>
      <View style={styles.wordContainer}>
        <Text style={styles.wordText}>{item.word}</Text>
        <View 
          style={[
            styles.levelIndicator, 
            { backgroundColor: getDueDateColor(item.level) }
          ]}
        >
          <Text style={styles.levelText}>Cấp {item.level}</Text>
        </View>
      </View>
      <Text style={styles.translationText}>{item.translation}</Text>
      <View style={styles.reviewInfoContainer}>
        <Text style={styles.reviewInfoText}>
          Ôn tập lần cuối: {item.lastReviewed.toLocaleDateString('vi-VN')}
        </Text>
      </View>
    </View>
  );

  const renderCurrentQuestion = () => {
    if (reviewComplete) {
      return (
        <View style={styles.completionContainer}>
          <LinearGradient
            colors={['#4CD964', '#34Ad4B']}
            style={styles.scoreCircle}
          >
            <Text style={styles.scoreText}>{score}/{quizQuestions.length}</Text>
          </LinearGradient>
          
          <Text style={styles.completionTitle}>Đã hoàn thành!</Text>
          <Text style={styles.completionSubtitle}>
            {score >= quizQuestions.length * 0.8 
              ? 'Tuyệt vời! Bạn đã thuộc hầu hết các từ vựng.' 
              : 'Cố gắng hơn nữa nhé! Tiếp tục ôn tập để nắm vững những từ vựng này.'}
          </Text>
          
          <TouchableOpacity 
            style={styles.restartButton}
            onPress={restartReview}
          >
            <Text style={styles.restartButtonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const question = quizQuestions[currentQuestion];
    
    return (
      <View style={styles.questionContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentQuestion) / quizQuestions.length) * 100}%` }
            ]} 
          />
        </View>
        
        <Text style={styles.questionCounter}>
          Câu hỏi {currentQuestion + 1}/{quizQuestions.length}
        </Text>
        
        {question.type === 'multiple-choice' && (
          <>
            <Text style={styles.questionText}>
              {question.word 
                ? `"${question.word}" có nghĩa là gì?` 
                : `Từ nào có nghĩa là "${question.translation}"?`}
            </Text>
            
            <View style={styles.optionsContainer}>
              {question.options?.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    selectedAnswer === option && styles.selectedOption,
                  ]}
                  onPress={() => handleAnswer(option)}
                >
                  <Text style={[
                    styles.optionText,
                    selectedAnswer === option && styles.selectedOptionText,
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
        
        {question.type === 'fill-in-blank' && (
          <>
            <Text style={styles.questionText}>Điền từ thích hợp vào chỗ trống:</Text>
            <Text style={styles.sentenceText}>{question.sentence}</Text>
            
            <TextInput
              style={styles.inputField}
              value={inputAnswer}
              onChangeText={setInputAnswer}
              placeholder="Nhập từ..."
              placeholderTextColor="#999"
              autoCapitalize="none"
            />
          </>
        )}
        
        {question.type === 'matching' && (
          <>
            <Text style={styles.questionText}>
              Từ "{question.word}" có nghĩa tiếng Việt là gì?
            </Text>
            
            <View style={styles.optionsContainer}>
              {question.options?.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    selectedAnswer === option && styles.selectedOption,
                  ]}
                  onPress={() => handleAnswer(option)}
                >
                  <Text style={[
                    styles.optionText,
                    selectedAnswer === option && styles.selectedOptionText,
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
        
        <TouchableOpacity
          style={[
            styles.checkButton,
            ((question.type === 'fill-in-blank' && !inputAnswer) || 
             (question.type !== 'fill-in-blank' && selectedAnswer === null)) && 
            styles.disabledButton
          ]}
          onPress={checkAnswer}
          disabled={(question.type === 'fill-in-blank' && !inputAnswer) || 
                  (question.type !== 'fill-in-blank' && selectedAnswer === null)}
        >
          <Text style={styles.checkButtonText}>Kiểm tra</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => 
            reviewMode === 'preview' 
              ? navigation.navigate('Home' as never)
              : !reviewComplete 
                ? setReviewMode('preview')
                : setReviewComplete(false)
          }
        >
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {reviewMode === 'preview' ? 'Ôn tập' : 'Kiểm tra'}
        </Text>
        <View style={styles.spacer} />
      </View>

      {reviewMode === 'preview' ? (
        <>
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Hôm nay cần ôn tập</Text>
            <Text style={styles.summarySubtitle}>
              {reviewWords.length} từ vựng cần được ôn tập
            </Text>

            <TouchableOpacity 
              style={styles.startButton}
              onPress={startQuiz}
            >
              <LinearGradient
                colors={['#4F7FFA', '#335CC5']}
                style={styles.startButtonGradient}
              >
                <Text style={styles.startButtonText}>Bắt đầu kiểm tra</Text>
                <FontAwesome5 name="arrow-right" size={16} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <FlatList
            data={reviewWords}
            renderItem={renderReviewItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        </>
      ) : (
        renderCurrentQuestion()
      )}
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
  summaryContainer: {
    padding: 20,
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  summarySubtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 20,
  },
  startButton: {
    borderRadius: 12,
    overflow: 'hidden',
    alignSelf: 'stretch',
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  reviewCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  wordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  wordText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  levelIndicator: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  translationText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  reviewInfoContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  reviewInfoText: {
    fontSize: 12,
    color: '#999',
  },
  questionContainer: {
    flex: 1,
    padding: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginBottom: 12,
  },
  progressFill: {
    height: 6,
    backgroundColor: '#4F7FFA',
    borderRadius: 3,
  },
  questionCounter: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
  },
  sentenceText: {
    fontSize: 17,
    color: '#333',
    lineHeight: 24,
    marginBottom: 24,
    fontStyle: 'italic',
  },
  optionsContainer: {
    marginBottom: 32,
  },
  optionButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedOption: {
    backgroundColor: '#E8F0FF',
    borderColor: '#4F7FFA',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#4F7FFA',
    fontWeight: '500',
  },
  inputField: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 32,
  },
  checkButton: {
    backgroundColor: '#4F7FFA',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  disabledButton: {
    backgroundColor: '#A0A0A0',
  },
  checkButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  completionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  scoreText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  completionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  completionSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  restartButton: {
    backgroundColor: '#4F7FFA',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  restartButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});