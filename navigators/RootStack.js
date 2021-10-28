import React from "react";

import { Colors } from "../components/styles";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../screens/Login";
import SignUp from "../screens/SignUp";
import Welcome from "../screens/Welcome";

const Stack = createStackNavigator();

const { primary, tertiary } = Colors;

const RootStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerTintColor: tertiary,
          headerTransparent: true,
          headerTitle: "",
          headerLeftContainerStyle: {
            paddingLeft: 20,
          },
        }}
        initialRouteName="Login"
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen
          options={{ headerTintColor: primary }}
          name="Welcome"
          component={Welcome}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;
