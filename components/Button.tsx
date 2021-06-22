import React, { ReactNode } from "react";
import { Button as PaperButton } from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import { StyleSheet } from "react-native";

type ButtonProps = {
  mode?: "text" | "outlined" | "contained";
  dark?: boolean;
  loading?: boolean;
  icon?: IconSource;
  disabled?: boolean;
  children: ReactNode;
  onPress: () => void;
};

export function Button({
  mode = "text",
  dark = false,
  loading = false,
  icon,
  disabled = false,
  children,
  onPress,
}: ButtonProps) {
  return (
    <PaperButton style ={styles.container}
      theme={{ roundness: 5 }}
      mode={mode}
      dark={dark}
      loading={loading}
      icon={icon}
      disabled={disabled}
      onPress={onPress}
    >
      {children}
    </PaperButton>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 1,
  },
});
