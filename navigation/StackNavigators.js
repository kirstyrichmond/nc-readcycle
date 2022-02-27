// TODO: Back button, no header, no tabs.

import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabNavigator from "./TabNavigator";

const MainStack = createNativeStackNavigator();

const HomeStack = createNativeStackNavigator();
import HomeScreen from "../screens/HomeScreen";

const LogInStack = createNativeStackNavigator();
import LogInScreen from "../screens/LogInScreen";
import SignUpScreen from "../screens/SignUpScreen";

const ListBookStack = createNativeStackNavigator();
import ListBookScreen from "../screens/ListBookScreen";
import ScannerScreen from "../screens/ScannerScreen";

const MessagesStack = createNativeStackNavigator();
import MessagesScreen from "../screens/MessagesScreen";
import UserProfileScreen from "../screens/UserProfileScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import SingleBookScreen from "../screens/SingleBookScreen";

const ProfileStack = createNativeStackNavigator();

const SearchStack = createNativeStackNavigator();
import SearchScreen from "../screens/SearchScreen";

export function MainStackNavigator() {
  return (
    <MainStack.Navigator
      initialRouteName="SignUpScreen"
      screenOptions={{ headerShown: false }}
    >
      <MainStack.Screen name="SignUpScreen" component={SignUpScreen} />
      <MainStack.Screen name="LogInScreen" component={LogInScreen} />
      <MainStack.Screen
        name="BottomTabNavigator"
        component={BottomTabNavigator}
      />
    </MainStack.Navigator>
  );
}

export function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{ headerShown: false }}
    >
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
      <HomeStack.Screen name="SingleBookScreen" component={SingleBookScreen} />
    </HomeStack.Navigator>
  );
}

export function LogInStackScreen() {
  return (
    <LogInStack.Navigator
      initialRouteName="SignUpScreen"
      screenOptions={{ headerShown: false }}
    >
      <LogInStack.Screen
        name="SignUpScreen"
        component={SignUpScreen}
        options={{ headerShown: false }}
      />
      <LogInStack.Screen name="LogInScreen" component={LogInScreen} />
      <LogInStack.Screen name="HomeScreen" component={HomeScreen} />
      <LogInStack.Screen name="SingleBookScreen" component={SingleBookScreen} />
    </LogInStack.Navigator>
  );
}

export function ListBookStackScreen() {
  return (
    <ListBookStack.Navigator
      initialRouteName="ListBookScreen"
      screenOptions={{ headerShown: false }}
    >
      <ListBookStack.Screen name="ListBookScreen" component={ListBookScreen} />
      <ListBookStack.Screen name="ScannerScreen" component={ScannerScreen} />
    </ListBookStack.Navigator>
  );
}

export function MessagesStackScreen() {
  return (
    <MessagesStack.Navigator
      initialRouteName="MessagesScreen"
      screenOptions={{ headerShown: false }}
    >
      <MessagesStack.Screen name="MessagesScreen" component={MessagesScreen} />
      <MessagesStack.Screen
        name="SingleBookScreen"
        component={SingleBookScreen}
      />
      <MessagesStack.Screen
        name="UserProfileScreen"
        component={UserProfileScreen}
      />
    </MessagesStack.Navigator>
  );
}

export function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator
      initialRouteName="UserProfileScreen"
      screenOptions={{ headerShown: false }}
    >
      <ProfileStack.Screen
        name="UserProfileScreen"
        component={UserProfileScreen}
      />
      <ProfileStack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
      />
      <ProfileStack.Screen
        name="SingleBookScreen"
        component={SingleBookScreen}
      />
    </ProfileStack.Navigator>
  );
}

export function SearchStackScreen() {
  return (
    <SearchStack.Navigator
      initialRouteName="SearchScreen"
      screenOptions={{ headerShown: false }}
    >
      <SearchStack.Screen name="SearchScreen" component={SearchScreen} />
      <SearchStack.Screen
        name="UserProfileScreen"
        component={UserProfileScreen}
      />
      <SearchStack.Screen
        name="SingleBookScreen"
        component={SingleBookScreen}
      />
    </SearchStack.Navigator>
  );
}
