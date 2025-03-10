import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  TextInput,
  Alert,
  Keyboard
} from "react-native";
import { baseURL } from "../../../../API/baseURL";
import { Loader } from "../../../../Elements/UIElements/Loader";

const BottomModal = ({ visiable, navigation, setIsModalVisible, props }) => {
  const [verified, setVerified] = useState(false);
  const [voucherStatus, setVoucherStatus] = useState(false);

  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const [isFocused, setIsFocused] = useState(false);

  const slideAnim = useRef(
    new Animated.Value(Dimensions.get("window").height)
  ).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visiable ? 0 : Dimensions.get("window").height,
      duration: 500,
      useNativeDriver: true
    }).start();
  }, [visiable]);

  if (!visiable) return null;

  const handleVerify = async () => {
    console.log("Entered Code:", inputValue);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("voucher ", inputValue);
      const token = await AsyncStorage.getItem("api_token");
      const rs = await axios.get(baseURL + "voucher", {
        params: { voucherId: inputValue },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      console.log("vouchercode", rs?.data);

      if (rs.status === 200) {
        // navigation.navigate("WithdrawData");
        setLoading(false);
        if (rs?.data?.status === "USED") {
          Alert.alert("Oops", "This voucher have already been used.", [
            {
              text: "OK",
              onPress: () =>
                props.navigation.navigate("Voucher_successfull_failed", {
                  success: false
                })
            }
          ]);
        } else if (rs?.data === null) {
          Alert.alert("Oops", "Please write a correct voucher code.");
        } else {
          setVoucherStatus(rs?.data);
          setVerified(true);
        }
      }
    } catch (error) {
      console.log(error.status);
      if (error.status === 400) {
        Alert.alert("Oops", "This voucher have already been used", [
          {
            text: "OK",
            onPress: () =>
              props.navigation.navigate("Voucher_successfull_failed", {
                success: false
              })
          }
        ]);
      } else if (error.status >= 500) {
        Alert.alert(
          "Network Error",
          "Something went wrong. Please try again later.",
          [
            {
              text: "OK",
              onPress: () =>
                navigation.navigate("Voucher_successfull_failed", {
                  success: false
                })
            }
          ]
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemVoucher = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("voucherCode", inputValue);
      const token = await AsyncStorage.getItem("api_token");
      const rs = await axios.post(baseURL + "voucher/redeem", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      if (rs.status === 200) {
        setLoading(false);
        props.navigation.navigate("Voucher_successfull_failed", {
          data: rs.data,
          success: true
        });
        setInputValue("");
        setVerified(false);
      }
    } catch (error) {
      console.log(error.status);
      setInputValue("");
      setVerified(false);
      if (error.status === 400) {
        Alert.alert("Oops", "This voucher have already been used", [
          {
            text: "OK",
            onPress: () =>
              props.navigation.navigate("Voucher_successfull_failed", {
                success: false
              })
          }
        ]);
      } else if (error.status >= 500) {
        Alert.alert(
          "Network Error",
          "Something went wrong. Please try again later.",
          [
            {
              text: "OK",
              onPress: () =>
                navigation.navigate("Voucher_successfull_failed", {
                  success: false
                })
            }
          ]
        );
      }
      // console.error(
      //   "Error decoding QR:",
      //   error?.response?.data || error.message
      // );
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={(e) => {
        e.target === e.currentTarget && setIsModalVisible(false);
        Keyboard.dismiss();
        setIsFocused(false);
      }}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: slideAnim }],
              height: isFocused ? "70%" : "50%"
            }
          ]}
        >
          <Text style={styles.title}>Enter Code</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Voucher code here..."
            value={inputValue}
            onChangeText={setInputValue}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {verified ? (
            <TouchableOpacity
              style={styles.verifyButton}
              onPress={handleRedeemVoucher}
            >
              <Text style={styles.verifyButtonText}>Redeem now</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.verifyButton}
              onPress={handleVerify}
            >
              <Text style={styles.verifyButtonText}>Verify</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
        <Loader visible={loading} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    justifyContent: "flex-end"
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "rgb(255, 255, 255)",
    borderTopEndRadius: 30,
    borderTopLeftRadius: 30,
    padding: 20,
    alignItems: "center",
    zIndex: 20
  },
  title: {
    fontWeight: "700",
    fontSize: 18,
    color: "rgb(87, 86, 86)",
    marginBottom: 15
  },
  input: {
    width: "90%",
    height: 45,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    fontSize: 16,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    marginTop: 10
  },
  verifyButton: {
    position: "absolute",
    bottom: 10,
    backgroundColor: "#007AFF",
    width: "90%",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center"
  },
  verifyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600"
  }
});

export default BottomModal;
