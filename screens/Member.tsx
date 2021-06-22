import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, DatePickerIOSComponent, Platform, ViewBase } from 'react-native';
import { StackNavigationProp } from "@react-navigation/stack";
import { List } from 'react-native-paper';
import moment from 'moment';

import { ActivityIndicator, Button, Dialog, Paragraph, Subheading, TextInput } from '../components';
import { getAllReservations, getReservationById, requestUpdate } from '../services/memberReservations';
import { RootStackParamList } from "../navigation";

import DateTimePicker from '@react-native-community/datetimepicker';
import { ScrollView } from 'react-native-gesture-handler';

type Reservation = {
  duration: number;
  email: string;
  guests: number;
  id: number;
  notes: string;
  startTime: Date;
  phone: string;
}

type MemberScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "Member">;
};

export const MemberScreen: React.FC<MemberScreenProps> = ({ navigation }) => {
  const [details, setDetails] = useState({});
  const [expanded, setExpanded] = useState(true);
  const [loading, setLoading] = useState(false);
  const [nextReservations, setNextReservations] = useState<Array<string | number>>([]);
  const [pastReservations, setPastReservations] = useState<Array<string | number>>([]);
  const [visible, setVisible] = useState(false);

  const[duration, setDuration] = useState("");
  const[email, setEmail] = useState("");
  const[guests, setGuests] = useState("");
  const[id, setId] = useState("");
  const[notes, setNotes] = useState("");
  const[phone, setPhone] = useState("");
  const[startTime, setStartTime] = useState(new Date());

  //datetime picker
  const [mode, setMode] = useState<any>('date');
  const [show, setShow] = useState(false);

  const onChange = (event:any, selectedDate:any) => {
    const currentDate = selectedDate || startTime;
    setShow(Platform.OS === 'ios');
    setStartTime(currentDate);
  };

  const showMode = (currentMode: any) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };
  //datetime picker

  useEffect(() => {
    setLoading(true);
    getAllReservations().then((data: Array<string | number>) => {
      setLoading(false);
      const future = data.filter((d: any) => new Date(d.startTime) > new Date());
      setNextReservations(future);
      const past = data.filter((d: any) => new Date(d.startTime) <= new Date());
      setPastReservations(past);
    }).catch(error => {
      setLoading(false);
      alert("Something went wrong.");
    })
  }, []); 

  const detailsOnPress = (id: number) => {
    getReservationById(id).then((data: Reservation) => {
      setDetails(data);
      setDuration(data.duration.toString());
      setEmail(data.email);
      setGuests(data.guests.toString());
      setId(data.id.toString());
      setNotes(data.notes);
      setPhone(data.phone);
      setStartTime(data.startTime);
      setVisible(true);
    }).catch(error => {
      alert("Something went wrong.");
    })
  }

  const renderReservation = (props : any) => {
    if (props != null && new Date(props.startTime) > new Date()) {
      return (
        <Dialog 
          visible={visible} 
          onDismiss={() => setVisible(false)} 
          title={`Reservation for ${props.restaurantName}`} 
        >
            <Subheading>Date Time: {moment(startTime).format('DD/MM/YYYY hh:mm a')}</Subheading>
            <View style={styles.changeDateTimeBtnContainer}>
              <Button onPress={showDatepicker}>Change Date</Button>
              <Button onPress={showTimepicker}>Change Time</Button>
            </View>
            {show && (
              <DateTimePicker testID="dateTimePicker" value={moment(startTime).toDate()} mode={mode} is24Hour={true} display="default" onChange={onChange} />
            )}
            <TextInput label="Duration" placeholder='Duration' value={duration} onChangeText={setDuration}/>
            <TextInput label="Guests" placeholder='Guests' value={guests} onChangeText={setGuests}/>
            <TextInput label="Email" placeholder='Email' value={email} onChangeText={setEmail}/>
            <TextInput label="Phone" placeholder='Phone' value={phone} onChangeText={setPhone}/>
            <ScrollView>
              <TextInput label="Notes" placeholder='Notes' editable={false} multiline={true} value={notes}/>
            </ScrollView>
            <View style={styles.btnContainer}>
              <Button mode="outlined" onPress={() => setVisible(false)}>Done</Button>
              <Button mode="contained" onPress={() => requestOnPress("update")}>Request Update</Button>
              <Button mode="contained" onPress={() => requestOnPress("cancel")}>Request Cancellation</Button>
            </View>
        </Dialog>
      )
    }
    else if (props != null && new Date(props.startTime) <= new Date()) {
      return (
        <Dialog 
          visible={visible} 
          onDismiss={() => setVisible(false)} 
          title={`Reservation for ${props.restaurantName}`}
        >
          <Paragraph>{`Date: ${moment(props.startTime).format('Do MMM YYYY, h:mm a')}\nDuration: ${props.duration}\nGuests: ${props.guests}\nEmail: ${props.email}\nPhone: ${props.phone}`}</Paragraph>
          <Button mode="outlined" onPress={() => setVisible(false)}>Done</Button>
        </Dialog>
      )
    }
  }

  const renderReservations = (props: Array<string | number>) => {
    if (props.length != 0) {
      return props.map((r: any) => (
        <List.Item key={r.id} right={() => <Button onPress={() => detailsOnPress(r.id)}>Details</Button>} title={moment(r.startTime).format('Do MMM YYYY, h:mm a')} description={`Venue: ${r.restaurant}\nState: ${r.status}`} />
      ));
    } else {
      return <List.Item title="No Reservations" />;
    }
  }

  const requestOnPress = (button: string) => {
    const details = {
      duration: duration, email: email, guests: guests, id: id, notes: notes, phone: phone, requestType: button=="update"?"update":"cancel", startTime: startTime,
    }
    const update = requestUpdate(details);
    navigation.replace("Member");
  }

  return (
    <View style={styles.container}>
      <Button mode='contained' onPress={() => navigation.replace("Home")}>Book Now!</Button>
      <ScrollView>
        <List.Accordion title="Upcoming Reservations" expanded={expanded} onPress={() => setExpanded(!expanded)}>
          { loading ? <ActivityIndicator /> : renderReservations(nextReservations) }
        </List.Accordion>
        <List.Accordion title="Past Reservations">
          { loading ? <ActivityIndicator /> : renderReservations(pastReservations) }
        </List.Accordion>
      </ScrollView>
      { renderReservation(details) }
    </View>
  )
}

const styles = StyleSheet.create({
  btnContainer: {
    alignItems: 'stretch',
  },
  changeDateTimeBtnContainer: {
    flexDirection: 'row',
  },
  container: {
    flex: 1,
  },
})

