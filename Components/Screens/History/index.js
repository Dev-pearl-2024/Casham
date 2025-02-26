import React, { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  Text,
  View,
  ScrollView,
  Dimensions
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TouchableScale from "@jonny/touchable-scale";
import { baseURL } from "../../API/baseURL";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { compareDates } from "../../Custom/dateCheck";

// Get the device width
const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Function to scale font size based on screen width
const responsiveFontSize = (fontSize) => (fontSize * SCREEN_WIDTH) / 375;

const History = (props) => {
  const [FundHistory, setFundHistory] = useState(null);
  const [data, setData] = useState(null);
  const [transactions, setTransactionData] = useState();
  const Colors = {
    primary: "#007AFF",
    text: "#000000"
  };

  const GetUserDetails = async () => {
    const device_token = await AsyncStorage.getItem("device_token");
    console.log(device_token);

    const api_token = await AsyncStorage.getItem("api_token");
    await axios
      .get(`${baseURL}userdetails`, {
        params: {
          token: device_token
        },
        headers: {
          Authorization: `Bearer ${api_token}`
        }
      })
      .then((rs) => {
        if (rs.data.status == 200) {
          console.log("userDetails-> ", rs.data);

          setData(rs.data);
        } else if (rs.status === 401) {
          console.log("Error");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchTransition = async () => {
    const device_token = await AsyncStorage.getItem("device_token");
    const api_token = await AsyncStorage.getItem("api_token");

    try {
      const response = await axios.get(`${baseURL}transactions`, {
        params: { token: device_token },
        headers: { Authorization: `Bearer ${api_token}` }
      });

      if (response.status === 200) {
        let sortedData = response.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setTransactionData(sortedData);
      } else if (response.status === 401) {
        console.log("Error: Unauthorized");
      }
    } catch (error) {
      console.log("Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchTransition();
    GetUserDetails();
  }, []);

  const renderReceivedData = () => {
    return (
      <>
        {transactions?.map((item, index) => (
          <TouchableScale
            key={index}
            style={{
              width: "90%",
              height: 70,
              borderRadius: 20,
              backgroundColor: "#eee",
              marginTop: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 20
            }}
            onPress={() => {
              props.navigation.navigate("ShowTransaction", {
                data: item,
                type: data?.name !== item.originName ? "received" : "sent"
              });
            }}
          >
            <View
              style={{
                borderRadius: 20,
                width: 40,
                height: 40,
                backgroundColor:
                  data?.name !== item.originName ? "#9EDF9C" : "#f8cccc",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {data?.name !== item.originName ? (
                <AntDesign name="caretdown" size={20} color={"green"} />
              ) : (
                <AntDesign name="caretup" size={20} color={"red"} />
              )}
            </View>
            <View style={{ flex: 0.8 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {data?.name !== item.originName ? "Received" : "Sent"}
              </Text>
              <Text style={{ fontSize: 12 }}>
                {data?.name === item.originName
                  ? item.recipientName
                  : item.originName}
              </Text>
            </View>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              {data?.name !== item.originName ? (
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "bold",
                    color: "green"
                  }}
                >
                  +LE {item.amount}
                </Text>
              ) : (
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "bold",
                    color: "red"
                  }}
                >
                  -LE {item.amount}
                </Text>
              )}
              <Text
                style={{
                  fontSize: 12
                }}
              >
                {compareDates(item.date)}
              </Text>
            </View>
          </TouchableScale>
        ))}
      </>
    );
  };

  return (
    <SafeAreaView>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 20,
          marginHorizontal: 20
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
          History
        </Text>
      </View>
      <ScrollView>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20
          }}
        >
          {transactions ? (
            transactions.length > 0 ? (
              renderReceivedData()
            ) : (
              <Text
                style={{ color: Colors.text, fontSize: responsiveFontSize(14) }}
              >
                No history available.
              </Text>
            )
          ) : (
            <Text
              style={{ color: Colors.text, fontSize: responsiveFontSize(14) }}
            >
              Loading...
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default History;
