import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import stylesheet from "../../Elements/Styles";
import LottieView from "lottie-react-native";
import { Dimensions, Linking, View } from "react-native";
import { DarkColors, useColors } from "../../Elements/Themes/Colors";
import { Text } from "react-native-paper";
import CustomButton from "../../Elements/UIElements/Button";
import { TouchableOpacity } from "react-native";
import { requestForegroundPermissionsAsync } from "expo-location";
import * as Location from 'expo-location'


const Onboarding = (props) => {

    const Colors = useColors()

    const LocationPermission = async () => {
        await requestForegroundPermissionsAsync().then((rs) => {
            if (!rs.granted) {
                alert("Please enable location permission to continue.")
                Linking.openSettings()
            } else {
                if (rs.canAskAgain) {
                    Location.getForegroundPermissionsAsync()
                } else {
                    console.log("Permission already granted")
                }
            }
        });
    }

    useEffect(()=>{
        LocationPermission()
    })

    return (
        <SafeAreaView style={[stylesheet.container, {
            justifyContent: 'space-around',
            paddingVertical: 20
        }]}>
            <View style={{ width: '90%' }}>
                <Text style={stylesheet.title}>
                    Unlock the Power of Payments with
                    <Text style={[stylesheet.title, {
                        color: Colors.primary
                    }
                    ]}> Casham</Text>
                </Text>
                <Text style={{
                    color: 'gray',
                    marginTop: 20,
                    fontSize: 18,
                    alignSelf: 'flex-start'
                }}>
                    Streamline your payments with efficiency and security.
                </Text>
            </View>
            <LottieView
                source={require('../../Elements/Animations/onboardinganim.json')}
                style={{
                    width: '100%', height: Dimensions.get('window')
                        .width - 20
                }} loop autoPlay />
            <View style={{
                alignItems: 'center',
                gap: 20
            }}>
                <CustomButton label={"Continue"}
                    onPress={() => {
                        props.navigation.navigate("Login")

                    }} />
                {/* <TouchableOpacity
                    onPress={() => {
                        props.navigation.navigate("Registration", { role: 'merchant' })
                    }}>
                    <Text
                        style={{
                            fontWeight: 'bold',
                            fontSize: 16, color: Colors.primary
                        }}>
                        Sign Up as Merchant
                    </Text>
                </TouchableOpacity> */}
            </View>

        </SafeAreaView>
    )
}

export default Onboarding