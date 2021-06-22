import React, { useState } from "react";
import { View, Platform } from "react-native";
import DateTimePickerCommunity from "@react-native-community/datetimepicker";
import { SearchBar } from "./SearchBar";
import moment from "moment";

type DateTimePickerProps = {
  mode: "date" | "time";
  initialValue: Date;
  setValue: Function;
};

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  mode,
  initialValue,
  setValue,
}) => {
  const [show, setShow] = useState(false);

  const onChange = (event: any, selectedValue: any) => {
    const currentDate = selectedValue || initialValue;
    setShow(Platform.OS === "ios");
    setValue(currentDate);
  };

  const icon = mode == "date" ? "calendar-range" : "clock-time-five-outline";
  const value =
    mode == "date"
      ? moment(initialValue.toString()).format("Do MMM YYYY")
      : moment(initialValue.toString()).format("h:mm A");

  return (
    <View>
      <View>
        <SearchBar
          placeholder={`Select ${mode}`}
          icon={icon}
          onPress={() => setShow(true)}
          value={value}
        />
      </View>
      {show && (
        <DateTimePickerCommunity
          testID="dateTimePicker"
          value={initialValue}
          mode={mode as any}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};
