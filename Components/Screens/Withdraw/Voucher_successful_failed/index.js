import { MaterialIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { Dimensions, TouchableOpacity, View, Platform } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../../Elements/UIElements/Button";

const Voucher_successfull_failed = (props) => {
  console.log(props?.route?.params?.data);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableOpacity
        style={{
          borderWidth: 1,
          width: 40,
          height: 40,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
          borderColor: "lightgray",
          top: 20,
          left: 25
        }}
        onPress={() => {
          props.navigation.reset({
            index: 0,
            routes: [{ name: "Dashboard" }]
          });
        }}
        hitSlop={40}
      >
        <MaterialIcons name="arrow-back-ios-new" size={22} color={"gray"} />
      </TouchableOpacity>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          height: Dimensions.get("window").height / 1.5
        }}
      >
        {props?.route?.params?.success ? (
          <LottieView
            source={require("../../../Elements/Animations/successanimation.json")}
            autoPlay
            style={{ width: 200, height: 200 }}
          />
        ) : (
          <LottieView
            source={require("../../../Elements/Animations/failanimation.json")}
            autoPlay
            style={{ width: 200, height: 200 }}
          />
        )}
        {props?.route?.params?.success ? (
          <Text
            style={{
              color: "#00c885",
              fontWeight: "bold",
              fontSize: Dimensions.get("window").width / 16
            }}
          >
            Voucher {props?.route?.params?.title +"d" || "Redeemed"} Successfully
          </Text>
        ) : (
          <Text
            style={{
              color: "red",
              fontWeight: "bold",
              fontSize: Dimensions.get("window").width / 16
            }}
          >
            Voucher {props?.route?.params?.title || "Redeem"} Failed
          </Text>
        )}
        {props?.route?.params?.success ? (
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                paddingHorizontal: 20,
                marginVertical: 20,
                color: "gray",
                textAlign: "center"
              }}
            >
              Voucher {props?.route?.params?.title || "Redeem"} successfully
              done . You will receive a confirmation email shortly.
            </Text>
            <Text style={{ color: "gray" }}>
              Voucher ID:
              <Text style={{ fontWeight: "bold" }}>
                {" "}
                {props?.route?.params?.data?.voucher || "DEMO123TRANSACTION"}
              </Text>
            </Text>
            <Text
              style={{
                color: "#00c885",
                fontSize: Dimensions.get("window").width / 13,
                fontWeight: "bold",
                marginTop: 20
              }}
            >
              {props?.route?.params?.data?.amount} LE
            </Text>
          </View>
        ) : (
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                paddingHorizontal: 20,
                marginVertical: 20,
                color: "gray",
                textAlign: "center"
              }}
            >
              Please try again.
            </Text>
            {/* <Text style={{ color: "gray" }}>
              Voucher ID:
              <Text style={{ fontWeight: "bold", color: "red" }}>
                {" "}
                {props?.route?.params?.data?.voucher}
              </Text>
            </Text>
            <Text
              style={{
                color: "red",
                fontSize: Dimensions.get("window").width / 13,
                fontWeight: "bold",
                marginTop: 20
              }}
            >
              {props?.route?.params?.amount} LE
            </Text> */}
          </View>
        )}
      </View>

      <View style={{ position: "absolute", alignSelf: "center", bottom: Platform.OS === 'android' ? 20 : 80 }}>
        <CustomButton
          label={"Go back to Withdraw"}
          onPress={() => {
            props.navigation.replace("WithdrawData");
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Voucher_successfull_failed;
