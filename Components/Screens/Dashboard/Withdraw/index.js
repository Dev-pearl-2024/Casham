import { SafeAreaView } from "react-native-safe-area-context";
import stylesheet from "../../../Elements/Styles";
import { Text } from "react-native-paper";
import { View, Platform } from "react-native";
import TouchableScale from "@jonny/touchable-scale";
import { AntDesign } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseURL } from "../../../API/baseURL";
import { compareDates } from "../../../Custom/dateCheck";

export default Withdraw = ({ navigation }) => {
  const [transactionsData, setTransactionData] = useState(null);

  const getTransactionData = async () => {
    const device_token = await AsyncStorage.getItem("device_token");
    // console.log(device_token);

    const api_token = await AsyncStorage.getItem("api_token");
    await axios
      .get(`${baseURL}transactions`, {
        params: {
          token: device_token
        },
        headers: {
          Authorization: `Bearer ${api_token}`
        }
      })
      .then((rs) => {
        if (rs.status == 200) {
          let sortedData = rs.data.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          setTransactionData(sortedData);
          // setData(rs.data)
        } else if (rs.status === 401) {
          console.log("Error");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [data, setData] = useState(null);

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

  const CheckSession = async () => {
    const device_token = await AsyncStorage.getItem("device_token");
    const api_token = await AsyncStorage.getItem("api_token");
    await axios
      .get(`${baseURL}login`, {
        params: {
          token: device_token
        },
        headers: {
          Authorization: `Bearer ${api_token}`
        }
      })
      .then((rs) => {
        if (!rs.data.status == 200) {
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }]
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    CheckSession();
    getTransactionData();
    GetUserDetails();
  }, []);

  const renderSentData = () => {
    return (
      <>
        {transactionsData?.map((item, index) => {
          return (
            <>
              {item.originName === data?.name && (
                <TouchableScale
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
                    navigation.navigate("ShowTransaction", {
                      data: item,
                      type: "sent"
                    });
                  }}
                >
                  <View
                    style={{
                      borderRadius: 20,
                      width: 40,
                      height: 40,
                      backgroundColor: "#f8cccc",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <AntDesign name="caretup" size={20} color={"red"} />
                  </View>
                  <View style={{ flex: 0.8 }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                      Sent
                    </Text>
                    <Text style={{ fontSize: 12 }}>{item.recipientName}</Text>
                  </View>
                  <View
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "bold",
                        color: "red"
                      }}
                    >
                      -LE {item.amount}
                    </Text>
                    <Text>{compareDates(item.date)}</Text>
                  </View>
                </TouchableScale>
              )}
            </>
          );
        })}
      </>
    );
  };

  return (
    <SafeAreaView style={[stylesheet.container]}>
      <View
        style={{
          marginTop: Platform.OS === "android" ? 90 : 0
        }}
      />

      {renderSentData()}
    </SafeAreaView>
  );
};
