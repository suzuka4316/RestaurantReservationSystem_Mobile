import React from "react";
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInputFocusEventData,
} from "react-native";
import { TextInput as PaperTextInput } from "react-native-paper";

type TextInputProps = {
  mode?: "flat" | "outlined" | undefined;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  multiline?: boolean;
  value?: string;
  editable?: boolean;
  onChangeText?: (((text: string) => void) & Function) | undefined;
  onBlur?:
    | (((e: NativeSyntheticEvent<TextInputFocusEventData>) => void) &
        ((args: any) => void))
    | undefined;
  secureTextEntry?: boolean;
};

export function TextInput({
  mode = "flat",
  disabled = false,
  ...props
}: TextInputProps) {
  return (
    <PaperTextInput
      theme={{ roundness: 5 }}
      style={styles.input}
      mode={mode}
      disabled={disabled}
      {...props}
    ></PaperTextInput>
  );
}

const styles = StyleSheet.create({
  input: {
    width: 300,
    margin: 5,
    maxHeight: 60,
  },
});
