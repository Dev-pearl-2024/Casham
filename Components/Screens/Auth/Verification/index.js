import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import stylesheet from "../../../Elements/Styles";
import { Text } from "react-native-paper";
import { Dimensions, Image, TextInput, View } from "react-native";
import { BackButton } from "../../../Elements/UIElements/BackButton";
import { useColors } from "../../../Elements/Themes/Colors";
import CustomButton from "../../../Elements/UIElements/Button";
import { TouchableOpacity } from "react-native";
import { CustomSnackbar } from "../../../Elements/UIElements/CustomSnackbar";
import { Loader } from "../../../Elements/UIElements/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as Location from "expo-location";

import axios from "axios";
import { baseURL, PostAPI } from "../../../API/baseURL";

const Verification = (props) => {
  const Colors = useColors();

  const [code, setCode] = useState("");
  const [mobile, setMobile] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [signup, setSignup] = useState(false);
  const [role, setRole] = useState("");

  const [snackMessage, setSnackMessage] = useState("");
  const [snackVisible, setSnackVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [code1, setCode1] = useState("");
  const [code2, setCode2] = useState("");
  const [code3, setCode3] = useState("");
  const [code4, setCode4] = useState("");
  const [code5, setCode5] = useState("");
  const [code6, setCode6] = useState("");

  const code1Ref = useRef(null);
  const code2Ref = useRef(null);
  const code3Ref = useRef(null);
  const code4Ref = useRef(null);
  const code5Ref = useRef(null);
  const code6Ref = useRef(null);

  const ShowSnackbar = (message) => {
    setSnackMessage(message);
    setSnackVisible(true);
    setTimeout(() => {
      setSnackVisible(false);
    }, 3000);
  };

  const onDismissSnackbar = () => {
    setSnackVisible(false);
  };

  useEffect(() => {
    if (props.route.params) {
      setMobile(props.route.params.phone);
      console.log(props.route.params.title);

      setRole(props.route.params.role);
      setTimeLeft(120);
      setIsTimerRunning(true);
      console.log(props.route.params.role);

      code1Ref?.current.focus();
    }
  }, [props.route.params]);

  const verifyCodeHandler = async (tx) => {
    setLoading(true);
    try {
      const codeString = `${code1}${code2}${code3}${code4}${code5}${tx}`;

      if (codeString.length !== 6 || !/^\d+$/.test(codeString)) {
        throw new Error("The verification code must be 6 numeric digits.");
      }

      const phoneNumber = props.route.params.phone;

      const formData = new FormData();
      formData.append("phoneNumber", phoneNumber);
      formData.append("text", codeString);

      console.log(formData);

      const response = await axios.post(baseURL + "verify", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if (
        response.status === 200 &&
        props.route.params.title === "Pin_Update"
      ) {
        setLoading(false);
        console.log("update pin otp :- ", response.data);
        props.navigation.navigate("Pin", { mode: "update" });
      } else if (response.status === 200) {
        console.log("login details-> ", response.data);

        const { api_key, device_token, userDetails, status } = response.data;

        await AsyncStorage.setItem("api_token", api_key);
        await AsyncStorage.setItem("device_token", device_token);

        setLoading(false);
        console.log("userDetails :- ", props.route.params.status);
        if (props.route.params.status === 201) {
          // props.navigation.reset({
          //   index: 0,
          //   routes: [{ name: "BankScreen" }]
          // });
          props.navigation.replace("Pin", { mode: "create" });
          return;
        } else if (userDetails && props.route.params.status !== 201) {
          props.navigation.reset({
            index: 0,
            routes: [{ name: "Dashboard" }]
          });
          console.log(userDetails);
        }
      }
    } catch (error) {
      console.log(
        "Error:",
        error.response ? error.response.data : error.message
      );
      ShowSnackbar(`Error: ${error.response.data.message}`);
      setLoading(false);
    }
  };

  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes = 120 seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let timer = null;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }

    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft]);

  const ResendOTP = async () => {
    //7300567667
    try {
      const phoneRegex = /^\d{10}$/;

      if (mobile && phoneRegex.test(mobile)) {
        setTimeLeft(120);
        setIsTimerRunning(true);

        // Resend OTP here
      } else if (!mobile) {
        ShowSnackbar("Please enter your phone number again.");
        setLoading(false);
        props.navigation.goBack();
      } else {
        ShowSnackbar("Invalid phone number.");
        setLoading(false);
        props.navigation.goBack();
      }
    } catch (error) {
      ShowSnackbar("Error Authenticating user, Try again.");
      setLoading(false);
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
      <View
        style={{
          top: 45,
          left: 35,
          alignSelf: "flex-start"
        }}
      >
        <BackButton props={props} />
      </View>
      <View
        style={{
          width: "90%",
          alignItems: "center",
          justifyContent: "space-between",
          flex: 1,
          paddingVertical: 80
        }}
      >
        <View style={{ alignSelf: "flex-start" }}>
          <Image
            source={require("../../../Elements/Images/logo.png")}
            style={{
              width: 100,
              height: 33.54,
              marginBottom: 20
            }}
          />
          <Text
            style={[
              stylesheet.title,
              {
                alignSelf: "flex-start"
              }
            ]}
          >
            Verify OTP sent to{" "}
            <Text
              style={[
                stylesheet.title,
                {
                  color: Colors.primary
                }
              ]}
            >
              Your Number
            </Text>
          </Text>
          <Text
            style={{
              marginTop: 20,
              fontSize: 14,
              color: "gray"
            }}
          >
            Securely log in with your One Time Password {"(OTP)"} to access your
            account.
          </Text>

          <View
            style={{
              marginTop: 30,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              width: "100%"
            }}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: Dimensions.get("window").width / 8,
                height: Dimensions.get("window").width / 8,
                borderWidth: 1,
                borderRadius: 10,
                borderColor: "lightgray"
              }}
            >
              <TextInput
                value={code1}
                inputMode="numeric"
                selectTextOnFocus
                textAlign="center"
                onChangeText={(tx) => {
                  setCode1(tx);
                  if (tx) {
                    code2Ref.current.focus();
                  }
                }}
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "gray"
                }}
                cursorColor={"gray"}
                ref={code1Ref}
                maxLength={1}
              />
            </View>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: Dimensions.get("window").width / 8,
                height: Dimensions.get("window").width / 8,
                borderWidth: 1,
                borderRadius: 10,
                borderColor: "lightgray"
              }}
            >
              <TextInput
                value={code2}
                inputMode="numeric"
                textAlign="center"
                selectTextOnFocus
                onChangeText={(tx) => {
                  setCode2(tx);
                  if (tx) {
                    code3Ref.current.focus();
                  } else if (!tx) {
                    code1Ref.current.focus();
                  }
                }}
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "gray"
                }}
                cursorColor={"gray"}
                ref={code2Ref}
                maxLength={1}
              />
            </View>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: Dimensions.get("window").width / 8,
                height: Dimensions.get("window").width / 8,
                borderWidth: 1,
                borderRadius: 10,
                borderColor: "lightgray"
              }}
            >
              <TextInput
                value={code3}
                inputMode="numeric"
                textAlign="center"
                selectTextOnFocus
                onChangeText={(tx) => {
                  setCode3(tx);
                  if (tx) {
                    code4Ref.current.focus();
                  } else if (!tx) {
                    code2Ref.current.focus();
                  }
                }}
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "gray"
                }}
                cursorColor={"gray"}
                ref={code3Ref}
                maxLength={1}
              />
            </View>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: Dimensions.get("window").width / 8,
                height: Dimensions.get("window").width / 8,
                borderWidth: 1,
                borderRadius: 10,
                borderColor: "lightgray"
              }}
            >
              <TextInput
                value={code4}
                inputMode="numeric"
                textAlign="center"
                selectTextOnFocus11
                onChangeText={(tx) => {
                  setCode4(tx);
                  if (tx) {
                    code5Ref.current.focus();
                  } else if (!tx) {
                    code3Ref.current.focus();
                  }
                }}
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "gray"
                }}
                cursorColor={"gray"}
                ref={code4Ref}
                maxLength={1}
              />
            </View>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: Dimensions.get("window").width / 8,
                height: Dimensions.get("window").width / 8,
                borderWidth: 1,
                borderRadius: 10,
                borderColor: "lightgray"
              }}
            >
              <TextInput
                value={code5}
                inputMode="numeric"
                textAlign="center"
                selectTextOnFocus
                onChangeText={(tx) => {
                  setCode5(tx);
                  if (tx) {
                    code6Ref.current.focus();
                  } else if (!tx) {
                    code4Ref.current.focus();
                  }
                }}
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "gray"
                }}
                cursorColor={"gray"}
                ref={code5Ref}
                maxLength={1}
              />
            </View>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: Dimensions.get("window").width / 8,
                height: Dimensions.get("window").width / 8,
                borderWidth: 1,
                borderRadius: 10,
                borderColor: "lightgray"
              }}
            >
              <TextInput
                value={code6}
                inputMode="numeric"
                textAlign="center"
                selectTextOnFocus
                onChangeText={(tx) => {
                  setCode6(tx);
                  if (!tx) {
                    code5Ref.current.focus();
                  } else if (tx && code1 && code2 && code3 && code4 && code5) {
                    verifyCodeHandler(tx).catch((err) => {
                      throw err;
                    });
                  }
                }}
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "gray"
                }}
                cursorColor={"gray"}
                ref={code6Ref}
                maxLength={1}
              />
            </View>
          </View>
          <TouchableOpacity
            style={{
              alignSelf: "center",
              marginTop: 50
            }}
            onPress={ResendOTP}
            disabled={isTimerRunning}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 16,
                color: isTimerRunning ? "#9E9E9E" : Colors.primary
              }}
            >
              {isTimerRunning
                ? `Resend in ${Math.floor(timeLeft / 60)}:${(timeLeft % 60)
                    .toString()
                    .padStart(2, "0")}`
                : "Resend Code"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <CustomSnackbar
        onDismissSnackbar={onDismissSnackbar}
        title={snackMessage}
        visible={snackVisible}
        label={"Okay"}
      />
      <Loader visible={loading} />
      <View style={{ marginBottom: 20 }}>
        <CustomButton
          label={"Verify OTP"}
          onPress={() => {
            if (code1 && code2 && code3 && code4 && code5 && code6) {
              verifyCodeHandler(code6).catch((err) => {
                throw err;
              });
            } else {
              ShowSnackbar("Please enter verification code.");
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Verification;
