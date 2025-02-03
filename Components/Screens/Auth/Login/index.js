import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
  Linking,
  BackHandler
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import stylesheet from "../../../Elements/Styles";
import MobileInput from "../../../Elements/UIElements/MobileInput";
import CustomButton from "../../../Elements/UIElements/Button";
import { useColors } from "../../../Elements/Themes/Colors";
import { BackButton } from "../../../Elements/UIElements/BackButton";
import { CustomSnackbar } from "../../../Elements/UIElements/CustomSnackbar";
import { Loader } from "../../../Elements/UIElements/Loader";

import * as Location from "expo-location";
import { CustomDialog } from "../../../Elements/UIElements/Dialog";
import axios from "axios";
import { baseURL } from "../../../API/baseURL";

const Login = (props) => {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackVisible, setSnackVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");

  console.log("login");

  const onDismissSnackbar = () => {
    setSnackVisible(false);
  };

  const Colors = useColors();

  const [selectedCode, setSelectedCode] = useState("");

  const CheckUserExist = () => {
    setLoading(true);
    SendOTP();
  };

  const [visibleDialog, setVisibleDialog] = useState(false);

  const RequestLocation = async () => {
    await Location.requestForegroundPermissionsAsync()
      .then((rs) => {
        if (!rs.granted) {
          setVisibleDialog(true);
        } else {
          setVisibleDialog(false);
          Location.getLastKnownPositionAsync()
            .then((rs) => {
              console.log(rs.coords);
            })
            .catch((err) => {
              console.log(err.message);
            });
        }
      })
      .catch((err) => {
        console.log(err);
        setVisibleDialog(true);
      });
  };

  useEffect(() => {
    RequestLocation();
  }, []);

  const SendOTP = async () => {
    try {
      if (mobile) {
        // Request location permission
        Location.requestForegroundPermissionsAsync().then((rs) => {
          if (rs.granted) {
            // Use getCurrentPositionAsync as a fallback to get the current position if last known is unavailable
            Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.High
            })
              .then(async (rs) => {
                const latitude = rs.coords.latitude.toString();
                const longitude = rs.coords.longitude.toString();

                const formData = new FormData();
                formData.append("phoneNumber", selectedCode + mobile);
                formData.append("longitude", longitude);
                formData.append("latitude", latitude);

                // Send login request
                await axios
                  .post(baseURL + "login", formData, {
                    headers: {
                      "Content-Type": "multipart/form-data"
                    }
                  })
                  .then((rs) => {
                    ShowSnackbar(rs.data.message);
                    setLoading(false);
                    const params = {
                      result: null,
                      phone: selectedCode + mobile
                    };
                    props.navigation.navigate("Verification", params);
                  })
                  .catch((err) => {
                    console.log(err);

                    ShowSnackbar(err.response.data.message);
                    setLoading(false);
                  });
              })
              .catch((err) => {
                setLoading(false);
                ShowSnackbar(
                  "Failed to get location. Ensure location is enabled."
                );
              });
          } else if (!rs.granted) {
            setLoading(false);
            ShowSnackbar("Location permission denied");
            alert(
              "Please enable location permission from settings to continue."
            );
            Linking.openSettings();
          }
        });
      } else if (!mobile) {
        ShowSnackbar("Please enter a phone number.");
        setLoading(false);
      } else {
        ShowSnackbar("Invalid phone number.");
        setLoading(false);
      }
    } catch (error) {
      ShowSnackbar("Error authenticating user, try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    BackHandler.addEventListener(() => {}).remove();
  }, []);

  const ShowSnackbar = (title) => {
    setSnackMessage(title);
    setSnackVisible(true);
  };

  return (
    <SafeAreaView style={stylesheet.container}>
      <View
        style={{
          width: "100%",
          marginVertical: 10,
          paddingHorizontal: 25,
          marginTop: 50
        }}
      >
        <BackButton props={props} />
      </View>
      <ScrollView
        style={{}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{}}
      >
        <View
          style={{
            width: "90%",
            alignItems: "center",
            marginTop: 20,
            flex: 1,
            justifyContent: "space-between",
            height: Dimensions.get("window").height / 1.6
          }}
        >
          <View style={{ alignSelf: "flex-start" }}>
            <Image
              source={require("../../../Elements/Images/logo.png")}
              style={{ width: 100, height: 33.54, marginBottom: 20 }}
            />
            <Text
              style={[
                stylesheet.title,
                { alignSelf: "flex-start", color: Colors.text }
              ]}
            >
              Welcome Back to{" "}
              <Text style={[stylesheet.title, { color: Colors.primary }]}>
                Casham!
              </Text>
            </Text>
            <Text style={{ marginTop: 20, fontSize: 14, color: "gray" }}>
              Access your account securely and manage your transactions with
              ease.
            </Text>
            <View style={{ marginTop: 30 }}>
              <MobileInput
                value={mobile}
                onChangeText={(selectedCode, text) => {
                  setSelectedCode(selectedCode);
                  setMobile(text);
                }}
              />
            </View>
          </View>
        </View>
        <View
          style={{ alignItems: "center", gap: 20, marginBottom: 20, flex: 1 }}
        >
          <CustomButton label={"Send OTP"} onPress={CheckUserExist} />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 14, color: "gray" }}>
              Don't have an account?
            </Text>
            <TouchableOpacity
              onPress={() =>
                props.navigation.replace("Registration", { role: "user" })
              }
            >
              <Text
                style={{
                  fontSize: 14,
                  color: Colors.secondary,
                  fontWeight: "bold"
                }}
              >
                {" "}
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <CustomSnackbar
          visible={snackVisible}
          title={snackMessage}
          onDismissSnackbar={onDismissSnackbar}
        />
        <Loader visible={loading} />
      </ScrollView>
      <CustomDialog
        visible={visibleDialog}
        onDismiss={() => {
          Location.getForegroundPermissionsAsync().then((rs) => {
            if (rs.granted) {
              setVisibleDialog(false);
            } else {
              Linking.openSettings();
            }
          });
        }}
        dialogMessage={
          "Location permission not granted, please provide acccess to location services to continue"
        }
        settings
      />
    </SafeAreaView>
  );
};

export default Login;
