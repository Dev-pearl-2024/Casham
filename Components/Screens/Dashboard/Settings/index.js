import { SafeAreaView } from "react-native-safe-area-context";
import stylesheet from "../../../Elements/Styles";
import { Card, Divider, Menu, Text } from "react-native-paper";
import {
  Appearance,
  Dimensions,
  Image,
  Linking,
  Touchable,
  TouchableOpacity,
  View,
  Platform
} from "react-native";
import { useColors } from "../../../Elements/Themes/Colors";
import { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import TouchableScale from "@jonny/touchable-scale";
import { Loader } from "../../../Elements/UIElements/Loader";
import { CustomSnackbar } from "../../../Elements/UIElements/CustomSnackbar";
import { CustomDialog } from "../../../Elements/UIElements/Dialog";

import axios from "axios";
import { baseURL } from "../../../API/baseURL";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  launchCameraAsync,
  launchImageLibraryAsync,
  MediaTypeOptions,
  requestMediaLibraryPermissionsAsync
} from "expo-image-picker";
import QR from "../../../Elements/UIElements/QR";
import { ExpandableSection } from "react-native-ui-lib";
import CustomTextInput from "../../../Elements/UIElements/TextInput";
import CustomButton from "../../../Elements/UIElements/Button";
import CheckSession from "../../../API/CheckSession";
import { Stagger } from "@animatereactnative/stagger";
import QR_share_freinds from "../../../Elements/UIElements/QR_Code_gallary_save";

export default Settings = ({ props }) => {
  const Colors = useColors();

  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const [themeState, setThemeState] = useState(Appearance.getColorScheme());
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const [data, setData] = useState(null);

  const GetUserDetails = async () => {
    setLoading(true);
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
          console.log(rs.data);

          setData(rs.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const [emailExpandable, setEmailExpandable] = useState(false);
  const [addressExpandable, setAddressExpandable] = useState(false);

  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    GetUserDetails();
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    setDialogVisible(false);

    try {
      const device_token = await AsyncStorage.getItem("device_token");
      const api_token = await AsyncStorage.getItem("api_token");

      // Log tokens for verification
      console.log("Device Token:", device_token);
      console.log("API Token:", api_token);

      // Ensure that tokens are not null or undefined
      if (!device_token || !api_token) {
        throw new Error("Device token or API token is missing");
      }

      const response = await axios.get(`${baseURL}signout`, {
        params: {
          token: device_token // Sending the device_token
        },
        headers: {
          Authorization: `Bearer ${api_token}` // Send API token as Bearer token
        }
      });

      console.log("Response Data:", response.data);
      setLoading(false);
      setSnackbarVisible(true);
      await AsyncStorage.setItem("device_token", "");
      await AsyncStorage.setItem("api_token", "");
      AsyncStorage.setItem("pin", "");
      setSnackbarMessage(response.data.message);
      props.navigation.reset({ index: 0, routes: [{ name: "Loading" }] });
    } catch (err) {
      // Log error response for diagnostics
      setLoading(false);
      setSnackbarVisible(true);
      await AsyncStorage.setItem("device_token", "");
      await AsyncStorage.setItem("api_token", "");
      await AsyncStorage.setItem("pin", "");
      setSnackbarMessage(err.message);
      props.navigation.reset({ index: 0, routes: [{ name: "Loading" }] });
    }
  };

  const [qrvisible, setQrvisible] = useState(false);
  const [inviteFriendsVisible, setInviteFriendsvisible] = useState(false);

  const TakePhoto = async () => {
    const device_token = await AsyncStorage.getItem("device_token");
    const api_token = await AsyncStorage.getItem("api_token");

    await requestMediaLibraryPermissionsAsync().then((rs) => {
      if (rs.granted) {
        launchCameraAsync({
          allowsEditing: true,
          quality: 0.7
        })
          .then(async (rs) => {
            if (!rs.canceled) {
              setLoading(true);
              const formData = new FormData();
              formData.append("uid", device_token);
              formData.append("photo", {
                uri: rs.assets[0].uri,
                type: "image/jpeg",
                name: "profile_photo.jpg"
              });

              try {
                const response = await axios.post(
                  `${baseURL}updates`,
                  formData,
                  {
                    headers: {
                      "Content-Type": "multipart/form-data",
                      Authorization: `Bearer ${api_token}`
                    }
                  }
                );

                if (response.status == 202) {
                  setLoading(false);
                  console.log(
                    "Profile photo updated successfully:",
                    response.data
                  );
                  GetUserDetails();
                  return response.data;
                } else {
                  setLoading(false);
                  GetUserDetails();
                  console.error(
                    "Failed to update profile photo:",
                    response.data
                  );
                }
              } catch (error) {
                GetUserDetails();
                setLoading(false);
                console.error("Error updating profile photo:", error);
              }
            }
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      } else {
        setLoading(false);
        setSnackbarMessage("Media library permission not granted");
        setSnackbarVisible(true);
      }
    });
  };

  const SelectImage = async () => {
    const device_token = await AsyncStorage.getItem("device_token");
    const api_token = await AsyncStorage.getItem("api_token");
    await requestMediaLibraryPermissionsAsync().then((rs) => {
      if (rs.granted) {
        launchImageLibraryAsync({
          allowsEditing: true,
          allowsMultipleSelection: false,
          quality: 0.7,
          mediaTypes: MediaTypeOptions.Images
        })
          .then(async (rs) => {
            if (!rs.canceled) {
              setLoading(true);
              const formData = new FormData();
              formData.append("uid", device_token); // Device UID is still required
              formData.append("photo", {
                uri: rs.assets[0].uri,
                type: "image/jpeg", // Replace with the actual file type, e.g., 'image/png'
                name: "profile_photo.jpg" // The filename for the uploaded photo
              });

              try {
                // Make the POST request using axios
                const response = await axios.post(
                  `${baseURL}updates`,
                  formData,
                  {
                    headers: {
                      "Content-Type": "multipart/form-data",
                      Authorization: `Bearer ${api_token}` // Add the API token to the headers
                    }
                  }
                );

                // Handle the response
                if (response.status == 202) {
                  setLoading(false);
                  console.log(
                    "Profile photo updated successfully:",
                    response.data
                  );
                  GetUserDetails();
                  return response.data;
                } else {
                  setLoading(false);
                  GetUserDetails();
                  console.error(
                    "Failed to update profile photo:",
                    response.data
                  );
                }
              } catch (error) {
                GetUserDetails();
                setLoading(false);
                console.error("Error updating profile photo:", error);
              }
            }
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      } else {
        setLoading(false);
        setSnackbarMessage("Media library permission not granted");
        setSnackbarVisible(true);
      }
    });
  };

  const handleDeregister = async () => {
    setLoading(true);
    setDialogVisible(false);
    const api_token = await AsyncStorage.getItem("api_token");
    const device_token = await AsyncStorage.getItem("device_token");

    await axios
      .delete(baseURL + "deleteuser", {
        headers: {
          Authorization: `Bearer ${api_token}`,
          "Content-Type": "application/json"
        },
        params: {
          devicetoken: device_token
        }
      })
      .then(async (rs) => {
        setLoading(false);
        setSnackbarVisible(true);
        setSnackbarMessage(response.data.message);
        await AsyncStorage.setItem("device_token", "");
        await AsyncStorage.setItem("api_token", "");
        await AsyncStorage.setItem("pin", "");

        props.navigation.reset({
          index: 0,
          routes: [{ name: "Onboarding" }]
        });
      })
      .catch((err) => {
        setLoading(false);
        setSnackbarVisible(true);
        setSnackbarMessage(err.response.message);
      });

    setLoading(false);
  };

  useEffect(() => {
    Appearance.addChangeListener(() => [
      setThemeState(Appearance.getColorScheme())
    ]);
  }, []);

  const number = "+23276603356";

  const handleOtpSend = async () => {
    // props.navigation.navigate("Pin", { mode: "update" });
    setLoading(true);
    console.log(data?.phoneNumber?.split("+")[1]);

    try {
      await axios
        .get(
          baseURL +
            `sendOtp?phoneNumber=%2B${data?.phoneNumber?.split("+")[1]}&context=RESET`
        )
        .then((rs) => {
          ShowSnackbar(rs.data.message);
          setLoading(false);
          const params = {
            result: null,
            phone: data?.phoneNumber,
            title: "Pin_Update"
          };
          props.navigation.navigate("Verification", params);
        });
    } catch (error) {
      console.log(error);

      ShowSnackbar(err.response.data.message);
      setLoading(false);
    }
  };

  const ShowSnackbar = (title) => {
    setSnackbarMessage(title);
    setSnackbarVisible(true);
  };

  return (
    <SafeAreaView
      style={[
        stylesheet.container,
        {
          marginBottom: 100,
          backgroundColor:Colors.primary
        }
      ]}
    >
      <CheckSession props={props} />
      <View
        style={{
          backgroundColor: Colors.primary,
          width: "100%",
          height: Dimensions.get("window").height / 3,
          position: "absolute",
          top: 10,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Card
          style={{
            borderRadius: 60
            // marginTop: 50
          }}
        >
          <Menu
            mode="elevated"
            style={{ marginTop: 150 }}
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <TouchableScale onPress={openMenu}>
                <Image
                  source={{
                    uri: data?.photo
                      ? data.photo
                      : "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"
                  }}
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 60
                  }}
                />
              </TouchableScale>
            }
          >
            <Menu.Item
              leadingIcon="camera"
              onPress={() => {
                TakePhoto();
              }}
              title="Capture Photo"
            />
            <Menu.Item
              leadingIcon="image"
              onPress={() => {
                SelectImage();
              }}
              title="Choose from library"
            />
          </Menu>

          <TouchableOpacity
            onPress={() => {
              setQrvisible(true);
            }}
          >
            <Card
              style={{
                position: "absolute",
                bottom: -20,
                right: 0,
                borderRadius: 20,
                backgroundColor: "white",
                width: 55,
                height: 55,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <MaterialIcons name="qr-code-2" size={35} />
            </Card>
          </TouchableOpacity>
        </Card>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: "white",
            marginTop: 20
          }}
        >
          {data ? data.name : "Username"}
        </Text>
        <Text style={{ color: "lightgray" }}>
          {data ? data.phoneNumber : "+292-9123491234s"}
        </Text>
      </View>

      <View
        style={{
          backgroundColor: "white",
          borderTopEndRadius: 30,
          borderTopStartRadius: 30,
          width: "100%",
          alignItems: "center",
          marginTop: Platform.OS === 'android' ? 240 : 200,
        }}
      >
        {/* <ExpandableSection
                    expanded={emailExpandable}
                    sectionHeader={
                        <TouchableOpacity style={{
                            backgroundColor: themeState === 'dark' ? '#414141' : '#f0f0f0',
                            width: Dimensions.get('window').width - 50, height: 50, marginTop: 30,
                            flexDirection: 'row', alignItems: 'center',
                            justifyContent: 'space-between', paddingHorizontal: 25,
                            borderTopLeftRadius: 10, borderTopRightRadius: 10,
                            alignSelf: 'center'
                        }} onPress={() => {
                            setEmailExpandable(!emailExpandable)
                            setAddressExpandable(false)
                        }} activeOpacity={0.6}>
                            <MaterialIcons name="email" color={'black'} size={25} />
                            <Text style={{
                                flex: 0.8,
                                fontSize: 15,
                            }}>Change Email</Text>
                            <MaterialIcons name={emailExpandable ?
                                "keyboard-arrow-down" : "arrow-forward-ios"
                            }
                                size={
                                    emailExpandable ? 30 : 20
                                } />
                        </TouchableOpacity>
                    }
                    onPress={() => console.log('pressed')}
                >

                    <View style={{
                        width: Dimensions.get('window').width - 50,
                        alignItems: 'center',
                        backgroundColor: themeState === 'dark' ? '#414141' : '#f0f0f0',
                        paddingVertical: 20
                    }}>
                        <CustomTextInput icon={"email"}
                            placeholder={"Email Address"}
                            internal marginBottom={10}
                            value={email} onChangeText={setEmail} />
                        {
                            email ?
                                <Stagger>
                                    <CustomButton label={"Update"}
                                        internal />
                                </Stagger>
                                :
                                null
                        }
                    </View>
                </ExpandableSection> */}

        {/* <Divider style={{
                    width: Dimensions.get('window').width - 50,
                    height: 0.5, backgroundColor: 'lightgray'
                }} />
                <ExpandableSection
                    expanded={addressExpandable}
                    sectionHeader={
                        <TouchableOpacity style={{
                            backgroundColor: themeState === 'dark' ? '#414141' : '#f0f0f0',
                            width: Dimensions.get('window').width - 50, height: 50,
                            flexDirection: 'row', alignItems: 'center',
                            justifyContent: 'space-between', paddingHorizontal: 25,
                            borderBottomLeftRadius: addressExpandable ? 0 : 10,
                            borderBottomRightRadius: addressExpandable ? 0 : 10
                        }} onPress={() => {
                            setAddressExpandable(!addressExpandable)
                            setEmailExpandable(false)
                        }} activeOpacity={0.6}>
                            <MaterialIcons name="location-city" color={'black'} size={25} />
                            <Text style={{
                                flex: 0.8,
                                fontSize: 15,
                            }}>Address</Text>
                            <MaterialIcons name={addressExpandable ?
                                "keyboard-arrow-down" : "arrow-forward-ios"
                            }
                                size={
                                    addressExpandable ? 30 : 20
                                } />
                        </TouchableOpacity>
                    }
                    onPress={() => console.log('pressed')}
                >
                    <View style={{
                        width: Dimensions.get('window').width - 50,
                        alignItems: 'center',
                        backgroundColor: themeState === 'dark' ? '#414141' : '#f0f0f0',
                        paddingVertical: 30,
                        borderBottomEndRadius: 10,
                        borderBottomStartRadius: 10
                    }}>
                        <CustomTextInput icon={"location-city"}
                            placeholder={"Address"}
                            internal marginBottom={10}
                            value={address} onChangeText={setAddress} />
                        {
                            address ?
                                <Stagger>
                                    <CustomButton label={"Update"}
                                        internal />
                                </Stagger>
                                :
                                null
                        }
                    </View>

                </ExpandableSection> */}

        <TouchableOpacity
          style={{
            backgroundColor: themeState === "dark" ? "#414141" : "#f0f0f0",
            width: Dimensions.get("window").width - 50,
            height: 50,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 25,
            borderRadius: 10,
            marginTop: 30
          }}
          onPress={handleOtpSend}
          activeOpacity={0.6}
        >
          <MaterialIcons name="password" color={"black"} size={25} />
          <Text
            style={{
              flex: 0.8,
              fontSize: 15
            }}
          >
            Change Pin
          </Text>
          <MaterialIcons name="arrow-forward-ios" size={20} />
        </TouchableOpacity>

        {/* <TouchableOpacity style={{
                    backgroundColor: themeState === 'dark' ? '#414141' : '#f0f0f0',
                    width: Dimensions.get('window').width - 50, height: 50, marginTop: 30,
                    flexDirection: 'row', alignItems: 'center',
                    justifyContent: 'space-between', paddingHorizontal: 25,
                    borderTopLeftRadius: 10, borderTopRightRadius: 10
                }} onPress={() => {

                }} activeOpacity={0.6}>
                    <MaterialIcons name="newspaper" color={'black'} size={25} />
                    <Text style={{
                        flex: 0.8,
                        fontSize: 15,
                    }}>News</Text>
                    <MaterialIcons name="arrow-forward-ios" size={20} />
                </TouchableOpacity>
                <Divider style={{
                    width: Dimensions.get('window').width - 50,
                    height: 0.5, backgroundColor: 'lightgray'
                }} />
                <TouchableOpacity style={{
                    backgroundColor: themeState === 'dark' ? '#414141' : '#f0f0f0',
                    width: Dimensions.get('window').width - 50, height: 50,
                    flexDirection: 'row', alignItems: 'center',
                    justifyContent: 'space-between', paddingHorizontal: 25,
                    borderBottomLeftRadius: 10, borderBottomRightRadius: 10
                }} onPress={() => {

                }} activeOpacity={0.6}>
                    <MaterialIcons name="bar-chart" color={'black'} size={25} />
                    <Text style={{
                        flex: 0.8,
                        fontSize: 15,
                    }}>Rate Information</Text>
                    <MaterialIcons name="arrow-forward-ios" size={20} />
                </TouchableOpacity> */}
        <TouchableOpacity
          style={{
            backgroundColor: themeState === "dark" ? "#414141" : "#f0f0f0",
            width: Dimensions.get("window").width - 50,
            height: 50,
            marginTop: 30,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 25,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10
          }}
          onPress={() => {
            props.navigation.navigate("PrivacyPolicy");
          }}
          activeOpacity={0.6}
        >
          <MaterialIcons name="fact-check" color={"black"} size={25} />
          <Text
            style={{
              flex: 0.8,
              fontSize: 15
            }}
          >
            Terms & Conditions
          </Text>
          <MaterialIcons name="arrow-forward-ios" size={20} />
        </TouchableOpacity>
        <Divider
          style={{
            width: Dimensions.get("window").width - 50,
            height: 0.5,
            backgroundColor: "lightgray"
          }}
        />
        <TouchableOpacity
          style={{
            backgroundColor: themeState === "dark" ? "#414141" : "#f0f0f0",
            width: Dimensions.get("window").width - 50,
            height: 50,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 25,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10
          }}
          onPress={() => {
            // props.navigation.navigate("Contact");

            Linking.openURL(`tel:${number}`).catch((err) =>
              console.error("Failed to open dialer:", err)
            );
          }}
          activeOpacity={0.6}
        >
          <MaterialIcons name="phone" color={"black"} size={25} />
          <Text
            style={{
              flex: 0.8,
              fontSize: 15
            }}
          >
            Contact Us
          </Text>
          <MaterialIcons name="arrow-forward-ios" size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: themeState === "dark" ? "#414141" : "#f0f0f0",
            width: Dimensions.get("window").width - 50,
            height: 50,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 25,
            borderRadius: 10,
            marginTop: 30
          }}
          onPress={() => {
            setInviteFriendsvisible(true);
          }}
          activeOpacity={0.6}
        >
          <MaterialIcons name="person-add" color={"black"} size={25} />
          <Text
            style={{
              flex: 0.8,
              fontSize: 15
            }}
          >
            Invite Friends
          </Text>
          <MaterialIcons name="arrow-forward-ios" size={20} />
        </TouchableOpacity>
        <TouchableScale
          style={{
            backgroundColor: themeState === "dark" ? "#414141" : "#f0f0f0",
            width: Dimensions.get("window").width - 50,
            height: 50,
            marginTop: 20,
            borderRadius: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 25
          }}
          onPress={() => {
            setDialogVisible(true);
            setDialogMessage(
              "Are you sure you want to De-register from Casham?"
            );
          }}
        >
          <MaterialIcons name="delete" color={Colors.red} size={25} />
          <Text
            style={{
              flex: 0.92,
              fontSize: 15,
              color: Colors.red
            }}
          >
            De-Register from Casham
          </Text>
        </TouchableScale>
        <TouchableScale
          style={{
            backgroundColor: themeState === "dark" ? "#414141" : "#f0f0f0",
            width: Dimensions.get("window").width - 50,
            height: 50,
            marginTop: 20,
            borderRadius: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 25,
            marginBottom: 100
          }}
          onPress={() => {
            setDialogVisible(true);
            setDialogMessage("Are you sure you want to logout?");
          }}
        >
          <MaterialIcons name="logout" color={Colors.red} size={25} />
          <Text
            style={{
              flex: 0.92,
              fontSize: 15,
              color: Colors.red
            }}
          >
            Logout
          </Text>
        </TouchableScale>
      </View>
      <Loader visible={loading} />
      <CustomSnackbar
        visible={snackbarVisible}
        label={snackbarMessage}
        onDismissSnackbar={() => {
          setSnackbarVisible(false);
          setSnackbarMessage("");
        }}
        title={"Alert!"}
      />
      <CustomDialog
        visible={dialogVisible}
        button1={
          dialogMessage == "Are you sure you want to logout?"
            ? "Logout"
            : "De-Register Now"
        }
        dialogMessage={dialogMessage}
        onDismiss={() => {
          setDialogMessage("");
          setDialogVisible(false);
        }}
        onPress={() => {
          dialogMessage == "Are you sure you want to logout?"
            ? handleLogout()
            : handleDeregister();
        }}
        red
      />
      <QR
        visible={qrvisible}
        dismiss={() => {
          setQrvisible(false);
        }}
      />
      <QR_share_freinds
        visible={inviteFriendsVisible}
        dismiss={() => {
          setInviteFriendsvisible(false);
        }}
      />
      {/* <UpdateSheet visible /> */}
    </SafeAreaView>
  );
};
