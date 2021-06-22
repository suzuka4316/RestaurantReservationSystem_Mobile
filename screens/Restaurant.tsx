import { RouteProp } from "@react-navigation/native";
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
import { List } from "react-native-paper";
import {
  DateTimePicker,
  Button,
  UserStatus,
  SearchBar,
  Card,
  ActivityIndicator,
  HelperText,
} from "../components";
import { RootStackParamList } from "../navigation";

type RestaurantScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "Restaurant">;
  route: RouteProp<RootStackParamList, "Restaurant">;
};

type Availability = {
  startTime: string;
  sittingId: number;
};

type Sitting = {
  availabilities: Availability[];
  shortDescription: string;
  sittingId: number;
};

export const RestaurantScreen: React.FC<RestaurantScreenProps> = ({
  navigation,
  route,
}) => {
  const {
    date: passedDate,
    guestsNumber: passedGuestsNumber,
    restaurant: { id, name, address, phone, email, photos },
    currentUser,
  } = route.params;

  const [date, setDate] = useState(passedDate);
  const [guestsNumber, setGuestsNumber] = useState(
    passedGuestsNumber.toString()
  );
  const [sittings, setSittings] = useState<Sitting[]>([]);
  const [error, setError] = useState("");
  const [invalidInput, setInvalidInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(0);

  useEffect(() => {
    setLoading(true);
    guestsNumber.match(/^[0-9]+$/) == null || guestsNumber == ""
      ? setInvalidInput(true)
      : setInvalidInput(false);
    axios
      .get(
        `https://placeholder-reservations.azurewebsites.net/api/restaurants/${id}/availabilities`,
        {
          params: {
            SelectedDate: moment(date).format("MM-DD-YYYY"),
            Guests: guestsNumber,
            Duration: 90,
          },
        }
      )
      .then(({ data }) => {
        guestsNumber != "" ? setInvalidInput(false) : setInvalidInput(true);
        setSittings(data);
        setLoading(false);
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
  }, [date, guestsNumber]);

  const renderItem = ({ item }: { item: Availability }) => {
    const { startTime } = item;
    return (
      <Button
        mode="contained"
        onPress={() => {
          navigation.navigate("Booking", {
            sittingId: item.sittingId,
            guests: parseInt(guestsNumber),
            selectedDate: date,
            selectedTime: moment(startTime).format("HH:mm:ss"),
            currentUser,
            restaurantName: name,
          });
        }}
      >
        <Text>{moment(startTime).format("HH:mm A")}</Text>
      </Button>
    );
  };

  return (
    <View style={styles.container}>
      <UserStatus currentUser={currentUser} navigation={navigation} />
      <ScrollView>
        <Card
          includeBtn={false}
          title={name}
          contentTitle={address}
          paragraph={`${phone}\n ${email}`}
          uri={
            photos[0] ||
            "https://nastaran.azurewebsites.net/Uploads/Default/2ec96de6-a3e0-4d17-aec1-208e6c03cfd3.png"
          }
        />
        <View style={styles.picker}>
          <DateTimePicker mode="date" initialValue={date} setValue={setDate} />
          <SearchBar
            placeholder="Number of guests"
            onChange={setGuestsNumber}
            value={guestsNumber}
            icon="account-multiple"
          />
        </View>
        <View style={styles.body}>
          {invalidInput && (
            <HelperText style={styles.error} type="error" visible={true}>
              Invalid input for number of guests
            </HelperText>
          )}
          {error && !invalidInput ? (
            <HelperText style={styles.error} type="error" visible={true}>
              {error}
            </HelperText>
          ) : loading ? (
            <ActivityIndicator />
          ) : (
            <SafeAreaView>
              {sittings.length == 0 && !invalidInput ? (
                <HelperText style={styles.info} type="info" visible={true}>
                  No availabilities for the selected date
                </HelperText>
              ) : (
                <View>
                  {sittings.map((s, index) => {
                    return (
                      <List.Accordion
                        title={s.shortDescription}
                        key={index}
                        expanded={expandedIndex === index}
                        onPress={() =>
                          expandedIndex === index
                            ? setExpandedIndex(-1)
                            : setExpandedIndex(index)
                        }
                      >
                        <SafeAreaView>
                          <FlatList
                            data={s.availabilities}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.startTime}
                          />
                        </SafeAreaView>
                      </List.Accordion>
                    );
                  })}
                </View>
              )}
            </SafeAreaView>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  picker: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
  },
  body: {
    flex: 1,
    margin: 20,
    marginTop: 5,
  },
  error: {
    backgroundColor: "#EBDAE1",
    margin: 5,
    fontWeight: "bold",
    textAlign: "center",
    borderRadius: 5,
  },
  info: {
    backgroundColor: "#EBDAE1",
    margin: 5,
    fontWeight: "bold",
    textAlign: "center",
    borderRadius: 5,
  },
});
