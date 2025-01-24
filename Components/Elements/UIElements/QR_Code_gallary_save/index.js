import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
import { Dimensions, Image, Share, View, Platform, Alert } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Modal, Portal, Text } from "react-native-paper";
import QRCode from "react-native-qrcode-svg";
import * as FileSystem from "expo-file-system"; // For saving the QR code image to a file
import { captureScreen } from "react-native-view-shot";

const QR_share_freinds = ({ visible, dismiss }) => {
    const qrCodeRef = useRef(null);

    const handleImageShare = async () => {
        try {
            // Capture the screenshot of the whole screen or specific view
            const uri = await captureScreen({
                format: 'png',   // Format of the screenshot
                quality: 0.8,    // Quality of the screenshot
            });

            console.log('Screenshot URI:', uri);

            // Share the image using react-native-share
            const options = {
                title: 'Share Image',
                message: 'Here is a screenshot for you!',
                url: uri,  // URI of the captured image
                type: 'image/png', // MIME type
            };

            // await Share.open(options);  // Open share dialog

            // Save the image to the gallery (optional)
            // await CameraRoll.save(uri, { type: 'photo' });

            console.log('Image saved to gallery!');
        } catch (error) {
            console.error('Error sharing or saving image:', error);
            Alert.alert('Error', 'There was an error while sharing or saving the screenshot.');
        }
    };

    return (
        <Portal>
            <Modal
                visible={visible}
                dismissable={true}
                onDismiss={dismiss}
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: Dimensions.get("window").width,
                    height: Dimensions.get("window").height,
                }}
            >
                <View
                    style={{
                        width: Dimensions.get("window").width - 20,
                        paddingVertical: 30,
                        backgroundColor: "white",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 10,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            alignSelf: "center",
                            marginBottom: 40,
                        }}
                    >
                        <Text
                            style={{
                                fontWeight: "bold",
                                fontSize: 14,
                            }}
                        >
                            Share
                        </Text>
                        <Image
                            source={require("../../Images/logo.png")}
                            style={{
                                width: 78,
                                height: 26,
                                marginStart: 5,
                            }}
                        />
                        <Text
                            style={{
                                fontWeight: "bold",
                                fontSize: 14,
                                marginLeft: 10,
                            }}
                        >
                            with your Family or Friends
                        </Text>
                    </View>
                    <QRCode
                        value={
                            "https://github.com/opliced/crispy-train/releases/download/Production-Release/application-8fdc1e7f-4f24-4e5c-aa21-20f3ccea342a.apk"
                        }
                        size={Dimensions.get("window").width / 2.5}
                    />
                    <TouchableOpacity
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            alignSelf: "center",
                            marginTop: 40,
                            backgroundColor: "blue",
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                            borderRadius: 5,
                        }}
                        onPress={handleImageShare}
                    >
                        <Text
                            style={{
                                color: "white",
                                fontSize: 16,
                                fontWeight: "bold",
                            }}
                        >
                            Share QR Code
                        </Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </Portal>
    );
};

export default QR_share_freinds;
