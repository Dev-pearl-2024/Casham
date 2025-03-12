import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Animated,
  Easing,
  ScrollView,
  BackHandler,
  Alert,
  Platform
} from "react-native";
import { AnimatedFAB, Portal } from "react-native-paper";
import Home from "./Home";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";
import Settings from "./Settings";
import stylesheet from "../../Elements/Styles";
import BottomNavigator from "../../Elements/UIElements/BottomNavigator";
import { Stagger } from "@animatereactnative/stagger";
import Header from "../../Elements/UIElements/Header";
import CheckSession from "../../API/CheckSession";
import { useNavigation } from "@react-navigation/native";

const Dashboard = (props) => {
  const [visibleTitle, setVisibleTitle] = useState(true);
  const [page, setPage] = useState(props.route.params?.page || "Home");
  const [fabVisible, setFabVisible] = useState(true);

  useEffect(() => {
    const backAction = () => {
      const canGoBack = navigator.canGoBack();

      if (canGoBack) {
        navigator.goBack();
      } else {
        Alert.alert("Hold on", "Exit confirmation", [
          { text: "Cancel", onPress: () => null, style: "cancel" },
          { text: "Yes", onPress: () => BackHandler.exitApp() }
        ]);
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigator]);

  useEffect(() => {
    // if (props.route.params?.page === "Settings") {
    //   setPage("Settings");
    // }
    if (page === "Home") setFabVisible(true);
    else setFabVisible(false);
  }, [page]);

  const animatedPosition = useState(new Animated.Value(145))[0];

  const animateButton = () => {
    Animated.timing(animatedPosition, {
      toValue: visibleTitle ? 145 : 70,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false
    }).start();
  };

  const navigator = useNavigation();

  const renderPage = () => {
    switch (page) {
      case "Home":
        return <Home props={props} />;
      case "Deposit":
        return <Deposit navigation={props.navigation} />;
      case "Withdraw":
        return <Withdraw navigation={props.navigation} />;
      case "Settings":
        return <Settings props={props} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    animateButton();
  }, [visibleTitle]);

  useEffect(() => {
    navigator.addListener("state", (event) => {
      const routes = event.data.state.routes;
      const currentIndex = event.data.state.index;
      const currentRouteName = routes[currentIndex].name;

      if (currentRouteName == "Dashboard") {
        setFabVisible(true);
        setVisibleTitle(true);
      } else {
        setFabVisible(false);
        setVisibleTitle(false);
      }
    });
  }, []);

  return (
    <SafeAreaView style={stylesheet.container}>
      <CheckSession props={props} />

      <Portal>
        <Header visible={page === "Settings" ? Platform.OS === 'ios' ? true : false : visibleTitle} />
      </Portal>
      <ScrollView
        onScroll={(tx) => {
          if (tx.nativeEvent.velocity.y > 0.4) {
            setVisibleTitle(false);
          } else if (
            tx.nativeEvent.velocity.y < -0.1 ||
            tx.nativeEvent.contentOffset.y <= 100
          ) {
            setVisibleTitle(true);
          }
        }}
        style={{ width: "100%" }}
        showsVerticalScrollIndicator={false}
      >
        {renderPage()}
      </ScrollView>
      <Portal>
        <Animated.View
          style={{
            alignSelf: "center",
            position: "absolute",
            bottom: animatedPosition,
            alignItems: "flex-end",
            flex: 1,
            width: "95%"
          }}
        >
          <AnimatedFAB
            label={"Scan QR"}
            icon={"qrcode-scan"}
            color="white"
            style={{
              backgroundColor: "rgba(0,0,0,0.9)"
            }}
            onPress={() => {
              setFabVisible(false);
              setVisibleTitle(false);
              props.navigation.navigate("QRScanner");
            }}
            iconMode="dynamic"
            extended={visibleTitle}
            visible={fabVisible}
          />
        </Animated.View>
      </Portal>
      <Stagger
        style={{
          alignItems: "center",
          position: "absolute",
          bottom: 0,
          left: 0
        }}
      >
        <BottomNavigator
          visibleTitle={visibleTitle}
          page1={page}
          handleTabPress={setPage}
        />
      </Stagger>
    </SafeAreaView>
  );
};

export default Dashboard;
