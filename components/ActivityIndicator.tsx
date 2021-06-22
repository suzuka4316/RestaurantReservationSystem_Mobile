import React from 'react';
import { ActivityIndicator as PaperActivityIndicator, Colors } from 'react-native-paper';

export function ActivityIndicator() {
    return (
        <PaperActivityIndicator animating={true} color={Colors.blue300} /> 
    )
}