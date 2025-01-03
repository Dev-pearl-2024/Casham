import { Appearance, Dimensions, TextInput, View } from "react-native"
import { useColors } from "../../Themes/Colors"
import { Text } from "react-native-paper"
import { MaterialIcons } from "@expo/vector-icons"
import { useEffect, useState } from "react"

const CustomTextInput = ({ value, onChangeText, icon,
    placeholder,
    marginStart, marginTop,
    marginBottom, marginEnd,
    maxLength, internal,
    email
}) => {
    const Colors = useColors()
    const [themeState, setThemeState] = useState(Appearance.getColorScheme())

    useEffect(() => {
        Appearance.addChangeListener(() => {
            setThemeState(Appearance.getColorScheme())
        })
    }, [])

    return (
        <View style={{
            width: internal ? Dimensions.get('window').width - 80 : Dimensions.get('window').width - 50,
            height: Dimensions.get('window').height / 14,
            backgroundColor: internal ? themeState === 'dark' ? "#1A1A1A" : "#DCDCDC"
                : themeState === 'dark' ? "#212121" : '#EFEFEF',
            borderRadius: 10,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            marginTop: marginTop,
            marginStart: marginStart,
            marginBottom: marginBottom,
            marginEnd: marginEnd
        }}>
            <MaterialIcons name={icon} size={24} color={"gray"} />
            <TextInput style={{
                color: Colors.primary,
                fontSize: 14, flex: 1,
                fontWeight: 'bold',
                marginStart: 20,
            }} maxLength={maxLength}
            placeholderTextColor={Colors.textSecondary}
                value={value} onChangeText={onChangeText} placeholder={placeholder}
                cursorColor={Colors.primary}
                inputMode={
                    email ? "email" : "text"
                } />
        </View>

    )
}

export default CustomTextInput