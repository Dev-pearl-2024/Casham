import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import stylesheet from "../../../Elements/Styles";
import { BackButton } from "../../../Elements/UIElements/BackButton";
import { useColors } from "../../../Elements/Themes/Colors";
import CustomTextInput from "../../../Elements/UIElements/TextInput";
import CustomButton from "../../../Elements/UIElements/Button";
import { CustomSnackbar } from "../../../Elements/UIElements/CustomSnackbar";
import { Loader } from "../../../Elements/UIElements/Loader";
import axios from "axios";
import { baseURL } from "../../../API/baseURL";
import MobileInput from "../../../Elements/UIElements/MobileInput";
import * as Location from "expo-location";

const Registration = (props) => {
  const Colors = useColors();

  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackVisible, setSnackVisible] = useState(false);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");

  useEffect(() => {
    if (props.route.params) {
      setRole(props.route.params.role);
    }
  }, [props.route.params]);

  const [selectedCode, setSelectedCode] = useState("+232");

  const ShowSnackbar = (message) => {
    setSnackVisible(true);
    setSnackMessage(message);
    setTimeout(() => {
      setSnackVisible(false);
    }, 3000);
  };

  const HandleSignup = async () => {
    setLoading(true);
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      console.log(selectedCode, mobile);

      if (mobile) {
        if (role === "merchant" && (!email || !emailRegex.test(email))) {
          ShowSnackbar("Please enter a valid email address.");
          setLoading(false);
          return;
        }

        try {
          const rs = await Location.getLastKnownPositionAsync();
          const latitude = rs?.coords?.latitude?.toString() || null;
          const longitude = rs?.coords?.longitude?.toString() || null;

          // Create the FormData object
          const formData = new FormData();

          // Add common fields
          formData.append("name", name?.trim());
          formData.append("phoneNumber", selectedCode + mobile);
          formData.append("longitude", longitude ? longitude : 11.7799);
          formData.append("latitude", latitude ? latitude : 8.4606);

          if (role === "user") {
            formData.append("role", "USER");
          } else {
            formData.append("role", "MERCHANT");
            formData.append("businessName", businessName?.trim());
            formData.append("businessType", businessType?.trim());
            formData.append("email", email?.trim());
          }

          console.log("FormData to be sent:", formData);

          // Send the FormData object
          const response = await axios.post(baseURL + "signup", formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          });
          console.log("Response:", response.data);

          setLoading(false);
          ShowSnackbar("OTP Sent Successfully, please verify.");

          const params = {
            result: null,
            phone: selectedCode + mobile,
            role: role.toUpperCase(),
            name,
            email,
            businessName,
            businessType,
            businessAddress,
            status: response.data.status
          };
          props.navigation.navigate("Verification", params);
        } catch (err) {
          console.log("Error during signup:", err);
          setLoading(false);
          ShowSnackbar("Error: " + err.response.data.message);
        }
      } else {
        ShowSnackbar("Please check all the details.");
        setLoading(false);
      }
    } catch (error) {
      console.log("Unexpected error:", error);
      ShowSnackbar("Error: " + error.response.data.message);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[stylesheet.container, { justifyContent: "space-between" }]}
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
      <ScrollView
        style={{ width: "90%", flex: 1, marginTop: 80 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ alignSelf: "flex-start" }}>
          <Image
            source={require("../../../Elements/Images/logo.png")}
            style={{ width: 100, height: 33.54, marginBottom: 20 }}
          />
          <Text style={[stylesheet.title, { alignSelf: "flex-start" }]}>
            Join{" "}
            <Text style={[stylesheet.title, { color: Colors.primary }]}>
              Casham{" "}
            </Text>
            <Text style={[stylesheet.title]}>For Seamless Payments</Text>
          </Text>
          <Text style={{ marginTop: 20, fontSize: 14, color: "gray" }}>
            Sign up now for quick, secure access to all your financial needs.
          </Text>

          {role === "merchant" ? (
            <View
              style={{ marginTop: 30, alignSelf: "center", marginBottom: 100 }}
            >
              <MobileInput
                marginTop={10}
                value={mobile}
                onChangeText={(selected, text) => {
                  setMobile(text.text);
                  setSelectedCode(selected.selectedCode);
                }}
              />
              <CustomTextInput
                icon={"person"}
                placeholder={"Full Name"}
                marginTop={10}
                value={name}
                onChangeText={setName}
              />
              <CustomTextInput
                icon={"business"}
                placeholder={"Business Name"}
                marginTop={10}
                value={businessName}
                onChangeText={setBusinessName}
              />
              <CustomTextInput
                icon={"email"}
                placeholder={"Email"}
                marginTop={10}
                value={email}
                onChangeText={setEmail}
              />
              <CustomTextInput
                icon={"business-center"}
                placeholder={"Business Type (Optional)"}
                marginTop={10}
                value={businessType}
                onChangeText={setBusinessType}
              />
            </View>
          ) : (
            <View style={{ marginTop: 30, alignSelf: "center" }}>
              <CustomTextInput
                icon={"person"}
                placeholder={"Full Name"}
                value={name}
                onChangeText={setName}
              />
              <MobileInput
                marginTop={10}
                value={mobile}
                onChangeText={(mobile, text) => {
                  console.log(text);
                  setSelectedCode(mobile);
                  setMobile(text);
                }}
              />
            </View>
          )}
        </View>
      </ScrollView>
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <CustomButton label={"Sign Up"} onPress={HandleSignup} />
        <Text style={{ marginTop: 10, fontSize: 14 }}>
          By clicking on "Sign Up" you agree to our
        </Text>
        <TouchableOpacity
          onPress={() => props.navigation.navigate("PrivacyPolicy")}
        >
          <Text
            style={{ fontWeight: "bold", color: Colors.primary, fontSize: 14 }}
          >
            Terms & Conditions
          </Text>
        </TouchableOpacity>
      </View>
      <CustomSnackbar
        label={"Okay"}
        onDismissSnackbar={() => setSnackVisible(false)}
        title={snackMessage}
        visible={snackVisible}
      />
      <Loader visible={loading} />
    </SafeAreaView>
  );
};

export default Registration;
