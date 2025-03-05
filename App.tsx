import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Toaster } from 'sonner-native';
import HomeScreen from "./screens/HomeScreen";
import FlashcardStudy from "./screens/FlashcardStudy";
import ReviewSession from "./screens/ReviewSession";
import CategoryDetail from "./screens/CategoryDetail";
import WordDetail from "./screens/WordDetail";
import PronunciationPractice from "./screens/PronunciationPractice";
import Profile from "./screens/Profile";
import AiSuggestions from "./screens/AiSuggestions";

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="FlashcardStudy" component={FlashcardStudy} />
      <Stack.Screen name="ReviewSession" component={ReviewSession} />
      <Stack.Screen name="CategoryDetail" component={CategoryDetail} />
      <Stack.Screen name="WordDetail" component={WordDetail} />
      <Stack.Screen name="PronunciationPractice" component={PronunciationPractice} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="AiSuggestions" component={AiSuggestions} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default function App() {
  return (
    <SafeAreaProvider style={styles.container}>
      <Toaster />
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
