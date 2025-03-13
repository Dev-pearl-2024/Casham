import React, { useState } from "react";
import {
  Button,
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Picker } from "react-native-ui-lib";
import { BackButton } from "../../../Elements/UIElements/BackButton";
import CustomHeader from "../../../Elements/UIElements/CustomHeader";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const responsiveFontSize = (fontSize) => (fontSize * SCREEN_WIDTH) / 375;

const Purchase_Vouchar = (props) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [selectedDays, setSelectedDays] = useState("");

  const Colors = {
    primary: "#007AFF",
    text: "#000000"
  };

  const [amount, setAmount] = useState(0);

  const createVoucher = async () => {
    if (amount) {
      props.navigation.navigate("Pin", {
        mode: "VoucherVerify",
        amount: amount,
        expiryDays: selectedDays
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 20,
          backgroundColor: "white",
          shadowColor: "blue",
          shadowOpacity: 0.5,
          shadowOffset: { width: 0, height: 5 },
          shadowRadius: 5,
          elevation: 5,
          padding: 10
        }}
      >
        <BackButton props={props} />
        <Image
          source={require("../../../Elements/Images/standalonelogo.png")}
          style={{ width: 30, height: 30, marginLeft: 10 }}
        />
        <Text
          style={{
            fontSize: responsiveFontSize(22),
            fontWeight: "bold",
            color: Colors.primary,
            marginLeft: 10
          }}
        >
          Create Voucher
        </Text>
      </View> */}

      <CustomHeader props={props} header_name={Platform.OS === 'android' ? "Create Voucher" : ""} />

      <View
        style={{
          marginVertical: Platform.OS === "android" ? 100 : 40,
          marginHorizontal: 20
        }}
      >
        <Text
          style={{
            marginBottom: 20,
            color: Colors.primary,
            fontWeight: "bold"
          }}
        >
          Enter Voucher Amount
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize:
                amount.length <= 7
                  ? Dimensions.get("window").width / 8
                  : amount.length <= 9
                    ? Dimensions.get("window").width / 9
                    : amount.length == 10
                      ? Dimensions.get("window").width / 11
                      : 70,

              color: Colors.primary
            }}
          >
            LE
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
        <View style={{ paddingVertical: 20 }}>
          {/* Expiry Date Text */}

          {/* Yes / No Buttons */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                // marginBottom: 10,
                color: Colors.primary
              }}
            >
              Expirable
            </Text>
            <Switch
              value={isEnabled}
              onValueChange={(value) => {
                setIsEnabled(value);
                if (!value) {
                  setSelectedDays("");
                }
              }}
              trackColor={{ false: "#767577", true: "#4CAF50" }}
              thumbColor={isEnabled ? "#ffffff" : "#f4f3f4"}
            />
          </View>

          {/* Dropdown (Only Visible if Yes is Clicked) */}
          {isEnabled && (
            <View
              style={{
                marginTop: 15,
                borderWidth: 2,
                borderRadius: 5,
                borderColor: Colors.primary,
                width: Dimensions.get("window").width / 2.7
              }}
            >
              <Picker
                selectedValue={selectedDays}
                onChange={(itemValue) => setSelectedDays(itemValue)}
                placeholder="Expires In"
                renderPicker={() => (
                  <Text
                    style={{
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      color: Colors.primary
                    }}
                  >
                    {selectedDays ? `${selectedDays} Days` : "Expires In"}
                  </Text>
                )}
                dialogProps={{
                  height: Dimensions.get("window").height / 2,
                  style: { backgroundColor: "red" }
                }}
                itemStyle={{
                  backgroundColor: "red",
                  color: "white",
                  fontSize: 16
                }}
              >
                <Picker.Item label="7 Days" value="7" />
                <Picker.Item label="14 Days" value="14" />
                <Picker.Item label="30 Days" value="30" />
              </Picker>
            </View>
          )}
        </View>
      </View>
      <View
        style={{
          position: "absolute",
<<<<<<< HEAD
          bottom: 80,
=======
          bottom: Platform.OS === 'android' ? 20 : 80,
>>>>>>> 8a96a75fe5130df1cef87425e3ee053eb0b1a176
          left: 0,
          width: "100%",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: amount ? Colors.primary : "gray",
            paddingHorizontal: 40,
            paddingVertical: 15,
            borderRadius: 10
          }}
          activeOpacity={0.5}
          onPress={createVoucher}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
            Create Voucher
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Purchase_Vouchar;
