import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";
import axios from "axios";
import moment from "moment";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { List, Title } from "react-native-paper";
import {
  DateTimePicker,
  SearchBar,
  Card,
  UserStatus,
  ActivityIndicator,
  HelperText,
} from "../components";
import { RootStackParamList } from "../navigation";

type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "Home">;
};

export type User = {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phone: string;
};

export type Restaurant = {
  id: number;
  name: string;
  address: string;
  email: string;
  phone: string;
  photos: string[];
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  let currentDateTime = new Date();
  currentDateTime.getHours() > 17
    ? currentDateTime.setDate(currentDateTime.getDate() + 1)
    : currentDateTime;
  currentDateTime.setHours(19, 0);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [date, setDate] = useState(currentDateTime);
  const [time, setTime] = useState(currentDateTime);
  const [expanded, setExpanded] = useState(true);
  const [loading, setLoading] = useState(false);
  const [guestsNumber, setGuestsNumber] = useState("2");
  const [searchTerm, setSearchTerm] = useState("");
  const [availableRestaurants, setAvailableRestaurants] = useState<
    Restaurant[]
  >([]);
  const [recentRestaurants, setRecentRestaurants] = useState<Restaurant[]>([]);
  const [error, setError] = useState("");
  const [invalidInput, setInvalidInput] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        setCurrentUser(user ? JSON.parse(user) : null);
      } catch (err) {}
    })();
  }, []);

  useEffect(() => {
    setLoading(true);
    guestsNumber.match(/^[0-9]+$/) == null || guestsNumber == ""
      ? setInvalidInput(true)
      : setInvalidInput(false);
    axios
      .get("https://placeholder-reservations.azurewebsites.net/api/restaurants", {
        params: {
          SearchValue: searchTerm,
          Date: moment(date).format("MM-DD-YYYY"),
          Time: `${time.getHours()}:${time.getMinutes()}`,
          Guests: guestsNumber,
          PageNumber: 1,
        },
      })
      .then(({ data }) => {
        setLoading(false);
        guestsNumber != "" ? setInvalidInput(false) : setInvalidInput(true);
        setAvailableRestaurants(data.availableRestaurantsToShow);
        setRecentRestaurants(data.recentRestaurants);
        setError("");
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          if (err.response.data) {
            setError(err.response.data.title);
          } else {
            setError("Something went wrong");
          }
        } else {
          setError("Check the network connection");
        }
      });
  }, [date, time, guestsNumber, searchTerm]);

  const renderItem = ({ item }: { item: Restaurant }) => {
    const { name, address, photos, phone, id } = item;
    return (
      <Card
        title={name}
        contentTitle={address}
        paragraph={phone}
        uri={
          photos[0] ||
          "https://nastaran.azurewebsites.net/Uploads/Default/2ec96de6-a3e0-4d17-aec1-208e6c03cfd3.png"
        }
        btnTitle="Make a reservation"
        onPress={() =>
          navigation.navigate("Restaurant", {
            date,
            guestsNumber: parseInt(guestsNumber),
            restaurant: item,
            currentUser,
          })
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <UserStatus currentUser={currentUser} navigation={navigation} />
      <View style={styles.body}>
        <View>
          <Title style={styles.title}>Book Now!</Title>
          <List.Section>
            <DateTimePicker
              mode="date"
              initialValue={date}
              setValue={setDate}
            />
            <DateTimePicker
              mode="time"
              initialValue={time}
              setValue={setTime}
            />
            <SearchBar
              placeholder="Number of guests"
              onChange={setGuestsNumber}
              value={guestsNumber}
              icon="account-multiple"
            />
            <SearchBar
              placeholder="Location/Name"
              onChange={setSearchTerm}
              value={searchTerm}
              icon="magnify"
            />
          </List.Section>
        </View>
        <ScrollView>
          <View>
            {/* <Text>{date.toLocaleDateString()}</Text>
          <Text>{`${time.getHours()}:${time.getMinutes()}`}</Text> */}
            {invalidInput && (
              <HelperText style={styles.error} type="error" visible={true}>
                Invalid input for number of guests
              </HelperText>
            )}
            {error && !invalidInput ? (
              <HelperText style={styles.error} type="error" visible={true}>
                {error}
              </HelperText>
            ) : (
              <View>
                <View style={styles.container}>
                  <ScrollView>
                    <List.Accordion
                      title="Available Restaurants"
                      expanded={expanded}
                      onPress={() => setExpanded(!expanded)}
                    >
                      {loading ? (
                        <ActivityIndicator />
                      ) : (
                        <SafeAreaView>
                          <FlatList
                            data={availableRestaurants}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id.toString()}
                          />
                        </SafeAreaView>
                      )}
                    </List.Accordion>
                    <List.Accordion title="New Restaurants">
                      {loading ? (
                        <ActivityIndicator />
                      ) : (
                        <SafeAreaView>
                          <FlatList
                            data={recentRestaurants}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id.toString()}
                          />
                        </SafeAreaView>
                      )}
                    </List.Accordion>
                  </ScrollView>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  body: {
    flex: 1,
    margin: 20,
  },
  error: {
    backgroundColor: "#EBDAE1",
    margin: 5,
    fontWeight: "bold",
    textAlign: "center",
    borderRadius: 5,
  },
});
