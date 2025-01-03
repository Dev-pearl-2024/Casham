
import { CameraView } from "expo-camera";
import { useState, useEffect } from "react";
import { Dimensions, Image, Linking, View } from "react-native";
import { BackButton } from "../../Elements/UIElements/BackButton";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCameraPermissionsAsync } from "expo-image-picker";
import { baseURL } from "../../API/baseURL";
import { BarCodeScanner } from "expo-barcode-scanner";

const QRScanner = (props) => {
    const [isScanned, setIsScanned] = useState(false); // Tracks if QR has been scanned

    const decodeQR = async (data) => {
        try {
            console.log(data);
            
            const token = await AsyncStorage.getItem('api_token');
            if (!token) {
                console.error("API token is missing");
                return;
            }

            await axios.get(baseURL+'Charger', {
                params: { Code: data },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((rs) => {
                console.log(rs.data);
                if (rs.data.status == 200) {
                    props.navigation.replace("Transaction", {
                        data: rs.data.message
                    })
                } else {
                    alert(rs.data.message)
                    props.navigation.goBack()
                }
                ;
            }).catch((err) => {
                alert(err.response.data.message)
            });


        } catch (error) {
            console.error("Error decoding QR:", error?.response?.data || error.message);
        } finally {
            setIsScanned(false); // Allow scanning again if needed
        }
    };

    const RequestPermission = () => {
        BarCodeScanner.requestPermissionsAsync().then((rs)=>{
            if (!rs.granted) {
                alert("Please provide camera permission for QR Scanner to work as expected.");
                Linking.openSettings()
            }else if(rs.canAskAgain){
                BarCodeScanner.requestPermissionsAsync()
            }
        })
        
    };

    useEffect(() => {
        RequestPermission();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <CameraView
                facing="back"
                barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                style={{ flex: 1 }}
                onBarcodeScanned={(rs) => {
                    if (!isScanned) {
                        setIsScanned(true); // Prevent further scans
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
                    justifyContent: "center",
                }}
            >
                <Image
                    source={require("../../Elements/Images/qrlayer.png")}
                    style={{
                        width: Dimensions.get("window").width,
                        height: Dimensions.get("window").height,
                    }}
                />
                <View
                    style={{
                        position: "absolute",
                        top: 30,
                        left: 25,
                    }}
                >
                    <BackButton props={props} />
                </View>
            </View>
        </View>
    );
};

export default QRScanner;
