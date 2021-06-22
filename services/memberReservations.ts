import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export async function getAllReservations() {
  const config = {
    headers: { Authorization: await AsyncStorage.getItem("authToken")}
  };
  return await axios.get('https://placeholder-reservations.azurewebsites.net/api/member/reservations', config)
    .then(response => {
      return response.data;
    }).catch(error => {
      console.error(error);
    });
}

export async function getReservationById(id: number) {
  const config = {
    headers: { Authorization: await AsyncStorage.getItem("authToken")}
  };
  return await axios.get(`https://placeholder-reservations.azurewebsites.net/api/member/reservations/${id}`, config)
    .then(response => {
      return response.data;
    }).catch(error => {
      console.error(error);
    });
}

export async function requestUpdate(details: any) {
  const config = {
    headers: { Authorization: await AsyncStorage.getItem("authToken")}
  };
  const data = {
    Request: {
      duration: details.duration,
      email: details.email,
      guests: details.guests,
      id: details.id,
      notes: details.notes,
      phone: details.phone,
      startTime: details.startTime,
    },
    requestType: details.requestType
  };
  return await axios.patch(`https://placeholder-reservations.azurewebsites.net/api/member/reservations/${details.id}`, data, config)
    .then(response => {
      return response.data;
    }).catch(error => {
      console.error(error);
    });
}