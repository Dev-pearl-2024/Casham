import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"
import { Dimensions, Image, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Button, Card, Modal, Portal, Text } from "react-native-paper"
import QRCode from "react-native-qrcode-svg"

const QR_share_freinds = ({ visible, dismiss }) => {

    return (
        <Portal>
            <Modal visible={visible}
                dismissable={true}
                onDismiss={dismiss}
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: Dimensions.get('window').width,
                    height: Dimensions.get('window').height
                }}>
                <View style={{
                    width: Dimensions.get('window').width - 100, paddingVertical: 30,
                    backgroundColor: 'white',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 10
                }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        alignSelf: 'center',
                        marginBottom: 40,
                    }}>
                        <Text style={{
                            fontWeight: 'bold',
                            fontSize: 14,
                            // marginRight: 10
                        }}>
                            Share
                        </Text>
                        <Image source={require('../../Images/logo.png')}
                            style={{
                                width: 78, height: 26,
                                marginStart: 5
                            }} />
                        <Text style={{
                            fontWeight: 'bold',
                            fontSize: 14,
                            marginLeft: 10
                        }}>with your Family or Friends</Text>
                    </View>
                    <QRCode
                        value={"https://github.com/opliced/crispy-train/releases/download/Production-Release/application-8fdc1e7f-4f24-4e5c-aa21-20f3ccea342a.apk"}
                        size={Dimensions.get('window').width / 2.5} />
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            alignSelf: 'center',
                            marginTop: 40,
                            backgroundColor: "blue",
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                            borderRadius: 5,
                        }}
                        onPress={() => {
                            console.log('Button pressed!');
                        }}
                    >
                        <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
                            Save your Gallery
                        </Text>
                    </TouchableOpacity>

                </View>
            </Modal>
        </Portal>
    )
}

export default QR_share_freinds