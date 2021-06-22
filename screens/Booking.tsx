import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import axios from "axios";
import moment from "moment";
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Title } from "react-native-paper";
import {
  Button,
  Dialog,
  HelperText,
  Modal,
  Subheading,
  TextInput,
  UserStatus,
} from "../components";
import { RootStackParamList } from "../navigation";

type BookingScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "Booking">;
  route: RouteProp<RootStackParamList, "Booking">;
};

type Booking = {
  name: string;
  guests: number;
  startTime: string;
  confirmationCode: string;
  fullName: string;
};

export const BookingScreen: React.FC<BookingScreenProps> = ({
  navigation,
  route,
}) => {
  const {
    sittingId,
    guests,
    selectedDate,
    selectedTime,
    currentUser,
    restaurantName,
  } = route.params;

  const [firstName, setFirstName] = useState(currentUser?.firstName || "");
  const [lastName, setLastName] = useState(currentUser?.lastName || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [notes, setNotes] = useState("");
  const [visible, setVisible] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState("");
  const [invalidInput, setInvalidInput] = useState(false);

  const onCreateReservation = () => {
    if (!firstName || !lastName || !email || !phone) {
      setInvalidInput(true);
    }
    console.log(moment(selectedDate).format("MM-DD-YYYY"));
    axios
      .post(
        `https://placeholder-reservations.azurewebsites.net/api/reservations`,
        {
          firstName,
          lastName,
          email,
          phone,
          sittingId,
          guests,
          selectedDate: moment(selectedDate).format("MM-DD-YYYY"),
          selectedTime,
        }
      )
      .then(({ data }) => {
        setBooking(data);
        setVisible(true);
        setError("");
        setInvalidInput(false);
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.data) {
            setError(err.response.data.title);
          } else {
            setError("Something went wrong");
            setInvalidInput(false);
          }
        } else {
          setError("Check the network connection");
          setInvalidInput(false);
        }
      });
  };

  const hideModal = () => {
    setVisible(false);
    navigation.navigate("Home");
  };

  return (
    <View>
      <UserStatus currentUser={currentUser} navigation={navigation} />
      <View style={styles.container}>
        <ScrollView>
          <View>
            <View style={styles.header}>
              <Title>{`Reservation for ${restaurantName}`}</Title>
              <Subheading>{`Date : ${moment(selectedDate).format(
                "DD/MM/YYYY"
              )}`}</Subheading>
            </View>

            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First Name"
            ></TextInput>
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last Name"
            ></TextInput>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
            ></TextInput>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone"
            ></TextInput>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Notes"
            ></TextInput>
            <View style={{ marginTop: 10 }}>
              <Button mode="contained" onPress={onCreateReservation}>
                <Text>Create Reservation</Text>
              </Button>
            </View>
          </View>
        </ScrollView>
        {invalidInput && (
          <HelperText style={styles.error} type="error" visible={true}>
            "Please fill out the required fields"
          </HelperText>
        )}
        <View>
          {error ? (
            <HelperText style={styles.error} type="error" visible={true}>
              {error}
            </HelperText>
          ) : null}
        </View>
        {booking && (
          <Modal
            visible={visible}
            onDismiss={hideModal}
            title={`Reservation for restaurant ${booking.name}`}
            paragraph={`Date and Time: ${moment(booking.startTime).format(
              "Do MMM YYYY, h:mm a"
            )}\nGuests: ${booking.guests}\nName: ${
              booking.fullName
            }\nConfirmation Code: ${booking.confirmationCode}\n`}
            onPress={hideModal}
            text="Done"
          ></Modal>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    marginBottom: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    backgroundColor: "#EBDAE1",
    margin: 5,
    fontWeight: "bold",
    textAlign: "center",
    borderRadius: 5,
  },
});
