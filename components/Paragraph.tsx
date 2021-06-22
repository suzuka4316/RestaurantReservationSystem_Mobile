import React, { ReactNode } from 'react';
import { Paragraph as PaperParagraph } from 'react-native-paper';

type ParagraphProps = {
    children: ReactNode
}

export function Paragraph({ children }: ParagraphProps) {
    return (
        <PaperParagraph>{children}</PaperParagraph>
    )
}