import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";
import axios from "axios";
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, TextInput, Text } from "../components";
import { RootStackParamList } from "../navigation";

type RegisterScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "Register">;
};

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  navigation,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function register() {
    setLoading(true);
    try {
      if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !password ||
        !confirmPassword
      ) {
        throw "Please fill out each field";
      }
      if (password !== confirmPassword) {
        throw "Passwords do not match";
      }
      const registerResponse = await axios.post(
        "https://placeholder-reservations.azurewebsites.net/api/accounts/register",
        {
          firstName,
          lastName,
          email,
          phone,
          password,
          confirmPassword,
        }
      );
      if (registerResponse.status != 200) {
        throw registerResponse.statusText;
      }
      const token = registerResponse.data.token;
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
        console.log(err.response.data);
        setError(err.response.data[""].join("\n"));
      } else {
        setError(String(err));
      }
    }
  }

  return (
    <View style={styles.container}>
      <TextInput label="Email" value={email} onChangeText={setEmail} />
      <TextInput
        label="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        label="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput label="Phone" value={phone} onChangeText={setPhone} />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button mode="outlined" onPress={register} loading={loading}>
          Register
        </Button>
      </View>
      <View>{error ? <Text>{error}</Text> : null}</View>
      <View style={styles.loginView}>
        <View>
          <Text>Already have an account?</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={() => navigation.push("Login")}>Login here.</Button>
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
  loginView: {
    marginTop: 10,
  },
});
