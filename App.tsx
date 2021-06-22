import React from "react";
import Navigation from "./navigation";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#c72a70",
    accent: "#f1c40f",
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <Navigation />
    </PaperProvider>
  );
}
