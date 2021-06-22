import React from "react";
import { StyleSheet } from "react-native";
import {
  Card as PaperCard,
  Paragraph,
  Title,
  Button,
} from "react-native-paper";

type CardProps = {
  title: string;
  contentTitle: string;
  paragraph: string;
  uri: string;
  onPress?: () => void;
  btnTitle?: string;
  includeBtn?: boolean;
};

export function Card(props: CardProps) {
  const {
    title,
    contentTitle,
    paragraph,
    uri,
    onPress,
    btnTitle,
    includeBtn = true,
  } = props;
  return (
    <PaperCard
      theme={{ roundness: 5 }}
      style={styles.container}
      mode="outlined"
      onPress={onPress}
    >
      <PaperCard.Cover source={{ uri: uri }} />
      <PaperCard.Title title={title} />
      <PaperCard.Content>
        <Title>{contentTitle}</Title>
        <Paragraph>{paragraph}</Paragraph>
      </PaperCard.Content>
      <PaperCard.Actions>
        {includeBtn && (
          <Button theme={{ roundness: 5 }} mode="contained" onPress={onPress}>
            {btnTitle}
          </Button>
        )}
      </PaperCard.Actions>
    </PaperCard>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
});
