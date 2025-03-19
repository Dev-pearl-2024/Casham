import React from "react";
import { Dimensions, Image, Platform, Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { BackButton } from "../BackButton";
import { MaterialIcons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const responsiveFontSize = (fontSize) => (fontSize * SCREEN_WIDTH) / 375;

const CustomHeader = ({ props, header_name }) => {
  const Colors = {
    primary: "#007AFF",
    text: "#000000"
  };
  return ( 
    <View
      style={{  
        flexDirection: "row",
        alignItems: "center",
        //          paddingVertical: 20,
        backgroundColor: "white",
        shadowColor: "blue",
        shadowOpacity: 0.5,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 5,
        elevation: 5,
        padding: 20,
        position: "absolute",
        top: 0,
        right: 0,
        left: 0,
        zIndex:Platform.OS === 'android' ? 20 : 0
      }}
    >
      <TouchableOpacity
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center"
        }}
        onPress={() => {
          props.navigation.goBack();
        }}
        hitSlop={40}
      >
        <MaterialIcons name="arrow-back-ios-new" size={22} color={"gray"} />
      </TouchableOpacity>
      <Image
        source={require("../../Images/standalonelogo.png")}
        style={{ width: 25, height: 25, marginLeft: 10 }}
      />

      <Text
        style={{
          fontSize: responsiveFontSize(18),
          fontWeight: "bold",
          color: Colors.primary,
          marginLeft: 10,
          position: Platform.OS === "android" ? "" : "absolute",
          right: Platform.OS === "android" ? 0 : 30
        }}
      >
        {header_name}
      </Text>
    </View>
  );
};

export default CustomHeader;
