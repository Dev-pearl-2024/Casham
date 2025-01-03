import { SafeAreaView } from "react-native-safe-area-context"
import stylesheet from "../../../Elements/Styles"
import { Card, Text, TextInput } from "react-native-paper"
import { Appearance, Dimensions, Image, View } from "react-native"
import { useState } from "react"
import { useColors } from "../../../Elements/Themes/Colors"
import TouchableScale from "@jonny/touchable-scale"
import axios from "axios"
import { baseURL } from "../../../API/baseURL"
import { MaterialIcons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import MobileInput from "../../../Elements/UIElements/MobileInput"
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const Transfer = (props) => {

    const [number, setNumber] = useState("")
    const [mobile, setMobile] = useState('')

    const [selectedCode, setSelectedCode] = useState('');

    const colors = useColors()

    const [detail, setDetail] = useState(null)

    const handleSearch = async (num, code) => {
        const token = await AsyncStorage.getItem("api_token");
        console.log("fsdfda", code.split("+")[1]);



        await axios.get(baseURL + `paymentDetails?phoneNumber=%2B${code.split("+")[1]}${num}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then((rs) => {
            setDetail(rs.data)
            console.log(rs.data);

        }).catch((err) => {
            console.log(err);

            setDetail({
                message: "No Data found"
            })
        })
    }

    const [themeState, setThemeState] = useState(Appearance.getColorScheme())

    const handleMobileInputChange = (code, text) => {
        setSelectedCode(code);

        setMobile(text);
        setNumber(text)
        if (text.length == 8 || text.length == 10) {
            handleSearch(text, code)
        } else {
            setDetail(null)
        }
    };

    const handleNavigationToTransferPage = () => {
        props.navigation.replace("Transaction", {
            data: detail,
            number: number
        })
    }

    return (
        <SafeAreaView style={[stylesheet.container, {
            justifyContent: 'space-between'
        }]}>
            <View style={{
                width: Dimensions.get('window').width,
                alignItems: 'flex-start',
            }}>
                <Image source={require('../../../Elements/Images/logo.png')}
                    style={{
                        width: 100, height: 33.54,
                        marginBottom: 20,
                        left: 20, marginTop: 100
                    }} />
                <Text style={{
                    fontSize: Dimensions.get('window').width / 20,
                    left: 20,
                    fontWeight: 'bold',
                    color: colors.primary
                }}>
                    Transfer Amount
                </Text>
                <Text
                    style={{
                        fontSize: 16,
                        marginTop: 10, left: 20,
                        marginRight: 20
                    }}>Please enter mobile number to whom you want to transfer amount to.</Text>
                <View style={{
                    marginTop: 30,
                    left: 20
                }}>
                    <MobileInput
                        value={mobile}
                        placehoderText={"Enter Mobile Number"}
                        onChangeText={handleMobileInputChange}
                    />
                </View>
                {/* <TextInput label={"Registered Mobile Number"}
                    maxLength={10}
                    left={<TextInput.Icon icon={"phone"} />}
                    mode="outlined"
                    style={{
                        backgroundColor: 'white', width: Dimensions.get('window').width - 40,
                        alignSelf: "center",
                        marginTop: 20, height: 60
                    }} outlineColor="lightgray"
                    value={number} onChangeText={(tx) => {
                        setNumber(tx)
                        if (tx.length == 8) {
                            handleSearch(tx)
                        } else {
                            setDetail(null)
                        }
                    }} /> */}

                {
                    detail ?
                        <Card style={{
                            width: Dimensions.get('window').width - 60,
                            backgroundColor: themeState === "dark" ? "#212121" : "#EFEFEF",
                            marginTop: 30, alignSelf: 'center'
                        }}
                            contentStyle={{
                                paddingVertical: 20,
                                paddingHorizontal: 20,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                            <MaterialIcons name="person" size={30} />
                            <View style={{ flex: 0.98 }}>
                                <Text style={{
                                    fontWeight: 'bold',
                                    fontSize: 18
                                }}>{detail?.Username
                                    }</Text>
                                <Text>{selectedCode}-{number}</Text>

                            </View>
                            <MaterialCommunityIcons style={{
                                fontWeight: "bold"
                            }} name="check" size={24} color="green" />
                        </Card>
                        :
                        null
                }
            </View>
            <TouchableScale style={{
                backgroundColor: colors.primary, width: Dimensions.get('window').width - 40,
                alignSelf: "center",
                marginTop: 20, height: 60,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
                elevation: 3,
                marginBottom: 30
            }} onPress={handleNavigationToTransferPage}>
                <Text style={{
                    color: 'white',
                    fontWeight: 'bold'
                }}>Continue</Text>
            </TouchableScale>
        </SafeAreaView>
    )
}

export default Transfer