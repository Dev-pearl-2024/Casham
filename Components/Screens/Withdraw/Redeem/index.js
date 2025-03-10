import { CameraView } from "expo-camera";
import { useState, useEffect } from "react";
import {
  Dimensions,
  Image,
  Linking,
  Pressable,
  TextInput,
  View
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BarCodeScanner } from "expo-barcode-scanner";
import { BackButton } from "../../../Elements/UIElements/BackButton";
import { baseURL } from "../../../API/baseURL";
import BottomModal from "./BottomNavigation";

const Redeem_Scan = (props) => {
  const [isScanned, setIsScanned] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const decodeQR = async (data) => {
    try {
      console.log(data);
      const formData = new FormData();
      formData.append("voucherCode", data);
      const token = await AsyncStorage.getItem("api_token");
      const rs = await axios.post(baseURL + "voucher/redeem", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      if (rs.status === 200) {
        props.navigation.navigate("WithdrawData");
      }
    } catch (error) {
      console.error(
        "Error decoding QR:",
        error?.response?.data || error.message
      );
    } finally {
      setIsScanned(false);
    }
  };

  const RequestPermission = () => {
    BarCodeScanner.requestPermissionsAsync().then((rs) => {
      if (!rs.granted) {
        alert(
          "Please provide camera permission for QR Scanner to work as expected."
        );
        Linking.openSettings();
      }
    });
  };

  useEffect(() => {
    RequestPermission();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        style={{ flex: 1 }}
        onBarcodeScanned={(rs) => {
          if (!isScanned) {
            setIsScanned(true);
            decodeQR(rs.data);
          }
        }}
      />
      <View
        style={{
          position: "absolute",
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Image
          source={require("../../../Elements/Images/qrlayer.png")}
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height
          }}
        />
        <View
          style={{
            position: "absolute",
            top: 30,
            left: 25
          }}
        >
          <BackButton props={props} />
        </View>
        <View
          style={{
            position: "absolute",
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height / 6,
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
            borderTopEndRadius: 20,
            borderTopLeftRadius: 20
          }}
        >
          <Pressable
            style={{ width: "90%" }}
            onPress={() => setIsModalVisible(true)}
          >
            <TextInput
              style={{
                width: "100%",
                height: 40,
                borderWidth: 1,
                borderColor: "gray",
                fontSize: 16,
                paddingHorizontal: 10
              }}
              placeholder="Tap here..."
              editable={false}
            />
          </Pressable>
        </View>
      </View>

      <BottomModal
        visiable={isModalVisible}
        navigation={props.navigation}
        setIsModalVisible={setIsModalVisible}
      />
    </View>
  );
};

export default Redeem_Scan;
