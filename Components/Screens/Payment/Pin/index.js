import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColors } from "../../../Elements/Themes/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { baseURL, baseURLTransferAmount } from "../../../API/baseURL";
import { getLastKnownPositionAsync } from "expo-location";
import { Loader } from "../../../Elements/UIElements/Loader";

const Pin = (props) => {
  const colors = useColors();
  const [mode, setMode] = useState("Verify Pin");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (props.route.params) {
      if (props.route.params.mode === "create") {
        setMode("Create Transaction Pin");
      } else if (props.route.params.mode === "update") {
        setMode("Update Transaction Pin");
      } else {
        setMode("Verify Transaction Pin");
      }
    }
  }, []);

  const handleKeyPress = async (value) => {
    if (value === "backspace") {
      setPin((prev) => prev.slice(0, -1));
    } else if (pin.length < 4 && value !== "done") {
      setPin((prev) => prev + value);
    } else if (value === "done") {
      if (pin.length === 4) {
        if (props.route.params.mode == "create") {
          const formData = new FormData();
          const token = await AsyncStorage.getItem("api_token");
          formData.append("paymentPin", pin);
          await axios
            .post(baseURL + "Pin", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`
              }
            })
            .then(async (rs) => {
              if (rs.data.status == 200) {
                await AsyncStorage.setItem("pin", pin);
                alert("Pin creation successful");
                props.navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: "Dashboard"
                    }
                  ]
                });
              } else {
                alert("Error creating pin, Try again!");
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else if (props.route.params.mode === "update") {
          const formData = new FormData();
          const token = await AsyncStorage.getItem("api_token");
          setLoading(true);
          formData.append("paymentPin", pin);
          await axios
            .post(baseURL + "Pin", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`
              }
            })
            .then(async (rs) => {
              if (rs.data.status == 200) {
                setLoading(false);
                console.log("pin Data", rs.data);

                await AsyncStorage.setItem("pin", pin);
                alert("Pin update successful");
                props.navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: "Dashboard",
                      params: { page: "Settings" }
                    }
                  ]
                });
              } else {
                alert("Error updating pin, Try again!");
              }
            })
            .catch((err) => {
              console.log(err);
              setLoading(false);
            });
        } else {
          if (props.route.params.mode === "VoucherVerify") {
            setLoading(true);
            const token = await AsyncStorage.getItem("api_token");
            const formData = new FormData();
            formData.append("amount", props.route.params.amount);
            formData.append("expiryDays", props.route.params.expiryDays);
            formData.append("pin", pin.toString());
            try {
              const rs = await axios.post(
                baseURL + "/voucher/create",
                formData,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                  }
                }
              );
              if (rs.status === 200) {
                props.navigation.navigate("Voucher_successfull_failed", {
                  data: rs.data,
                  success: true,
                  title: "Create"
                });
                setLoading(false);
              }
              console.log("voucher verify", rs.status);
            } catch (error) {
              console.log(error.response.data);
              setLoading(false);
              if (error.status === 400) {
              if(error.response.data === 'Pin wrong'){
               Alert.alert("Oops Wrong Pin", "Please Enter a correct Pin", [
                                {
                                  text: "OK",
              //                    onPress: () =>
              //                      props.navigation.navigate("Voucher_successfull_failed", {
              //                        success: false,
              //                        title: "Create"
              //                      })
                                }
                              ]);
              }else{
               Alert.alert("Oops Wrong Pin", "Please Enter a correct Pin", [
                                {
                                  text: "OK",
                                  onPress: () =>
                                    props.navigation.navigate("Voucher_successfull_failed", {
                                      success: false,
                                      title: "Create"
                                    })
                                }
                              ]);
              }

              } else if (error.status >= 500) {
                Alert.alert(
                  "Network Error",
                  "Something went wrong. Please try again later.",
                  [
                    {
                      text: "OK",
                      onPress: () =>
                        navigation.navigate("Voucher_successfull_failed", {
                          success: false,
                          title: "Create"
                        })
                    }
                  ]
                );
              }
            }
          } else {
            setLoading(true);
            const AccountNo = props.route.params.acc_id;
            const AccountType = props.route.params.account_type;
            const AccountBranch = props.route.params.bank_branch;
            const amount = props.route.params.amount;
            const currency = "GHS";
            var longitude = "";
            var latitude = "";
            getLastKnownPositionAsync().then((rs) => {
              longitude = rs.coords.longitude;
              latitude = rs.coords.latitude;
            });
            const token = await AsyncStorage.getItem("api_token");
            console.log(token);
            try {
              const rs = await axios.post(
                baseURL + "payments",
                {
                  AccountNo: AccountNo,
                  AccountBranch: AccountBranch,
                  AccountType: AccountType,
                  amount: amount,
                  currency: currency,
                  longitude: longitude,
                  latitude: latitude,
                  paymentPin: pin.toString()
                },
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                  }
                }
              );
              // .then((rs) => {
              setLoading(false);
              let responseData = rs.data;

              console.log("Transaction Data:", responseData);

              props.navigation.navigate("CompleteTransaction", {
                success: true,
                amount: props.route.params.amount,
                pinWrong: false,
                transaction_id: responseData?.transaction_details
              });
              // })
            } catch (err) {
              // .catch((err) => {
              setLoading(false);

              // Log the full error response to understand its structure
              console.log("Full Error Response:", err.response?.data);

              // Extract the actual error message
              const errorMessage = err.response?.data || "Something went wrong";

              // Show the error message in an alert
              alert(errorMessage);

              // Navigate to CompleteTransaction with error info
              props.navigation.navigate("CompleteTransaction", {
                success: false,
                amount: props.route.params.amount,
                pinWrong: true
              });
              // if (pinValue == pin) {
              //     props.navigation.navigate('CompleteTransaction', {
              //         success: true, amount: props.route.params.amount,
              //         pinWrong: false
              //     })
              //     console.log("correct pin");

              // } else {
              //     props.navigation.navigate('CompleteTransaction', {
              //         success: false, amount: props.route.params.amount,
              //         pinWrong: true
              //     })
              // }
            }
          }
        }
      } else {
        alert("Please enter a 4-digit PIN before proceeding.");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../../Elements/Images/logo.png")}
        style={styles.logo}
      />
      <Text style={[styles.title, { color: colors.primary }]}>{mode}</Text>
      <Text style={styles.subtitle}>
        Linked to {"your registered phone number."}
      </Text>
      <View style={styles.pinContainer}>
        {Array(4)
          .fill("")
          .map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                pin.length > index && styles.filledDot,
                { borderColor: colors.primary }
              ]}
            />
          ))}
      </View>
      <View style={styles.keyboard}>
        {[
          ["1", "2", "3"],
          ["4", "5", "6"],
          ["7", "8", "9"],
          ["backspace", "0", "done"]
        ].map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((key) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.key,
                  key === "done" && { backgroundColor: colors.primary }
                ]}
                onPress={() => handleKeyPress(key)}
              >
                <Text
                  style={[styles.keyText, key === "done" && { color: "#fff" }]}
                >
                  {key === "backspace" ? "⌫" : key === "done" ? "✓" : key}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
      <Loader visible={loading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff"
  },
  logo: {
    width: 100,
    height: 33.54,
    marginBottom: 20,
    marginTop: 50
  },
  title: {
    fontSize: Dimensions.get("window").width / 20,
    fontWeight: "bold",
    marginBottom: 10
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30
  },
  pinContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    alignSelf: "center",
    marginBottom: 40
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: "transparent"
  },
  filledDot: {
    backgroundColor: "#000"
  },
  keyboard: {
    width: "100%",
    // marginTop: 20,
    paddingBottom: 0,
    alignSelf: "center",
    position: "absolute",
    bottom: 0
    // left: 0
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20
  },
  key: {
    width: Dimensions.get("window").width / 3.5,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.6,
    borderColor: "lightgray",
    borderRadius: 5
  },
  keyText: {
    fontSize: 20,
    fontWeight: "bold"
  }
});

export default Pin;
