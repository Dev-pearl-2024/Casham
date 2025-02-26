import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import stylesheet from "../../Elements/Styles";
import { useColors } from "../../Elements/Themes/Colors";
import { Text } from "react-native-paper";
import LottieView from "lottie-react-native";
import { Dimensions, View } from "react-native";
import CheckSession from "../../API/CheckSession";
import axios from "axios";
import { baseURL } from "../../API/baseURL";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Updates from "expo-updates";

const Loading = (props) => {
  const Colors = useColors();

  const [update, setUpdate] = useState("Loading Casham...");

  useEffect(() => {
    setTimeout(() => {
      CheckUserAvailability();
    }, 1200);
  }, []);

  const CheckBankDetails = async () => {
    const api_token = await AsyncStorage.getItem("api_token");
    const device_token = await AsyncStorage.getItem("device_token");
    console.log(api_token);

    if (api_token) {
      axios
        .get(
          baseURL + "userdetails",

          {
            params: {
              token: device_token
            },
            headers: {
              Authorization: `Bearer ${api_token}`
            }
          }
        )
        .then(async (rs) => {
          console.log("loading:->", rs.data);

          const pin = await AsyncStorage.getItem("pin");
          if (rs.data.userDetails) {
            // if (pin) {
            props.navigation.replace("Dashboard");
            // } else {
            //     props.navigation.replace("Pin", { mode: 'create' })
            // }
          } else {
            props.navigation.replace("BankScreen");
          }
        })
        .catch((err) => {
          console.log(err);
          props.navigation.replace("Login");
        });
    }
  };

  const CheckForUpdates = async () => {
    try {
      // Check if an update is available
      const updateAPI = await Updates.checkForUpdateAsync();
      if (updateAPI.isAvailable) {
        setUpdate("Update available. Fetching...");
        await Updates.fetchUpdateAsync();
        setUpdate("Update fetched. Reloading app...");
        await Updates.reloadAsync();
      } else {
        setUpdate("App is up to date");
        setTimeout(() => {
          setUpdate("Loading Casham...");
        }, 500);
      }
    } catch (error) {
      setUpdate("Error checking for updates, Try again!");
      console.log(error);
    }
  };

  const CheckUserAvailability = async () => {
    await CheckForUpdates();
    const api_token = await AsyncStorage.getItem("api_token");
    const device_token = await AsyncStorage.getItem("device_token");
    if (api_token && device_token) {
      CheckBankDetails();
    } else {
      props.navigation.replace("Onboarding");
    }
  };

  return (
    <SafeAreaView
      style={[
        stylesheet.container,
        {
          justifyContent: "space-between"
        }
      ]}
    >
      <CheckSession props={props} />
      <View />
      <View
        style={{
          width: "100%",
          alignItems: "center"
        }}
      >
        <LottieView
          source={require("../../Elements/Animations/loadinganim.json")}
          style={{
            width: "100%",
            height: Dimensions.get("window").width - 100
          }}
          autoPlay
          loop
        />
        <View>
          <Text
            style={{
              color: Colors.primary,
              fontWeight: "bold",
              fontSize: 36
            }}
          >
            Casham
          </Text>
          <Text
            style={{
              alignSelf: "flex-end",
              color: Colors.primary
            }}
          >
            Salone
          </Text>
        </View>
      </View>
      <Text
        style={{
          fontSize: 20,
          marginBottom: 50
        }}
      >
        {update}
      </Text>
    </SafeAreaView>
  );
};

export default Loading;
