// App.js

import React from "react";
import { StatusBar } from "react-native";

// Import navigation components and themes
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import ErrorBoundary from "./ErrorBoundary";
// Bottom tab navigator for Instagram-style navigation
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// Native stack navigator for native-style headers on each tab's stack
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// Ionicons for tab bar icons
import Ionicons from "@expo/vector-icons/Ionicons";
// Import all screen components
import HomeScreen from "./Screens/HomeScreen";
import ChatScreen from "./Screens/ChatScreen";
import ProfileScreen from "./Screens/ProfileScreen";
import AddScreen from "./Screens/AddScreen";
import EditProfileScreen from "./Screens/EditProfileScreen";
import CreateGroupScreen from "./Screens/CreateGroupScreen";
import UserSearchScreen from "./Screens/UserSearchScreen";
import PostViewScreen from "./Screens/PostViewScreen";
import LoginScreen from "./Screens/LoginScreen";
import UsernameScreen from "./Screens/UsernameScreen";
import LoadingScreen from "./Screens/LoadingScreen";
import FirebaseTest from "./FirebaseTest";
// Import contexts
import { ProfileProvider } from "./ProfileContext";
import { AuthProvider, useAuth } from "./AuthContext";

/**
 * Create native stack navigator for Home tab to provide
 * native header appearance and future stack navigation support inside tab
 */
const HomeStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        // Header styling: dark background to match app theme
        headerStyle: {
          backgroundColor: "#121212",
        },
        // Header text and icon color (back button, title)
        headerTintColor: "#fff",
      }}
    >
      {/* Define the main screen for Home stack */}
      <HomeStack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }} // Hide the stack header
      />
      <HomeStack.Screen
        name="AddPost"
        component={AddScreen}
        options={{ headerShown: false }}
      />
    </HomeStack.Navigator>
  );
}

/**
 * Create native stack navigator for Chat tab
 */
const ChatStack = createNativeStackNavigator();

function ChatStackScreen() {
  return (
    <ChatStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#121212",
        },
        headerTintColor: "#fff",
      }}
    >
      <ChatStack.Screen
        name="ChatMain"
        component={ChatScreen}
        options={{ headerShown: false }}
      />
      <ChatStack.Screen
        name="CreateGroup"
        component={CreateGroupScreen}
        options={{ headerShown: false }}
      />
    </ChatStack.Navigator>
  );
}

/**
 * Create native stack navigator for Profile tab
 */
const ProfileStack = createNativeStackNavigator();

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#121212",
        },
        headerTintColor: "#fff",
      }}
    >
      <ProfileStack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="AddPost"
        component={AddScreen}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="UserSearch"
        component={UserSearchScreen}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="PostView"
        component={PostViewScreen}
        options={{ headerShown: false }}
      />
    </ProfileStack.Navigator>
  );
}

// Create the Bottom Tab Navigator for Instagram-style navigation
const Tab = createBottomTabNavigator();

// Define screen options for the tab navigator
const screenOptions = ({ route }) => ({
  // Render Instagram-style icons for each tab
  tabBarIcon: ({ focused, color }) => {
    let iconName;

    // Instagram-style icon mapping
    if (route.name === "HomeTab") {
      iconName = focused ? "home" : "home-outline";
    } else if (route.name === "ChatTab") {
      iconName = focused ? "chatbubbles" : "chatbubbles-outline";
    } else if (route.name === "ProfileTab") {
      iconName = focused ? "person" : "person-outline";
    }

    return <Ionicons name={iconName} size={28} color={color} />;
  },

  tabBarShowIcon: true,
  tabBarActiveTintColor: "#fff", // White for active tab
  tabBarInactiveTintColor: "#888", // Gray for inactive tabs
  tabBarShowLabel: false, // Hide labels completely
  lazy: true,
  headerShown: false,

  // Instagram-style tab bar styling
  tabBarStyle: {
    backgroundColor: "#121212",
    borderTopWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
    height: 80,
    paddingBottom: 20,
    paddingTop: 12,
  },
});

function MainApp() {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      {/* Define 3 Instagram-style tabs */}
      <Tab.Screen
        name="HomeTab"
        component={HomeStackScreen}
        options={{ title: "" }}
      />
      <Tab.Screen
        name="ChatTab"
        component={ChatStackScreen}
        options={{ title: "" }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackScreen}
        options={{ title: "" }}
      />
    </Tab.Navigator>
  );
}

// Authentication Navigator
const AuthStack = createNativeStackNavigator();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Username" component={UsernameScreen} />
    </AuthStack.Navigator>
  );
}

// Main App Navigator
const AppStack = createNativeStackNavigator();

function AppNavigator() {
  const { user, username, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <AppStack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <AppStack.Screen name="Auth" component={AuthNavigator} />
      ) : !username ? (
        <AppStack.Screen name="Username" component={UsernameScreen} />
      ) : (
        <AppStack.Screen name="MainApp" component={MainApp} />
      )}
    </AppStack.Navigator>
  );
}

/**
 * Main App component sets up navigation container, tabs, and theme
 */
export default function App() {
  return (
    <ErrorBoundary>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <NavigationContainer theme={DarkTheme}>
        <AuthProvider>
          <ProfileProvider>
            <AppNavigator />
          </ProfileProvider>
        </AuthProvider>
      </NavigationContainer>
    </ErrorBoundary>
  );
}
