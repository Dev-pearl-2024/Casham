import { SafeAreaView } from "react-native-safe-area-context";
import stylesheet from "../../../Elements/Styles";
import { Card, Text } from "react-native-paper";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { useColors } from "../../../Elements/Themes/Colors";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import TouchableScale from "@jonny/touchable-scale";
import axios from "axios";
import { baseURL } from "../../../API/baseURL";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { compareDates } from "../../../Custom/dateCheck";

export default Home = ({ props }) => {
  const Colors = useColors();

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
        if (rs.status) {
          console.log("Valid session");
        }
      })
      .catch((err) => {
        console.log(err);
        if ((err.status = 401)) {
          props.navigation.reset({
            index: 0,
            routes: [{ name: "Login" }]
          });
        }
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

  useEffect(() => {
    CheckSession();
    GetUserDetails();
    getUserBalance();
    fetchTransition();
  }, []);

  const [transactionsData, setTransactionData] = useState(null);

  const fetchTransition = async () => {
    const device_token = await AsyncStorage.getItem("device_token");

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
          console.log("transitiondata->", rs.data);
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

  const [balance, setBalance] = useState(0);

  const getUserBalance = async () => {
    const token = await AsyncStorage.getItem("api_token");
    await axios
      .get(baseURL + "balance", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((rs) => {
        setBalance(rs.data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const renderTransactionData = () => {
    return (
      <>
        {transactionsData?.map((item, index) => {
          return (
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
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
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
                <Text>{compareDates(item.date)}</Text>
              </View>
            </TouchableScale>
          );
        })}
      </>
    );
  };

  const DashboardCard = () => {
    return (
      <View
        style={{
          width: Dimensions.get("window").width,
          alignItems: "center"
        }}
      >
        <Card
          style={{
            marginTop: 10,
            width: Dimensions.get("window").width - 30,
            height: Dimensions.get("window").height / 3.8,
            backgroundColor: Colors.primary,
            borderRadius: 20
          }}
          contentStyle={{
            justifyContent: "space-between",
            flex: 1
          }}
        >
          <Image
            source={require("../../../Elements/Images/dashframe.png")}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              borderRadius: 20
            }}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 20
            }}
          >
            <View>
              <Text style={{ color: "lightgray" }}>Total Balance</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-end",
                  marginTop: 5,
                  gap: 5
                }}
              >
                <Text style={{ fontSize: 16, color: "lightgray" }}>LE</Text>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "bold",
                    color: "white"
                  }}
                >
                  {parseInt(balance).toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              alignItems: "flex-end",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              marginBottom: 10
            }}
          >
            <View style={{ alignItems: "center", gap: 5 }}>
              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  borderColor: "white",
                  borderWidth: 2,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center"
                }}
                activeOpacity={0.6}
              >
                <View
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: "100%",
                    borderRadius: 20,
                    backgroundColor: "white",
                    opacity: 0.4
                  }}
                />
                <MaterialIcons name="add" size={24} color={"white"} />
              </TouchableOpacity>
              <Text style={{ color: "white" }}>Top Up</Text>
            </View>
            <View style={{ alignItems: "center", gap: 5 }}>
              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  borderColor: "white",
                  borderWidth: 2,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center"
                }}
                activeOpacity={0.6}
                onPress={() => {
                  props.navigation.navigate("Transfer");
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: "100%",
                    borderRadius: 20,
                    backgroundColor: "white",
                    opacity: 0.4
                  }}
                />
                <Feather name="arrow-up-right" size={24} color={"white"} />
              </TouchableOpacity>
              <Text style={{ color: "white" }}>Transfer</Text>
            </View>
            <View style={{ alignItems: "center", gap: 5 }}>
              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  borderColor: "white",
                  borderWidth: 2,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center"
                }}
                activeOpacity={0.6}
                onPress={() => props.navigation.navigate("WithdrawData")}
              >
                <View
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: "100%",
                    borderRadius: 20,
                    backgroundColor: "white",
                    opacity: 0.4
                  }}
                />
                <Feather name="arrow-down-left" size={24} color={"white"} />
              </TouchableOpacity>
              <Text style={{ color: "white" }}>Withdraw</Text>
            </View>
            <View style={{ alignItems: "center", gap: 5 }}>
              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  borderColor: "white",
                  borderWidth: 2,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center"
                }}
                activeOpacity={0.6}
                onPress={() => {
                  props.navigation.navigate("History");
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: "100%",
                    borderRadius: 20,
                    backgroundColor: "white",
                    opacity: 0.4
                  }}
                />
                <MaterialIcons name="history" size={24} color={"white"} />
              </TouchableOpacity>
              <Text style={{ color: "white" }}>History</Text>
            </View>
          </View>
        </Card>
      </View>
    );
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const screenWidth = Dimensions.get("window").width;

  const dashboardItems = [1, 2, 3, 4];

  const onScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);
    setActiveIndex(index);
  };

  return (
    <SafeAreaView
      style={[
        stylesheet.container,
        {
          marginBottom: 100
        }
      ]}
    >
      {/* <Text
        style={{
          fontSize: 24,
          color: "#000",
          fontWeight: "bold",
          marginBottom: 20,
          marginTop: 110,
          alignSelf: "flex-start",
          marginStart: 20
        }}
      >
        Overview
      </Text> */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollViewContent}
      >
        {dashboardItems.map((_, index) => (
          <DashboardCard key={index} />
        ))}
      </ScrollView>

      {/* Render the indicator dots */}
      <View style={styles.dotsContainer}>
        {dashboardItems.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index ? styles.activeDot : styles.inactiveDot
            ]}
          />
        ))}
      </View>
      {renderTransactionData()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  scrollViewContent: {
    marginVertical: 0,
    marginTop: 110
  },
  card: {
    width: Dimensions.get("window").width - 40, // Adjust width for each card
    height: 200,
    marginHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#c4c4c4"
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10
  },
  dot: {
    borderRadius: 5,
    marginHorizontal: 5
  },
  activeDot: {
    backgroundColor: "#000",
    width: 8,
    height: 8
  },
  inactiveDot: {
    backgroundColor: "#c4c4c4",
    width: 6,
    height: 6
  }
});
