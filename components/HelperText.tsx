import React, { ReactNode } from "react";
import { HelperText as PaperHelperText } from "react-native-paper";

type HelperTextProps = {
  children: ReactNode;
  visible?: boolean;
  type?: "error" | "info";
  style?: any;
};

export function HelperText({
  children,
  visible = true,
  type = "info",
  style,
}: HelperTextProps) {
  return (
    <PaperHelperText style={style} visible={visible} type={type}>
      {children}
    </PaperHelperText>
  );
}
