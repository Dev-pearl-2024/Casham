import { SafeAreaView } from "react-native-safe-area-context";
import stylesheet from "../../../Elements/Styles";
import { Text } from "react-native-paper";
import { View ,Platform} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import TouchableScale from "@jonny/touchable-scale";
import { useEffect, useState } from "react";
import { baseURL } from "../../../API/baseURL";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { compareDates } from "../../../Custom/dateCheck";

export default Deposit = ({ navigation, route }) => {
  const [transactionsData, setTransactionData] = useState(null);
  const [data, setData] = useState(null);

  const getTransactionData = async () => {
    const device_token = await AsyncStorage.getItem("device_token");
    const api_token = await AsyncStorage.getItem("api_token");
    try {
      const rs = await axios.get(`${baseURL}transactions`, {
        params: { token: device_token },
        headers: { Authorization: `Bearer ${api_token}` }
      });
      if (rs.status === 200) {
        if (rs.status == 200) {
          let sortedData = rs.data.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          setTransactionData(sortedData);
          // setData(rs.data)
        }
      } else if (rs.status === 401) {
        console.log("Error");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const GetUserDetails = async () => {
    const device_token = await AsyncStorage.getItem("device_token");
    const api_token = await AsyncStorage.getItem("api_token");
    try {
      const rs = await axios.get(`${baseURL}userdetails`, {
        params: { token: device_token },
        headers: { Authorization: `Bearer ${api_token}` }
      });
      if (rs.data.status === 200) {
        setData(rs.data);
      } else if (rs.status === 401) {
        console.log("Error");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const CheckSession = async () => {
    const device_token = await AsyncStorage.getItem("device_token");
    const api_token = await AsyncStorage.getItem("api_token");
    try {
      const rs = await axios.get(`${baseURL}login`, {
        params: { token: device_token },
        headers: { Authorization: `Bearer ${api_token}` }
      });
      if (rs.data.status !== 200) {
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }]
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    CheckSession();
    getTransactionData();
    GetUserDetails();
  }, []);

  const renderReceivedData = () => {
    return (
      <>
        {transactionsData?.map((item, index) => (
          <>
            {item.originName !== data?.name && (
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
                  navigation.navigate("ShowTransaction", {
                    data: item,
                    type: "received"
                  });
                }}
              >
                <View
                  style={{
                    borderRadius: 20,
                    width: 40,
                    height: 40,
                    backgroundColor: "#9EDF9C",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <AntDesign name="caretdown" size={20} color={"green"} />
                </View>
                <View style={{ flex: 0.8 }}>
                  <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                    Received
                  </Text>
                  <Text style={{ fontSize: 12 }}>{item.originName}</Text>
                </View>
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "bold",
                      color: "green"
                    }}
                  >
                    +LE {item.amount}
                  </Text>
                  <Text>{compareDates(item.date)}</Text>
                </View>
              </TouchableScale>
            )}
          </>
        ))}
      </>
    );
  };

  return (
    <SafeAreaView style={[stylesheet.container]}>
      {/* <Text
        style={{
          fontSize: 24,
          color: "#000",
          fontWeight: "bold",
          marginBottom: 0,
          marginTop: Platform.OS === 'android' ? 100 : 0,
          alignSelf: "flex-start",
          marginStart: 20
        }}
      >
        Received
      </Text> */}
      <View style={{marginTop:Platform.OS === 'android' ? 90 : 0}} />
      {renderReceivedData()}
    </SafeAreaView>
  );
};
