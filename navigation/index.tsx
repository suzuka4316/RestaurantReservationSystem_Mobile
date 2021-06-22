import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  HomeScreen,
  LoginScreen,
  RegisterScreen,
  MemberScreen,
  RestaurantScreen,
  BookingScreen,
  Restaurant,
  User,
} from "../screens";

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Member: undefined;
  Register: undefined;
  Restaurant: {
    currentUser: User | null;
    date: Date;
    guestsNumber: number;
    restaurant: Restaurant;
  };
  Booking: {
    currentUser: User | null;
    sittingId: number;
    guests: number;
    selectedDate: Date;
    selectedTime: string;
    restaurantName : string;
  };
};

const Stack = createStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Member" component={MemberScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Restaurant" component={RestaurantScreen} />
        <Stack.Screen name="Booking" component={BookingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
