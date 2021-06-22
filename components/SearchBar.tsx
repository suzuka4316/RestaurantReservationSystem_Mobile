import React from "react";
import { Searchbar as PaperSearchbar } from "react-native-paper";
import { StyleSheet } from "react-native";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";

type SearchBarProps = {
  placeholder?: string;
  onChange?: (text: string) => void;
  onPress?: () => void;
  value: string;
  icon: IconSource;
};

export const SearchBar = ({
  placeholder = "Search",
  onChange,
  onPress,
  icon,
  value,
}: SearchBarProps) => {
  return (
    <PaperSearchbar
      style={styles.container}
      theme={{ roundness: 5 }}
      placeholder={placeholder}
      onChangeText={onChange}
      onIconPress={onPress}
      value={value}
      icon={icon}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 3,
  },
});
