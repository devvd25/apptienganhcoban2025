import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  Switch,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { toast } from 'sonner-native';

export default function Profile() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('Học viên');
  const [dailyGoal, setDailyGoal] = useState(80);
  const [streak, setStreak] = useState(7);
  const [totalWords, setTotalWords] = useState(254);
  
  // Settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const stats = [
    { label: 'Từ đã học', value: totalWords, icon: 'book', color: '#4F7FFA' },
    { label: 'Chuỗi ngày', value: streak, icon: 'fire', color: '#FF9500' },
    { label: 'Mục tiêu hằng ngày', value: dailyGoal, icon: 'bullseye', color: '#4CD964' },
  ];
  
  const achievements = [
    { 
      id: 1, 
      title: 'Khởi đầu Hành trình', 
      description: 'Học 5 ngày liên tiếp', 
      progress: 100, 
      completed: true, 
      icon: 'rocket' 
    },
    { 
      id: 2, 
      title: 'Trí nhớ Siêu phàm', 
      description: 'Thuộc 100 từ vựng', 
      progress: 100, 
      completed: true, 
      icon: 'brain' 
    },
    { 
      id: 3, 
      title: 'Kiên trì Học tập', 
      description: 'Học 30 ngày liên tiếp', 
      progress: Math.round((streak / 30) * 100), 
      completed: false, 
      icon: 'calendar-check' 
    },
    { 
      id: 4, 
      title: 'Bậc thầy Phát âm', 
      description: 'Đạt điểm phát âm 90% cho 20 từ', 
      progress: 45, 
      completed: false, 
      icon: 'microphone-alt' 
    },
  ];

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    toast.success(
      !notificationsEnabled 
        ? "Đã bật thông báo" 
        : "Đã tắt thông báo"
    );
  };
  
  const toggleDarkMode = () => {
    setDarkModeEnabled(!darkModeEnabled);
    toast.success(
      !darkModeEnabled 
        ? "Đã bật chế độ tối" 
        : "Đã tắt chế độ tối"
    );
  };
  
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    toast.success(
      !soundEnabled 
        ? "Đã bật âm thanh" 
        : "Đã tắt âm thanh"
    );
  };

  const resetProgress = () => {
    Alert.alert(
      "Xác nhận đặt lại",
      "Bạn có chắc chắn muốn đặt lại toàn bộ tiến trình? Hành động này không thể hoàn tác.",
      [
        {
          text: "Hủy",
          style: "cancel"
        },
        { 
          text: "Đặt lại", 
          style: "destructive",
          onPress: () => {
            // Reset logic would go here
            toast.error("Đã đặt lại toàn bộ tiến trình");
          }
        }
      ]
    );
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
        <Text style={styles.headerTitle}>Hồ sơ</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <Image 
            source={{ uri: 'https://api.a0.dev/assets/image?text=friendly%20profile%20avatar%20minimal%20design&aspect=1:1' }} 
            style={styles.profileImage} 
          />
          
          <Text style={styles.username}>{username}</Text>
          
          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileText}>Chỉnh sửa hồ sơ</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <View 
                style={[
                  styles.iconBackground, 
                  { backgroundColor: stat.color }
                ]}
              >
                <FontAwesome5 name={stat.icon} size={16} color="white" />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Thành tựu</Text>
          
          {achievements.map(achievement => (
            <View key={achievement.id} style={styles.achievementItem}>
              <View style={styles.achievementHeader}>
                <View style={styles.achievementIconContainer}>
                  <LinearGradient
                    colors={achievement.completed ? ['#4CD964', '#34Ad4B'] : ['#CCCCCC', '#AAAAAA']}
                    style={styles.achievementIconBackground}
                  >
                    <FontAwesome5 name={achievement.icon} size={18} color="white" />
                  </LinearGradient>
                </View>
                
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <Text style={styles.achievementDescription}>{achievement.description}</Text>
                </View>
                
                {achievement.completed && (
                  <Ionicons name="checkmark-circle" size={24} color="#4CD964" />
                )}
              </View>
              
              {!achievement.completed && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${achievement.progress}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressText}>{achievement.progress}%</Text>
                </View>
              )}
            </View>
          ))}
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Cài đặt</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications" size={22} color="#666" />
              <Text style={styles.settingText}>Thông báo</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: '#D1D1D6', true: '#4CD964' }}
              thumbColor={'#FFFFFF'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="moon" size={22} color="#666" />
              <Text style={styles.settingText}>Chế độ tối</Text>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#D1D1D6', true: '#4CD964' }}
              thumbColor={'#FFFFFF'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="volume-high" size={22} color="#666" />
              <Text style={styles.settingText}>Âm thanh</Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={toggleSound}
              trackColor={{ false: '#D1D1D6', true: '#4CD964' }}
              thumbColor={'#FFFFFF'}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.dangerButton}
            onPress={resetProgress}
          >
            <Ionicons name="refresh-circle" size={22} color="#FF3B30" />
            <Text style={styles.dangerButtonText}>Đặt lại tiến trình</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Thông tin ứng dụng</Text>
          
          <TouchableOpacity style={styles.infoItem}>
            <Ionicons name="help-circle" size={22} color="#666" />
            <Text style={styles.infoText}>Trợ giúp & Hỗ trợ</Text>
            <Ionicons name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.infoItem}>
            <Ionicons name="document-text" size={22} color="#666" />
            <Text style={styles.infoText}>Điều khoản sử dụng</Text>
            <Ionicons name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.infoItem}>
            <Ionicons name="shield-checkmark" size={22} color="#666" />
            <Text style={styles.infoText}>Chính sách bảo mật</Text>
            <Ionicons name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>
          
          <View style={styles.versionInfo}>
            <Text style={styles.versionText}>Phiên bản 1.0.0</Text>
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
  profileSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  editProfileButton: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  editProfileText: {
    fontSize: 14,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  iconBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  sectionContainer: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  achievementItem: {
    marginBottom: 16,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIconContainer: {
    marginRight: 12,
  },
  achievementIconBackground: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingLeft: 48,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    marginRight: 8,
  },
  progressFill: {
    height: 6,
    backgroundColor: '#4F7FFA',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    width: 36,
    textAlign: 'right',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  dangerButtonText: {
    fontSize: 16,
    color: '#FF3B30',
    marginLeft: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  versionInfo: {
    alignItems: 'center',
    marginTop: 16,
  },
  versionText: {
    fontSize: 14,
    color: '#999',
  },
});