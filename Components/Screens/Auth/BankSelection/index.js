import React, { useEffect, useState } from "react";
import { Dimensions, Image, ScrollView, View } from "react-native";
import { Modal, Portal, Text, TextInput } from "react-native-paper";
import { useColors } from "../../../Elements/Themes/Colors";
import axios from "axios";
import { TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CustomDialog } from "../../../Elements/UIElements/Dialog";
import TouchableScale from "@jonny/touchable-scale";
import { baseURL } from "../../../API/baseURL";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Loader } from "../../../Elements/UIElements/Loader";

const BankScreen = (props) => {
  const colors = useColors();

  const [bankData, setBankData] = useState(null);

  const GetAllBanks = async () => {
    await axios
      .get(baseURL + "/banks")
      .then((rs) => {
        if (rs.data.status == 200) {
          const bankNames = [];
          const bankCodes = [];
          const bankDataArr = [];
          console.log(rs.data);

          rs.data.BANKS.forEach((item) => {
            const [name, code] = item.split(":");
            bankNames.push(name);
            bankCodes.push(code);

            bankDataArr.push({ name, code });
          });

          setBankData(bankDataArr);
        } else {
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [accountDetailVisible, setAccountDetailVisible] = useState(false);

  const [BankSelection, setBankSelection] = useState({ name: "", code: "" });
  const [accountNumber, setAccountNumber] = useState("");

  const [modalHeight, setModalHeight] = useState(
    Dimensions.get("window").height / 1.5
  );

  const [searchInput, setSearchInput] = useState("");

  const SearchBanks = async () => {
    if (searchInput) {
      const filteredBanks = bankData?.filter((item) =>
        item.name.toLowerCase().includes(searchInput.toLowerCase())
      );

      setBankData(filteredBanks);
    } else {
      GetAllBanks();
    }
  };

  useEffect(() => {
    SearchBanks();
  }, [searchInput]);

  const handleBankDetails = async () => {
    setLoading(true);
    const api_token = await AsyncStorage.getItem("api_token");
    const formData = new FormData();
    formData.append("Accid", accountNumber);
    formData.append("Bankid", "ACCRA");
    formData.append("AccountType", "Corporate");
    if (accountNumber && BankSelection.code && BankSelection.name) {
      if (accountNumber.length > 16 || accountNumber.length < 15) {
        setLoading(false);
        alert("Invalid Account Number. Please enter a valid account number.");
      } else {
        await axios
          .post(baseURL + "Creates", formData, {
            headers: {
              Authorization: `Bearer ${api_token}`,
              "Content-Type": "multipart/form-data"
            }
          })
          .then(async (rs) => {
            if (rs.data.message) {
              const pin = await AsyncStorage.getItem("pin");
              if (pin) {
                props.navigation.replace("Dashboard");
              } else {
                await AsyncStorage.setItem("qr", rs.data.message);
                props.navigation.replace("Pin", { mode: "create" });
              }
            } else {
              alert("Error fetching response, try again");
            }

            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
            alert("Error fetching response, try again");
          });
      }
    } else {
      alert("Please fill all the details first");
      setLoading(false);
    }
  };

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GetAllBanks();
  }, []);

  return (
    <ScrollView>
      <Image
        source={require("../../../Elements/Images/logo.png")}
        style={{
          width: 100,
          height: 33.54,
          marginBottom: 20,
          left: 20,
          marginTop: 100
        }}
      />
      <Text
        style={{
          fontSize: Dimensions.get("window").width / 20,
          left: 20,
          fontWeight: "bold",
          color: colors.primary
        }}
      >
        Select Bank
      </Text>

      <TextInput
        label={"Search"}
        left={<TextInput.Icon icon={"magnify"} />}
        mode="outlined"
        style={{
          backgroundColor: "white",
          width: Dimensions.get("window").width - 40,
          alignSelf: "center",
          marginTop: 20,
          height: 60
        }}
        outlineColor="lightgray"
        value={searchInput}
        onChangeText={setSearchInput}
      />
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 22,
          marginStart: 20,
          marginTop: 30,
          marginBottom: 20
        }}
      >
        All Banks
      </Text>
      {bankData?.map((item, index) => {
        return (
          <TouchableOpacity
            key={index}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: Dimensions.get("window").width - 40,
              alignSelf: "center",
              paddingHorizontal: 40,
              marginVertical: 5,
              borderWidth: 1,
              borderColor: "lightgray",
              paddingVertical: 10,
              borderRadius: 10
            }}
            onPress={() => {
              setBankSelection({
                name: item.name,
                code: item.code
              });
              setDialogVisible(true);
              setDialogMessage(
                `Selected bank is ${item.name}, Proceed with selection?`
              );
            }}
          >
            <MaterialCommunityIcons
              name="bank-outline"
              size={30}
              style={{
                padding: 5,
                borderWidth: 0.8,
                borderColor: "lightgray",
                borderRadius: 5
              }}
            />
            <Text
              style={{
                flex: 0.95,
                fontSize: 16,
                fontWeight: "700"
              }}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
      <CustomDialog
        visible={dialogVisible}
        dialogMessage={dialogMessage}
        onDismiss={() => {
          setDialogVisible(false);
        }}
        button1={"Continue"}
        onPress={() => {
          setDialogVisible(false);
          setAccountDetailVisible(true);
        }}
      />
      <Portal>
        <Modal
          visible={accountDetailVisible}
          onDismiss={() => {
            setAccountDetailVisible(false);
          }}
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
            alignItems: "center"
          }}
          contentContainerStyle={{
            position: "absolute",
            bottom: 0
          }}
        >
          <View
            style={{
              width: Dimensions.get("window").width,
              height: modalHeight,
              backgroundColor: "white",
              borderTopStartRadius: 25,
              borderTopEndRadius: 25,
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
                marginTop: 100
              }}
            />
            <Text
              style={{
                fontSize: Dimensions.get("window").width / 20,
                left: 20,
                fontWeight: "bold",
                color: colors.primary
              }}
            >
              Account Number
            </Text>
            <Text
              style={{
                fontSize: 16,
                marginTop: 10,
                left: 20,
                marginRight: 20
              }}
            >
              Please provide account number for {BankSelection.name}
            </Text>
            <TextInput
              label={"Account Number"}
              maxLength={16}
              minLength={10}
              left={<TextInput.Icon icon={"bank-outline"} />}
              mode="outlined"
              style={{
                backgroundColor: "white",
                width: Dimensions.get("window").width - 40,
                alignSelf: "center",
                marginTop: 20,
                height: 60
              }}
              outlineColor="lightgray"
              onFocus={() => {
                setModalHeight(Dimensions.get("window").height);
              }}
              onBlur={() => {
                setModalHeight(Dimensions.get("window").height / 1.5);
              }}
              value={accountNumber}
              onChangeText={setAccountNumber}
            />
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
                elevation: 3
              }}
              onPress={handleBankDetails}
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
          </View>
        </Modal>
      </Portal>
      <Loader visible={loading} />
    </ScrollView>
  );
};

export default BankScreen;
