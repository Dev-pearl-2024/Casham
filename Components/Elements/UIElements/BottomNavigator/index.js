import {
  Animated,
  Appearance,
  Dimensions,
  Easing,
  Image,
  TouchableOpacity,
  View
} from "react-native";
import { useColors } from "../../Themes/Colors";
import { useEffect, useState } from "react";
import { Card, FAB, Text } from "react-native-paper";
import { Stagger } from "@animatereactnative/stagger";
import { FadeIn, FadeOut } from "react-native-reanimated";
import {
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialIcons
} from "@expo/vector-icons";
import { Button } from "react-native-ui-lib";

const BottomNavigator = ({ visibleTitle, handleTabPress, page1 }) => {
  const [visible, setVisible] = useState(visibleTitle);

  const [page, setPage] = useState(page1 || "Home");
  // console.log(page1);

  useEffect(() => {
    if (page1) {
      setPage(page1);
    }
  }, [page1]);

  useEffect(() => {
    handleTabPress(page);
  }, [page]);

  const [themeState, setThemeState] = useState(Appearance.getColorScheme());

  const [home, setHome] = useState(true);
  const [deposit, setDeposit] = useState(false);
  const [withdraw, setWithdraw] = useState(false);
  const [settings, setSettings] = useState(false);

  const animatedPosition = useState(new Animated.Value(0))[0];

  const animateNavbar = () => {
    Animated.timing(animatedPosition, {
      toValue: visibleTitle ? 0 : -115,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false
    }).start();
  };

  useEffect(() => {
    animateNavbar();
  }, [visibleTitle]);

  const [label, setLabel] = useState("");

  useEffect(() => {
    Appearance.addChangeListener(() => {
      setThemeState(Appearance.getColorScheme());
    });
  }, []);

  const Colors = useColors();

  return (
    <View
      style={{
        width: "100%"
      }}
    >
      <Animated.View
        style={{
          bottom: animatedPosition
        }}
      >
        <Card
          style={{
            backgroundColor: themeState === "dark" ? "#414141" : "white",
            width: Dimensions.get("window").width,
            height: 80,
            borderRadius: 0,
            paddingBottom: 10
          }}
        >
          <Stagger
            enabled={false}
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              width: "95%",
              height: "100%",
              alignSelf: "center"
            }}
          >
            <TouchableOpacity
              style={{
                alignItems: "center",
                justifyContent: "center",
                borderTopColor: themeState === "dark" ? "white" : "black",
                borderTopWidth: page == "Home" ? 3 : 0,
                height: "100%",
                width: "20%"
              }}
              onPress={() => {
                setPage("Home");
              }}
            >
              <Image
                source={
                  page == "Home"
                    ? require("../../../Elements/Images/standalonelogo.png")
                    : require("../../../Elements/Images/grayscalelogo.png")
                }
                style={{
                  width: page == "Home" ? 25 : 20,
                  height: page == "Home" ? 25.41 : 20.33
                }}
              />
              <Text
                style={{
                  marginTop: 5,
                  color:
                    themeState == "dark"
                      ? page == "Home"
                        ? "white"
                        : "gray"
                      : page == "Home"
                        ? "black"
                        : "gray"
                }}
              >
                Home
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                width: "20%",
                borderTopColor: themeState === "dark" ? "white" : "green",
                borderTopWidth: page == "Deposit" ? 3 : 0
              }}
              onPress={() => {
                setPage("Deposit");
              }}
            >
              <Feather
                name="arrow-down-left"
                size={page == "Deposit" ? 25 : 20}
                color={
                  themeState === "dark"
                    ? page == "Deposit"
                      ? "green"
                      : "green"
                    : page == "Deposit"
                      ? "green"
                      : "green"
                }
              />

              <Text
                style={{
                  marginTop: 5,
                  color:
                    themeState == "dark"
                      ? deposit
                        ? "white"
                        : "lightgreen"
                      : deposit
                        ? "black"
                        : "green"
                }}
              >
                Received
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                width: "20%",
                borderTopColor: themeState === "dark" ? "white" : "red",
                borderTopWidth: page == "Withdraw" ? 3 : 0
              }}
              onPress={() => {
                setPage("Withdraw");
              }}
            >
              <Feather
                name="arrow-up-right"
                size={page == "Withdraw" ? 25 : 20}
                color={
                  themeState === "dark"
                    ? page == "Withdraw"
                      ? "red"
                      : "red"
                    : page == "Withdraw"
                      ? "red"
                      : "red"
                }
              />

              <Text
                style={{
                  marginTop: 5,
                  color:
                    themeState == "dark"
                      ? page == "Withdraw"
                        ? "white"
                        : "lightred"
                      : page == "Withdraw"
                        ? "red"
                        : "red"
                }}
              >
                Sent
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                width: "20%",
                borderTopColor: themeState === "dark" ? "white" : "black",
                borderTopWidth: page == "Settings" ? 3 : 0
              }}
              onPress={() => {
                setPage("Settings");
              }}
            >
              <Ionicons
                name={page == "Settings" ? "settings" : "settings-outline"}
                size={page == "Settings" ? 25 : 20}
                color={
                  themeState === "dark"
                    ? page == "Settings"
                      ? "white"
                      : "gray"
                    : page == "Settings"
                      ? "black"
                      : "gray"
                }
              />

              <Text
                style={{
                  marginTop: 5,
                  color:
                    themeState == "dark"
                      ? page == "Settings"
                        ? "white"
                        : "gray"
                      : page == "Settings"
                        ? "black"
                        : "gray"
                }}
              >
                Settings
              </Text>
            </TouchableOpacity>
          </Stagger>
        </Card>
      </Animated.View>
    </View>
  );
};

export default BottomNavigator;
