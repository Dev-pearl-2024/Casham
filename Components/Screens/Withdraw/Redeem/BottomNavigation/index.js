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
  TextInput
} from "react-native";
import { baseURL } from "../../../../API/baseURL";

const BottomModal = ({ visiable, navigation, setIsModalVisible }) => {
  const slideAnim = useRef(
    new Animated.Value(Dimensions.get("window").height)
  ).current;
  const [inputValue, setInputValue] = useState("");

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
    try {
      console.log(data);
      const formData = new FormData();
      formData.append("voucher ", inputValue);
      const token = await AsyncStorage.getItem("api_token");
      const rs = await axios.post(baseURL + "voucher", {
        params: { voucherId: inputValue },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      console.log(rs);

      if (rs.status === 200) {
        navigation.navigate("WithdrawData");
      }
    } catch (error) {
      console.error(
        "Error decoding QR:",
        error?.response?.data || error.message
      );
    } finally {
      setIsScanned(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <Text style={styles.title}>Enter Code</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Voucher code here..."
            value={inputValue}
            onChangeText={setInputValue}
          />
          <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
            <Text style={styles.verifyButtonText}>Verify</Text>
          </TouchableOpacity>
        </Animated.View>
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
    height: "50%",
    backgroundColor: "rgb(231, 231, 231)",
    borderTopEndRadius: 30,
    borderTopLeftRadius: 30,
    padding: 20,
    alignItems: "center"
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
