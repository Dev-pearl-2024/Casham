import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"
import { Dimensions, Image, View, Text as RNText } from "react-native"
import { Modal, Portal, Text } from "react-native-paper"
import QRCode from "react-native-qrcode-svg"

const QR = ({ visible, dismiss }) => {
    const [qrValue, setQRValue] = useState("")

    const getQR = async () => {
        const qr = await AsyncStorage.getItem("qr")
        console.log("qr", qr)

        // Set qrValue to an empty string if qr is null or invalid
        setQRValue(qr || "")
    }

    useEffect(() => {
        getQR()
    }, [])

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
                        width: Dimensions.get("window").width - 100,
                        paddingVertical: 30,
                        backgroundColor: "white",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 10,
                    }}
                >
                    {qrValue ? (
                        <QRCode value={qrValue} size={Dimensions.get("window").width / 2.5} />
                    ) : (
                        <RNText>Loading QR Code...</RNText> // Show loading text while fetching
                    )}

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            alignSelf: "center",
                            marginTop: 40,
                        }}
                    >
                        <Text
                            style={{
                                fontWeight: "bold",
                                fontSize: 12,
                            }}
                        >
                            Powered By
                        </Text>
                        <Image
                            source={require("../../Images/logo.png")}
                            style={{
                                width: 65,
                                height: 22,
                                marginStart: 5,
                            }}
                        />
                    </View>
                </View>
            </Modal>
        </Portal>
    )
}

export default QR
