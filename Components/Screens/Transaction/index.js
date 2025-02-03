import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from "react-native";
import stylesheet from "../../Elements/Styles";
import { BackButton } from "../../Elements/UIElements/BackButton";
import { TextInput, View } from "react-native";
import { Text } from "react-native-paper";
import { useColors } from "../../Elements/Themes/Colors";
import CustomButton from "../../Elements/UIElements/Button";
import { Ionicons } from "@expo/vector-icons";

const Transaction = (props) => {
  const Colors = useColors();
  const [amount, setAmount] = useState("");

  console.log(props.route.params.data.Username);

  const [username, setUsername] = useState("");
  const [acc_id, setAcc_Id] = useState("");
  const [account_type, setAccount_Type] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (props.route.params) {
      console.log(props.route.params);

      setUsername(props.route.params.data.username);
      setAcc_Id(props.route.params.data.acc_id);
      setAccount_Type(props.route.params.data.account_type);
      setPhone(
        props.route.params.data.phone_number
          ? props.route.params.data.phone_number
          : props.route.params.number
      );
    }
  }, []);

  const handlePin = (amount) => {
    props.navigation.navigate("Pin", {
      mode: "verify",
      amount: amount,
      acc_id: props.route.params.data.acc_id
        ? props.route.params.data.acc_id
        : props.route.params.data.AccountNumber,
      account_type: props.route.params.data.account_type
        ? props.route.params.data.account_type
        : props.route.params.data.AccountType,
      username: props.route.params.data.username
        ? props.route.params.data.username
        : props.route.params.data.Username,
      phone: props.route.params.data.phone_number
        ? props.route.params.data.phone_number
        : phone,
      bank_branch: props.route.params.data.bank_branch
        ? props.route.params.data.bank_branch
        : props.route.params.data.AccountBranch
    });
  };

  return (
    <SafeAreaView style={stylesheet.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} // Adjust as needed
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ position: "absolute", top: 30, left: 25 }}>
            <BackButton props={props} />
          </View>
          <View
            style={{
              alignSelf: "flex-start",
              marginStart: 25,
              marginTop: 100,
              flex: 1,
              justifyContent: "space-between"
            }}
          >
            <View>
              <Text style={{ fontSize: 22 }}>
                To:
                <Text style={{ fontWeight: "bold" }}>
                  {" "}
                  {props.route.params
                    ? props.route.params.data.username
                      ? props.route.params.data.username
                      : props.route.params.data.Username
                    : "UserName"}
                </Text>
              </Text>
              <Text>USER ID: {phone ? phone : "---------"}@casham</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  marginTop: 20
                }}
              >
                <Text
                  style={{
                    fontSize: 30,
                    marginTop: 15
                  }}
                >
                  Le{" "}
                </Text>
                <TextInput
                  placeholder="0"
                  style={{
                    fontWeight: "bold",
                    fontSize:
                      amount.length <= 7
                        ? Dimensions.get("window").width / 5
                        : amount.length <= 9
                        ? Dimensions.get("window").width / 6
                        : amount.length == 10
                        ? Dimensions.get("window").width / 7
                        : 70,
                    textDecorationLine: amount ? "underline" : "none",
                    color: Colors.primary
                  }}
                  maxLength={10}
                  cursorColor={Colors.primary}
                  value={amount}
                  onChangeText={(tx) => {
                    setAmount(tx.trim());
                  }}
                  keyboardType="numeric"
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: 150,
                  borderWidth: 0.5,
                  borderColor: "lightgray",
                  borderRadius: 5,
                  paddingVertical: 5,
                  marginTop: 10,
                  marginBottom: 50
                }}
              >
                <TextInput
                  placeholder="Add a note"
                  style={{
                    flex: 1,
                    paddingStart: 10
                  }}
                  multiline
                  cursorColor={Colors.primary}
                />
                <Ionicons
                  name="add-circle-outline"
                  size={20}
                  style={{ marginHorizontal: 10 }}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        <View
          style={{
            marginBottom: 50,
            marginStart: 25,
            marginEnd: 25
          }}
        >
          <CustomButton
            disabled={!amount}
            label={amount ? `Pay Le ${amount}` : `Pay Le 0`}
            onPress={() => {
              handlePin(amount);
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Transaction;
