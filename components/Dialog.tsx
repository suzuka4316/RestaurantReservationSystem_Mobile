import React, { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { Dialog as PaperDialog } from 'react-native-paper'

type dialogProps = {
  visible: boolean,
  onDismiss?(): void,
  title?: string,
  children?: ReactNode | ReactNode[]
}

export function Dialog(props: dialogProps) {
  const { children, visible, onDismiss, title } = props;
  return (
    <PaperDialog visible={visible} onDismiss={onDismiss}>
      <PaperDialog.Title>{title}</PaperDialog.Title>
      <PaperDialog.Content style={styles.contentContainer}>
        {children}
      </PaperDialog.Content>
    </PaperDialog>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
  },
})
