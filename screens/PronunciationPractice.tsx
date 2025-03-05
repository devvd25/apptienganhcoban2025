import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  Image,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

interface PracticeWord {
  id: number;
  word: string;
  pronunciation: string;
  audio?: string;
  tips: string[];
}

export default function PronunciationPractice() {
  const navigation = useNavigation();
  const route = useRoute();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [userRecording, setUserRecording] = useState<Audio.Sound | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedbackScore, setFeedbackScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string[]>([]);
  
  // Sample word data - In a real app, this would be fetched based on wordId
  const wordId = (route.params as any)?.wordId || 1;
  
  const [practiceWord, setPracticeWord] = useState<PracticeWord>({
    id: 1,
    word: 'Perseverance',
    pronunciation: '/ˌpəːsɪˈvɪər(ə)ns/',
    tips: [
      'Focus on the stress in the third syllable: per-se-VER-ance',
      'The "ver" syllable sounds like "veer"',
      'The final syllable "ance" rhymes with "dance"',
      'Try to connect all syllables smoothly'
    ]
  });

  useEffect(() => {
    // Request permissions for audio recording
    Audio.requestPermissionsAsync()
      .then(({ granted }) => {
        if (!granted) {
          console.log('Audio recording permissions not granted');
        }
      })
      .catch(err => console.error('Error requesting audio permissions:', err));
    
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
      if (sound) {
        sound.unloadAsync();
      }
      if (userRecording) {
        userRecording.unloadAsync();
      }
    };
  }, []);

  // Play the correct pronunciation
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

  // Start recording
  const startRecording = async () => {
    try {
      // Clear previous state
      if (userRecording) {
        await userRecording.unloadAsync();
        setUserRecording(null);
      }
      setFeedbackScore(null);
      setFeedback([]);
      
      console.log('Starting recording...');
      setIsRecording(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (error) {
      console.error('Failed to start recording', error);
      setIsRecording(false);
    }
  };

  // Stop recording
  const stopRecording = async () => {
    console.log('Stopping recording...');
    setIsRecording(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (!recording) {
      return;
    }

    try {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      
      const uri = recording.getURI();
      if (uri) {
        analyzePronunciation(uri);
      }
      
      setRecording(null);
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  };

  // Play back user's recording
  const playRecording = async () => {
    if (!userRecording) {
      return;
    }
    
    try {
      await userRecording.replayAsync();
    } catch (error) {
      console.error('Failed to play recording', error);
    }
  };

  // Analyze the pronunciation (simulated for demonstration)
  const analyzePronunciation = async (audioUri: string) => {
    setIsAnalyzing(true);
    
    try {
      // Load the recording for playback
      const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
      setUserRecording(sound);
      
      // Simulate pronunciation analysis (in a real app, you would send the audio to a speech recognition API)
      setTimeout(() => {
        // Generate random score between 60 and 95 for demo
        const score = Math.floor(Math.random() * 36) + 60;
        setFeedbackScore(score);
        
        // Generate feedback based on score
        const feedbackList = [];
        if (score < 70) {
          feedbackList.push('Try to emphasize the third syllable more.');
          feedbackList.push('Work on the connection between syllables.');
          feedbackList.push('Listen to the correct pronunciation again and try to match it.');
        } else if (score < 85) {
          feedbackList.push('Your pronunciation is getting better!');
          feedbackList.push('Focus on the "ver" sound in the middle.');
          feedbackList.push('Try to maintain a smooth rhythm throughout the word.');
        } else {
          feedbackList.push('Excellent pronunciation!');
          feedbackList.push('Your stress placement is very good.');
          feedbackList.push('Keep practicing to maintain this level.');
        }
        
        setFeedback(feedbackList);
        setIsAnalyzing(false);
      }, 2000); // Simulate analysis delay
    } catch (error) {
      console.error('Failed to analyze pronunciation', error);
      setIsAnalyzing(false);
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
        <Text style={styles.headerTitle}>Luyện phát âm</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.wordCard}>
          <Text style={styles.wordText}>{practiceWord.word}</Text>
          <View style={styles.pronunciationContainer}>
            <Text style={styles.pronunciationText}>{practiceWord.pronunciation}</Text>
            <TouchableOpacity style={styles.speakerButton} onPress={playSound}>
              <Ionicons name="volume-medium" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Mẹo phát âm:</Text>
          {practiceWord.tips.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <MaterialIcons name="tips-and-updates" size={18} color="#FF9500" />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        <Image 
          source={{ uri: 'https://api.a0.dev/assets/image?text=person%20speaking%20pronunciation%20practice&aspect=16:9' }} 
          style={styles.illustrationImage} 
        />

        <View style={styles.recordingContainer}>
          {isAnalyzing ? (
            <View style={styles.analyzingContainer}>
              <ActivityIndicator size="large" color="#4F7FFA" />
              <Text style={styles.analyzingText}>Đang phân tích phát âm...</Text>
            </View>
          ) : feedbackScore !== null ? (
            <View style={styles.feedbackContainer}>
              <View style={styles.scoreContainer}>
                <LinearGradient
                  colors={
                    feedbackScore >= 85 ? ['#4CD964', '#34Ad4B'] :
                    feedbackScore >= 70 ? ['#FF9500', '#E68600'] :
                    ['#FF3B30', '#CC2F27']
                  }
                  style={styles.scoreCircle}
                >
                  <Text style={styles.scoreText}>{feedbackScore}%</Text>
                </LinearGradient>
                
                <Text style={styles.scoreLabel}>
                  {feedbackScore >= 85 ? 'Tuyệt vời!' :
                   feedbackScore >= 70 ? 'Khá tốt' :
                   'Cần cải thiện'}
                </Text>
              </View>
              
              <View style={styles.feedbackList}>
                {feedback.map((item, index) => (
                  <View key={index} style={styles.feedbackItem}>
                    <FontAwesome5 
                      name={
                        index === 0 && feedbackScore >= 85 ? "star" :
                        "comment"
                      } 
                      size={16} 
                      color={
                        index === 0 && feedbackScore >= 85 ? "#FFD700" :
                        "#666"
                      } 
                    />
                    <Text style={styles.feedbackText}>{item}</Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.recordingActions}>
                <TouchableOpacity 
                  style={styles.playRecordingButton}
                  onPress={playRecording}
                >
                  <Ionicons name="play" size={20} color="#4F7FFA" />
                  <Text style={styles.playRecordingText}>Nghe lại</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.retryButton}
                  onPress={startRecording}
                >
                  <Text style={styles.retryButtonText}>Thử lại</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.recordInstructionsContainer}>
              <Text style={styles.recordInstructionsTitle}>
                Nhấn vào nút dưới đây và đọc từ:
              </Text>
              <Text style={styles.recordInstructionsWord}>{practiceWord.word}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {!isAnalyzing && feedbackScore === null && (
        <View style={styles.recordButtonContainer}>
          <TouchableOpacity
            style={[
              styles.recordButton,
              isRecording && styles.recordingActive
            ]}
            onPress={isRecording ? stopRecording : startRecording}
            activeOpacity={0.7}
          >
            <FontAwesome5 
              name={isRecording ? "stop" : "microphone"} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>
          <Text style={styles.recordButtonLabel}>
            {isRecording ? 'Dừng ghi âm' : 'Nhấn để ghi âm'}
          </Text>
        </View>
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
  scrollContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  wordCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  wordText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  pronunciationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pronunciationText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  speakerButton: {
    marginLeft: 10,
    padding: 4,
  },
  tipsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  tipText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 10,
    flex: 1,
    lineHeight: 22,
  },
  illustrationImage: {
    width: '100%',
    height: 160,
    borderRadius: 16,
    marginTop: 16,
  },
  recordingContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    minHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordInstructionsContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  recordInstructionsTitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
  recordInstructionsWord: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  analyzingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyzingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  feedbackContainer: {
    width: '100%',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  feedbackList: {
    marginBottom: 20,
  },
  feedbackItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  feedbackText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 10,
    flex: 1,
    lineHeight: 22,
  },
  recordingActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  playRecordingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F0F0',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  playRecordingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4F7FFA',
    marginLeft: 6,
  },
  retryButton: {
    backgroundColor: '#4F7FFA',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  recordButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  recordButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  recordingActive: {
    backgroundColor: '#FF9500',
  },
  recordButtonLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
});