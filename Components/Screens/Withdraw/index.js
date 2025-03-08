import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  Text,
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  StatusBar
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TouchableScale from "@jonny/touchable-scale";
import { baseURL } from "../../API/baseURL";
import { AntDesign } from "@expo/vector-icons";
import { compareDates } from "../../Custom/dateCheck";
import { FAB, Portal, Provider } from "react-native-paper";
import Modal from "react-native-modal";
import QRCode from "react-native-qrcode-svg";
import { useFocusEffect } from "@react-navigation/native";

// Get the device width
const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Function to scale font size based on screen width
const responsiveFontSize = (fontSize) => (fontSize * SCREEN_WIDTH) / 375;

const Withdraw_Data = (props) => {
  const [open, setOpen] = useState(false);

  const [myVoucher, setMyVoucher] = useState(null);
  const [history, setHistory] = useState(null);

  const [IsVisiable, setIsVIsiable] = useState(false);
  const [dataVisiable, setDataVIsiable] = useState(null);

  const [voucher, setVoucher] = useState(true);
  useEffect(() => {
    StatusBar.setHidden(true);
  }, []);
  const Colors = {
    primary: "#007AFF",
    text: "#000000"
  };

  const fetchAllVoucher = async () => {
    const device_token = await AsyncStorage.getItem("device_token");
    const api_token = await AsyncStorage.getItem("api_token");
    try {
      const rs = await axios.get(`${baseURL}voucher/all`, {
        params: { token: device_token },
        headers: { Authorization: `Bearer ${api_token}` }
      });

      if (rs.status === 200) {
        console.log("My voucher details", rs.data);
        setMyVoucher(rs.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchVoucherHistory = async () => {
    const device_token = await AsyncStorage.getItem("device_token");
    const api_token = await AsyncStorage.getItem("api_token");

    try {
      const response = await axios.get(`${baseURL}voucher/history`, {
        params: { token: device_token },
        headers: { Authorization: `Bearer ${api_token}` }
      });

      if (response.status === 200) {
        console.log("History voucher details", response.data);
        let sortedData = response.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setHistory(sortedData);
      }
    } catch (error) {
      console.log("Fetch Error:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchVoucherHistory();
      fetchAllVoucher();
    }, [])
  );

  const renderReceivedData = () => {
    return voucher ? (
      myVoucher?.length > 0 ? (
        myVoucher?.map((item, index) => (
          <TouchableScale
            key={index}
            style={{
              width: "90%",
              // height: 70,
              borderRadius: 10,
              backgroundColor: "#eee",
              marginTop: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "spa",
              paddingHorizontal: 20,
              paddingVertical: 5,
              gap: 20
            }}
            onPress={() => {
              setIsVIsiable(true);
              setDataVIsiable(item);
            }}
          >
            {/* <Image
        style={{ width: 50, height: 50 }}
        source={{
          uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnybLZQkb8BG9uN4bX31TBXP51qPlA3gD00g&s"
        }}
        resizeMode="contain"
      /> */}
            <QRCode
              value={item?.voucher}
              size={Dimensions.get("window").width / 4.5}
            />
            <View
              style={{ marginVertical: 10, backgroundColor: "transparent" }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                SLE :{" "}
                <Text style={{ fontWeight: "600", fontSize: 14 }}>
                  {item?.amount}
                </Text>
              </Text>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                Expire :{" "}
                <Text style={{ fontWeight: "600", fontSize: 14 }}>
                  {item?.expiresAt}
                </Text>
              </Text>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                Status :{" "}
                <Text style={{ fontWeight: "600", fontSize: 14 }}>
                  {item?.status}
                </Text>
              </Text>
            </View>
          </TouchableScale>
        ))
      ) : (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text>No data found</Text>
        </View>
      )
    ) : history?.length > 0 ? (
      history?.map((item, index) => (
        <TouchableScale
          key={index}
          style={{
            width: "90%",
            // height: 70,
            borderRadius: 10,
            backgroundColor: "#eee",
            marginTop: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "spa",
            paddingHorizontal: 20,
            paddingVertical: 5,
            gap: 20
          }}
          onPress={() => {
            setIsVIsiable(true);
            setDataVIsiable(item);
          }}
        >
          {/* <Image
          style={{ width: 50, height: 50 }}
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnybLZQkb8BG9uN4bX31TBXP51qPlA3gD00g&s"
          }}
          resizeMode="contain"
        /> */}
          <QRCode
            value={item?.voucher}
            size={Dimensions.get("window").width / 4.5}
          />
          <View style={{ marginVertical: 10, backgroundColor: "transparent" }}>
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              SLE :{" "}
              <Text style={{ fontWeight: "600", fontSize: 14 }}>
                {item?.amount}
              </Text>
            </Text>
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              Expire :{" "}
              <Text style={{ fontWeight: "600", fontSize: 14 }}>
                {item?.expiresAt}
              </Text>
            </Text>
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              Status :{" "}
              <Text style={{ fontWeight: "600", fontSize: 14 }}>
                {item?.status}
              </Text>
            </Text>
          </View>
        </TouchableScale>
      ))
    ) : (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>No data found</Text>
      </View>
    );
  };
  return (
    <Provider>
      <SafeAreaView style={{ flex: 1 }}>
        <View
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
          <Image
            source={require("../../Elements/Images/standalonelogo.png")}
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              fontSize: responsiveFontSize(22),
              fontWeight: "bold",
              color: Colors.primary,
              marginLeft: 10
            }}
          >
            Withdraw
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
            marginHorizontal: 10,
            marginVertical: 20
          }}
        >
          <TouchableOpacity
            style={[
              style.voucherButton,
              { backgroundColor: voucher ? "#007AFF" : "transparent" }
            ]}
            onPress={() => setVoucher(true)}
          >
            <Text
              style={[
                style.voucherText,
                { color: voucher ? "white" : "#007AFF" }
              ]}
            >
              My Voucher
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              style.voucherButton,
              { backgroundColor: !voucher ? "#007AFF" : "transparent" }
            ]}
            onPress={() => setVoucher(false)}
          >
            <Text
              style={[
                style.voucherText,
                { color: !voucher ? "white" : "#007AFF" }
              ]}
            >
              History
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
        >
          {renderReceivedData()}
        </ScrollView>

        {/* Floating Action Button */}
        <Portal>
          <FAB.Group
            open={open}
            visible
            icon={open ? "close" : "plus"}
            color="white"
            style={{
              position: "absolute",
              bottom: 0,
              right: 0
            }}
            fabStyle={{ backgroundColor: "#007AFF" }}
            actions={[
              {
                icon: "currency-usd",
                label: "Purchase",
                labelTextColor: "#007AFF",
                onPress: () => props.navigation.navigate("Purchase_Vouchar")
              },
              {
                icon: "qrcode-scan",
                label: "Redeem",
                labelTextColor: "#007AFF",
                onPress: () => console.log("Spreadsheet")
              }
            ]}
            onStateChange={({ open }) => setOpen(open)}
          />
        </Portal>
        <Portal>
          <Modal
            isVisible={IsVisiable}
            onBackdropPress={() => {
              setDataVIsiable(null);
              setIsVIsiable(false);
            }}
            animationIn="fadeInUp"
            animationOut="fadeOutDown"
            // backdropColor="white"
            // backdropOpacity={0.5}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 20,
                borderRadius: 10,
                borderColor: Colors.primary,
                borderWidth: 2,
                // width: "100%",
                maxHeight: Dimensions.get("window").width * 1.3,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 5
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: "50%",
                  borderWidth: 2,
                  borderColor: Colors.primary,
                  padding: 10,
                  borderRadius: 8,
                  backgroundColor: "white", // Ensure shadow is visible
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 }, // Adjust shadow direction
                  shadowOpacity: 0.2, // Adjust transparency
                  shadowRadius: 4, // Spread of shadow
                  elevation: 5, // Required for Android,
                  alignItems: "center"
                }}
              >
                {/* <Image
                  style={{ width: "100%", height: "100%" }}
                  source={{
                    uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnybLZQkb8BG9uN4bX31TBXP51qPlA3gD00g&s"
                  }}
                  resizeMode="contain"
                /> */}
                <QRCode
                  value={dataVisiable?.voucher}
                  size={Dimensions.get("window").width / 2}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 20
                }}
              >
                <Text style={[style.paymentText, { color: Colors.primary }]}>
                  Voucher
                </Text>
                <Text>{dataVisiable?.voucher}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <Text style={[style.paymentText, { color: Colors.primary }]}>
                  Amount
                </Text>
                <Text>{dataVisiable?.amount}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <Text style={[style.paymentText, { color: Colors.primary }]}>
                  Expiry
                </Text>
                <Text>
                  {dataVisiable?.expiresAt ? dataVisiable?.expiresAt : "-"}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <Text style={[style.paymentText, { color: Colors.primary }]}>
                  Created on
                </Text>
                <Text>
                  {" "}
                  {new Date(dataVisiable?.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <Text style={[style.paymentText, { color: Colors.primary }]}>
                  Used At
                </Text>
                <Text>
                  {new Date(dataVisiable?.usedAt).toLocaleDateString()}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <Text style={[style.paymentText, { color: Colors.primary }]}>
                  Used by
                </Text>
                <Text>{dataVisiable?.usedBy?.name}</Text>
              </View>
            </View>
          </Modal>
        </Portal>
      </SafeAreaView>
    </Provider>
  );
};
const style = StyleSheet.create({
  voucherButton: {
    padding: 10,
    width: Dimensions.get("window").width / 2.5,
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#007AFF"
  },
  voucherText: {
    fontWeight: "bold",
    fontSize: Math.min(Dimensions.get("window").width * 0.04, 16)
  },
  paymentButton: {
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    marginBottom: 10
  },
  paymentText: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: "bold"
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "black",
    padding: 12,
    borderRadius: 5
  }
});

export default Withdraw_Data;
