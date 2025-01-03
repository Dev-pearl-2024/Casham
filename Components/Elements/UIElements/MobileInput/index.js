import React, { useEffect, useState } from "react";
import { Appearance, Dimensions, TextInput, View, TouchableOpacity } from "react-native";
import { useColors } from "../../Themes/Colors";
import { Modal, Text } from "react-native-paper";
import { FlatList } from "react-native";


const countryCodes = [
    { code: "+232", country: "Sierra Leone", flag: "🇸🇱" },
    { code: "+1", country: "US", flag: "🇺🇸" },
    { code: "+91", country: "India", flag: "🇮🇳" },
    { code: "+44", country: "UK", flag: "🇬🇧" },
    { code: "+61", country: "Australia", flag: "🇦🇺" },
    { code: "+49", country: "Germany", flag: "🇩🇪" },
    { code: "+33", country: "France", flag: "🇫🇷" },
    { code: "+39", country: "Italy", flag: "🇮🇹" },
    { code: "+81", country: "Japan", flag: "🇯🇵" },
    { code: "+86", country: "China", flag: "🇨🇳" },
    { code: "+7", country: "Russia", flag: "🇷🇺" },
    { code: "+55", country: "Brazil", flag: "🇧🇷" },
    { code: "+34", country: "Spain", flag: "🇪🇸" },
    { code: "+971", country: "UAE", flag: "🇦🇪" },
    { code: "+27", country: "South Africa", flag: "🇿🇦" },
    { code: "+64", country: "New Zealand", flag: "🇳🇿" },
    { code: "+82", country: "South Korea", flag: "🇰🇷" },
    { code: "+94", country: "Sri Lanka", flag: "🇱🇰" },
    { code: "+62", country: "Indonesia", flag: "🇮🇩" },
    { code: "+60", country: "Malaysia", flag: "🇲🇾" },
    { code: "+65", country: "Singapore", flag: "🇸🇬" },
    { code: "+234", country: "Nigeria", flag: "🇳🇬" },
    { code: "+212", country: "Morocco", flag: "🇲🇦" },
    { code: "+356", country: "Malta", flag: "🇲🇹" },
    { code: "+380", country: "Ukraine", flag: "🇺🇦" },
    { code: "+353", country: "Ireland", flag: "🇮🇪" },
    { code: "+46", country: "Sweden", flag: "🇸🇪" },
    { code: "+41", country: "Switzerland", flag: "🇨🇭" },
    { code: "+52", country: "Mexico", flag: "🇲🇽" },
    { code: "+98", country: "Iran", flag: "🇮🇷" },
    { code: "+54", country: "Argentina", flag: "🇦🇷" },
    { code: "+63", country: "Philippines", flag: "🇵🇭" },
    { code: "+90", country: "Turkey", flag: "🇹🇷" },
    { code: "+66", country: "Thailand", flag: "🇹🇭" },
    { code: "+92", country: "Pakistan", flag: "🇵🇰" },
];



const MobileInput = ({ value, onChangeText, marginTop, placehoderText }) => {
    const Colors = useColors();
    const [themeState, setThemeState] = useState(Appearance.getColorScheme());
    const [selectedCode, setSelectedCode] = useState("+232");
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState("🇸🇱");

    const handleSelectedCountry = (flag) => {
        setSelectedCountry(flag);
    };

    useEffect(() => {
        const subscription = Appearance.addChangeListener(() => {
            setThemeState(Appearance.getColorScheme());
        });
        return () => subscription.remove();
    }, []);

    const handleCodeSelect = (code) => {
        setSelectedCode(code);
        setModalVisible(false);
    };

    return (
        <View>
            {/* Input Container */}
            <View
                style={{
                    width: Dimensions.get("window").width - 50,
                    height: isModalVisible ? 400 : Dimensions.get("window").height / 13,
                    backgroundColor: themeState === "dark" ? "#212121" : "#EFEFEF",
                    borderRadius: 10,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingHorizontal: 20,
                    marginTop: marginTop,
                }}
            >
                {/* Country Code Selector */}
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Text
                        style={{
                            fontSize: 16,
                            color: "gray",
                            fontWeight: "bold",
                        }}
                    >
                        {selectedCountry} {selectedCode} | {" "}
                    </Text>
                </TouchableOpacity>
                {/* Mobile Number Input */}
                <TextInput
                    style={{
                        color: Colors.primary,
                        fontSize: 16,
                        flex: 1,
                        fontWeight: "bold",
                    }}
                    maxLength={10}
                    inputMode="tel"
                    placeholderTextColor={Colors.textSecondary}
                    value={value}
                    onChangeText={(text) => onChangeText(selectedCode, text)}  
                    placeholder={"9123491234"}
                    cursorColor={Colors.primary}
                />
            </View>

            {/* Country Code Selector Modal */}
            <Modal
                visible={isModalVisible}
                onDismiss={() => { setModalVisible(false) }}
                dismissable
                style={{ marginTop: 0, justifyContent: "center", height: 400 }}
            >
                <View
                    style={{
                        backgroundColor: themeState === "dark" ? "black" : "white",
                        padding: 20,
                        borderRadius: 10,
                    }}
                >
                    <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
                        Select Country Code
                    </Text>
                    <FlatList
                        data={countryCodes}
                        keyExtractor={(item) => item.code}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => {
                                handleCodeSelect(item.code);
                                handleSelectedCountry(item.flag);
                            }}>
                                <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}>
                                    <Text style={{ fontSize: 18, marginRight: 10 }}>{item.flag}</Text>
                                    <Text style={{ fontSize: 16 }}>{`${item.code} - ${item.country}`}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </Modal>
        </View>
    );
};

export default MobileInput;
