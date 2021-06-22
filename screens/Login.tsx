import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";
import axios from "axios";
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "../components";
import { RootStackParamList } from "../navigation";

type LoginScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "Login">;
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function login() {
    try {
      setLoading(true);
      const loginResponse = await axios.post(
        "https://placeholder-reservations.azurewebsites.net/api/accounts/login",
        {
          email,
          password,
        }
      );
      const token = loginResponse.data.token;
      await AsyncStorage.setItem("authToken", `Bearer ${token}`);
      const tokenFromStorage = await AsyncStorage.getItem("authToken");
      const userProfileResponse = await axios.get(
        "https://placeholder-reservations.azurewebsites.net/api/accounts",
        {
          headers: {
            Authorization: tokenFromStorage,
          },
          withCredentials: true,
        }
      );
      await AsyncStorage.setItem(
        "user",
        JSON.stringify(userProfileResponse.data)
      );
      setLoading(false);
      navigation.replace("Home");
    } catch (err) {
      setLoading(false);
      if (err.response) {
        console.log(err.response);
        setError(err.response.data[""].join("\n"));
      }
      setError(String(err));
    }
  }

  return (
    <View style={styles.container}>
      <TextInput label="Email" onChangeText={setEmail} />

      <TextInput label="Password" onChangeText={setPassword} secureTextEntry />

      <View style={styles.buttonContainer}>
        <Button mode="outlined" onPress={login} loading={loading}>
          Login
        </Button>
      </View>
      <View>{error ? <Text>{error}</Text> : null}</View>
      <View style={styles.registerView}>
        <View>
          <Text>Don't have an account?</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={() => navigation.push("Register")}>
            Register here.
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    marginVertical: 5,
  },
  registerView: {
    marginTop: 10,
  },
});
