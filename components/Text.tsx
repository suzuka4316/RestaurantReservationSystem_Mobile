import React, { ReactNode } from 'react';
import { Text as PaperText } from 'react-native-paper';

type TextProps = {
    children: ReactNode
}

export function Text({ children }: TextProps) {
    return (
        <PaperText>{children}</PaperText>
    )
}