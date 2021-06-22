import React, { ReactNode } from 'react';
import { Title as PaperTitle } from 'react-native-paper';

type TitleProps = {
    children: ReactNode
}

export function Title({ children }: TitleProps) {
    return (
        <PaperTitle>{children}</PaperTitle>
    )
}