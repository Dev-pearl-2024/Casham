import { SafeAreaView } from "react-native-safe-area-context";
import stylesheet from "../../../Elements/Styles";
import { Card, Text, TextInput } from "react-native-paper";
import {
  Appearance,
  Dimensions,
  FlatList,
  Image,
  NativeModules,
  PermissionsAndroid,
  Platform,
  View
} from "react-native";
import { useEffect, useState } from "react";
import { useColors } from "../../../Elements/Themes/Colors";
import TouchableScale from "@jonny/touchable-scale";
import axios, { Axios } from "axios";
import { baseURL, baseURLTransferAmount } from "../../../API/baseURL";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MobileInput from "../../../Elements/UIElements/MobileInput";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as Contacts from "expo-contacts";
import { ScrollView } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native-ui-lib";
import { CustomSnackbar } from "../../../Elements/UIElements/CustomSnackbar";
import { Loader } from "../../../Elements/UIElements/Loader";
// import ExpoContacts from "expo-contacts/build/ExpoContacts";
// import Contacts from "react-native-contacts";
const normalizeNumber = (number) => number.replace(/\D/g, "").slice(-10);
const Transfer = (props) => {
  // console.log(globalThis.expo?.modules?.Contacts);
  const [number, setNumber] = useState("");
  const [mobile, setMobile] = useState("");

  const [RecoverContactNumbers, setRecoverContactNumbers] = useState(null);

  const [contactDetails, setContactDetails] = useState("");

  const [selectedCode, setSelectedCode] = useState("");

  const colors = useColors();

  const [detail, setDetail] = useState(null);

  const [snackVisible, setSnackVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [storeToken, setStoreToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem("api_token");
      setStoreToken(storedToken);
    };
    fetchToken();
  }, []);

  const onDismissSnackbar = () => {
    setSnackVisible(false);
  };

  const handleSearch = async (num, code) => {
    const token = await AsyncStorage.getItem("api_token");
    console.log("fsdfda", code.split("+")[1]);

    await axios
      .get(
        baseURL + `paymentDetails?phoneNumber=%2B${code.split("+")[1]}${num}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then((rs) => {
        console.log(rs.data);

        setDetail(rs.data);
      })
      .catch((err) => {
        console.log(err);

        setDetail({
          message: "No Data found"
        });
      });
  };

  const [themeState, setThemeState] = useState(Appearance.getColorScheme());

  const handleMobileInputChange = (code, text) => {
    setSelectedCode(code);
    const filteredData = RecoverContactNumbers?.filter((item) =>
      item?.phoneNumbers?.[0]?.number?.includes(text)
    );
    // console.log("filteredData", filteredData);
    setContactDetails(filteredData);

    setMobile(text);
    setNumber(text);
    if (text.length == 8 || text.length == 10) {
      handleSearch(text, code);
    } else {
      setDetail(null);
    }
  };

  const handleNavigationToTransferPage = (registereNumber, userData) => {
    console.log(registereNumber, userData);

    if (number || registereNumber) {
      props.navigation.replace("Transaction", {
        data: detail || userData,
        number: number || registereNumber
      });
    }
  };

  // const getRegisteredContacts = async (numbers) => {
  //   const formData = new FormData();

  //   numbers?.forEach((element, index) => {
  //     formData.append(`numbers[${index}]`, element);
  //   });
  //   const token = await AsyncStorage.getItem("api_token");
  //   try {
  //     const rs = await axios.post(baseURL + "contacts", formData, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "multipart/form-data"
  //       }
  //     });
  //     console.log(rs?.status);
  //     console.log(rs?.data);
  //     if (rs?.status === 200) {
  //       // const normalizeNumber = rs?.data?.map((item) => normalizeNumber(item?.));
  //       // console.log(normalizeNumber);

  //       setContactDetails(rs?.data);
  //       setRecoverContactNumbers(rs?.data);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const getRegisteredContacts = async (numbers) => {
    if (!numbers || numbers.length === 0) return;

    const batchSize = 100; // Set batch size
    const token = await AsyncStorage.getItem("api_token");
    let allContacts = []; // To collect all responses

    for (let i = 0; i < numbers.length; i += batchSize) {
      const batch = numbers.slice(i, i + batchSize); // Get the batch of 100 numbers
      const formData = new FormData();

      batch.forEach((element, index) => {
        formData.append(`numbers[${index}]`, element);
      });

      try {
        const rs = await axios.post(baseURL + "contacts", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        });

        if (rs?.status === 200 && rs?.data) {
          allContacts = [...allContacts, ...rs.data];
        }
      } catch (error) {
        console.log("Error fetching contacts:", error);
      }
    }
    console.log(allContacts);

    // Once all requests are completed, update state
    // setContactDetails(allContacts);
    // setRecoverContactNumbers(allContacts);
  };

  // const storedData = async () => {
  //   const storedData = await AsyncStorage.getItem("contacts");
  //   console.log("stored Data", JSON.parse(storedData));
  //   setContactDetails(JSON.parse(storedData));
  // };
  // useEffect(() => {
  //   storedData();
  // }, []);

  const fetchContacts = async () => {
    setLoading(true);

    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== "granted") return;

    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers]
    });

    if (data.length > 0) {
      const formattedContacts = data
        .map((item) => ({
          name: item.name,
          number: item.phoneNumbers?.[0]?.number || ""
        }))
        .filter((item) => item.number); // Remove empty numbers

      // await AsyncStorage.setItem("contacts", JSON.stringify(formattedContacts));
      setContactDetails(formattedContacts);
      setLoading(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleSearchByContactNumber = async (number) => {
    setNumber(number);
    setLoading(true);
    // const token = await AsyncStorage.getItem("api_token");
    let formattedPhoneNumber;
    if (number.includes("+")) {
      formattedPhoneNumber = `%2B${number.replace("+", "")}`;
    } else {
      formattedPhoneNumber = number;
    }
    console.log(number);
    await axios
      .get(baseURL + `paymentDetails?phoneNumber=${formattedPhoneNumber}`, {
        headers: {
          Authorization: `Bearer ${storeToken}`
        }
      })
      .then((rs) => {
        console.log(rs.status);

        setDetail(rs.data);
        if (rs.status === 200) {
          console.log("check");

          handleNavigationToTransferPage(number, rs.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        setNumber("");
        console.log(err);
        setSnackVisible(true);
        setSnackMessage(
          "This number is not registered on 'Casham'. Please invite them to join the application."
        );
        setDetail(null);
        setLoading(false);
      });
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
          width: Dimensions.get("window").width,
          alignItems: "flex-start"
        }}
      >
        <Image
          source={require("../../../Elements/Images/logo.png")}
          style={{
            width: 100,
            height: 33.54,
            marginBottom: 20,
            left: 20,
            marginTop: 40
          }}
        />
        <Text
          style={{
            fontSize: Dimensions.get("window").width / 20,
            left: 20,
            fontWeight: "bold",
            color: colors.primary,
            fontFamily: "Inter-Black",
            marginTop: 10
          }}
        >
          Transfer to Number
        </Text>
        <Text
          style={{
            fontSize: 16,
            marginTop: 10,
            left: 20,
            marginRight: 20
          }}
        >
          Please enter mobile number to whom you want to transfer amount to.
        </Text>
        <View
          style={{
            marginTop: 30,
            // left: 20,
            marginBottom: 10,
            alignItems: "center",
            justifyContent: "center",
            width: Dimensions.get("window").width
          }}
        >
          <MobileInput
            value={mobile}
            placehoderText={"Enter Mobile Number"}
            onChangeText={handleMobileInputChange}
          />
        </View>
        {/* <TextInput label={"Registered Mobile Number"}
                    maxLength={10}
                    left={<TextInput.Icon icon={"phone"} />}
                    mode="outlined"
                    style={{
                        backgroundColor: 'white', width: Dimensions.get('window').width - 40,
                        alignSelf: "center",
                        marginTop: 20, height: 60
                    }} outlineColor="lightgray"
                    value={number} onChangeText={(tx) => {
                        setNumber(tx)
                        if (tx.length == 8) {
                            handleSearch(tx)
                        } else {
                            setDetail(null)
                        }
                    }} /> */}

        {detail ? (
          <Card
            style={{
              width: Dimensions.get("window").width - 55,
              backgroundColor: themeState === "dark" ? "#212121" : "#EFEFEF",
              marginTop: 30,
              alignSelf: "center"
            }}
            contentStyle={{
              paddingVertical: 20,
              paddingHorizontal: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between"
            }}
            onPress={handleNavigationToTransferPage}
          >
            <MaterialIcons name="person" size={30} />
            <View style={{ flex: 0.98 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 18
                }}
              >
                {detail?.Username}
              </Text>
              {number.includes("+") ? (
                <Text>{number}</Text>
              ) : (
                <Text>
                  {selectedCode}-{number}
                </Text>
              )}
            </View>
            <MaterialCommunityIcons
              style={{
                fontWeight: "bold"
              }}
              name="check"
              size={24}
              color="green"
            />
          </Card>
        ) : null}
      </View>
      {/** Contact numbers phone */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {!detail &&
          Array.isArray(contactDetails) &&
          contactDetails?.map((item, index) => {
            return (
              <TouchableScale
                key={index}
                onPress={() => handleSearchByContactNumber(item.number)}
              >
                <Card
                  style={{
                    width: Dimensions.get("window").width - 55,
                    backgroundColor:
                      themeState === "dark" ? "#212121" : "#EFEFEF",
                    marginTop: 10,
                    alignSelf: "center"
                  }}
                  contentStyle={{
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}
                >
                  <MaterialIcons name="person" size={30} />
                  <View style={{ flex: 0.98 }}>
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 16
                      }}
                    >
                      {item?.name}
                    </Text>
                    <Text>{item?.number}</Text>
                  </View>
                  {/* <MaterialCommunityIcons
                style={{
                  fontWeight: "bold"
                }}
                name="check"
                size={24}
                color="green"
              /> */}
                </Card>
              </TouchableScale>
            );
          })}
      </ScrollView>
      <TouchableScale
        style={{
          backgroundColor: colors.primary,
          width: Dimensions.get("window").width - 40,
          alignSelf: "center",
          marginTop: 20,
          height: 60,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
          elevation: 3,
          // marginBottom: 30,
          position: "absolute",
          bottom: 10
        }}
        onPress={handleNavigationToTransferPage}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "bold"
          }}
        >
          Continue
        </Text>
      </TouchableScale>
      <CustomSnackbar
        visible={snackVisible}
        title={snackMessage}
        onDismissSnackbar={onDismissSnackbar}
      />
      <Loader visible={loading} />
    </SafeAreaView>
  );
};

export default Transfer;
