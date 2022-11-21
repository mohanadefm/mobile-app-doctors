import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { useFonts } from "expo-font";
import HomeScreen from "./screens/Home";
import DoctorsScreen from "./screens/Doctor";
import SignUp from "./screens/SignUp";
import SignIn from "./screens/SignIn";
import Profile from "./screens/Profile";
import { Button } from "react-native";

const Stack = createStackNavigator();

export default function App() {
  const [loaded] = useFonts({
    NoToFont: require("./assets/fonts/NotoKufiArabic-Regular.ttf"),
  });

  // console.log("NoToFont", loaded);

  if (!loaded) {
    // console.log("not loaded");
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#007bff" },
          headerTintColor: "#fff",
          headerTitleStyle: { textAlign: "right", fontFamily: "NoToFont" },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Doctors"
          component={DoctorsScreen}
          options={{ title: "الأطباء" }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ title: "حساب جديد" }}
        />
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{ title: "تسجيل الدخول" }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ title: "الملف الشخصي" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
