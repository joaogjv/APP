// AppNavigator.tsx
import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "./LoginScreen";
import Index from "./index";

export type RootStackParamList = {
  Login: undefined;
  Index: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  // Estado que controla login
  const [userToken, setUserToken] = useState<string | null>(null);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* 🔹 Se não tem token -> abre Login */}
        {userToken === null ? (
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} setUserToken={setUserToken} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Index">
            {(props) => <Index {...props} setUserToken={setUserToken} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
