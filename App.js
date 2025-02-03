import "react-native-gesture-handler";
import * as React from "react";
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme
} from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  Provider as PaperProvider,
  MD3LightTheme,
  MD3DarkTheme,
  Text
} from "react-native-paper";
import Loading from "./Components/Screens/Loading";
import {
  createStackNavigator,
  TransitionPresets
} from "@react-navigation/stack";
import {
  DarkColors,
  LightColors,
  useColors
} from "./Components/Elements/Themes/Colors";
import Onboarding from "./Components/Screens/Onboarding";
import Login from "./Components/Screens/Auth/Login";
import Registration from "./Components/Screens/Auth/Register";
import Verification from "./Components/Screens/Auth/Verification";
import PrivacyPolicy from "./Components/Screens/PrivacyPolicy";
import Dashboard from "./Components/Screens/Dashboard";
import { Platform, UIManager } from "react-native";
import QRScanner from "./Components/Screens/QRScanner";
import { StatusBar } from "expo-status-bar";
import Transaction from "./Components/Screens/Transaction";
import BankScreen from "./Components/Screens/Auth/BankSelection";
import Pin from "./Components/Screens/Payment/Pin";
import CompleteTransaction from "./Components/Screens/Payment/Complete";
import Transfer from "./Components/Screens/Payment/Transfer";
import ShowTransaction from "./Components/Screens/Transaction/ShowTransaction";
import ContactPopup from "./Components/Screens/Dashboard/Settings/Contact";

const Stack = createStackNavigator();

function App() {
  const colors = useColors();

  const customPaperTheme = {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: DarkColors.primary,
      background: DarkColors.background,
      secondary: DarkColors.secondary
    }
  };

  const customPaperDarkTheme = {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      primary: DarkColors.primary,
      background: DarkColors.background,
      secondary: DarkColors.secondary
    }
  };

  const customNavigationTheme = {
    ...NavigationDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      primary: LightColors.primary,
      background: LightColors.background,
      secondary: LightColors.secondary
    }
  };

  const customNavigationDarkTheme = {
    ...NavigationDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      primary: DarkColors.primary,
      background: DarkColors.background,
      secondary: DarkColors.secondary
    }
  };

  const isDarkTheme = colors === DarkColors;

  React.useEffect(() => {
    if (
      Platform.OS === "android" &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" hidden />
      <PaperProvider
        theme={isDarkTheme ? customPaperDarkTheme : customPaperTheme}
      >
        <NavigationContainer
          theme={
            isDarkTheme ? customNavigationDarkTheme : customNavigationTheme
          }
        >
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Loading" component={Loading} />
            <Stack.Screen name="Onboarding" component={Onboarding} />
            <Stack.Screen
              name="Login"
              component={Login}
              options={{
                animationEnabled: true,
                animation: "slide_from_bottom",
                gestureEnabled: true,
                presentation: "modal",
                ...TransitionPresets.ModalPresentationIOS
              }}
            />
            <Stack.Screen
              name="Registration"
              component={Registration}
              options={{
                animationEnabled: true,
                animation: "slide_from_bottom",
                gestureEnabled: true,
                presentation: "modal",
                ...TransitionPresets.ModalPresentationIOS
              }}
            />
            <Stack.Screen
              name="Verification"
              component={Verification}
              options={{
                animationEnabled: true,
                animation: "slide_from_bottom",
                gestureEnabled: true,
                presentation: "modal",
                ...TransitionPresets.ModalPresentationIOS
              }}
            />
            <Stack.Screen
              name="PrivacyPolicy"
              component={PrivacyPolicy}
              options={{
                animationEnabled: true,
                animation: "slide_from_bottom",
                gestureEnabled: true,
                presentation: "modal",
                ...TransitionPresets.ModalPresentationIOS
              }}
            />
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="QRScanner" component={QRScanner} />
            <Stack.Screen name="Transaction" component={Transaction} />
            <Stack.Screen name="BankScreen" component={BankScreen} />
            <Stack.Screen name="Pin" component={Pin} />
            <Stack.Screen
              name="Contact"
              component={ContactPopup}
              options={{
                animationEnabled: true,
                animation: "slide_from_bottom",
                gestureEnabled: true,
                presentation: "modal",
                ...TransitionPresets.ModalPresentationIOS
              }}
            />
            <Stack.Screen
              name="CompleteTransaction"
              component={CompleteTransaction}
            />
            <Stack.Screen name="Transfer" component={Transfer} />
            <Stack.Screen
              name="ShowTransaction"
              component={ShowTransaction}
              options={{
                animationEnabled: true,
                animation: "slide_from_bottom",
                gestureEnabled: true,
                presentation: "modal",
                ...TransitionPresets.ModalPresentationIOS
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

export default App;
