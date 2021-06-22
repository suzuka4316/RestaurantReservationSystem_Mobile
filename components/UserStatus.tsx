import React from "react";
import { StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../screens";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation";
import { Appbar } from "react-native-paper";

type UserStatusProps = {
  currentUser: User | null;
  navigation: StackNavigationProp<
    RootStackParamList,
    "Home" | "Restaurant" | "Booking"
  >;
};

export function UserStatus(props: UserStatusProps) {
  const { currentUser, navigation } = props;

  const logOut = async () => {
    await AsyncStorage.clear();
    navigation.replace("Home");
  };

  return (
    <>
      {currentUser ? (
        <Appbar>
          <Appbar.Content title={`Hi ${currentUser.firstName}!`} />
          <Appbar.Action
            icon="account-circle"
            onPress={() => navigation.navigate("Member")}
          />

          <Appbar.Action icon="logout" onPress={logOut} />
        </Appbar>
      ) : (
        <Appbar>
          <Appbar.Content title={`Login or Register`} />
          <Appbar.Action
            icon="login"
            onPress={() => navigation.navigate("Login")}
          />
          <Appbar.Action
            icon="account-plus"
            onPress={() => navigation.navigate("Register")}
          />
        </Appbar>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
