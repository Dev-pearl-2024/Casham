import TouchableScale from "@jonny/touchable-scale"
import { Dimensions } from "react-native"
import { useColors } from "../../Themes/Colors"
import { Text } from "react-native-paper"

const CustomButton = ({ label, secondary, onPress,
    internal, disabled
}) => {
    const Colors = useColors()
    return (
        <TouchableScale style={{
            width: internal ? Dimensions.get('window').width - 80 : Dimensions.get('window').width - 50,
            height: Dimensions.get('window').height / 14,
            backgroundColor:disabled? "lightgray" :  secondary ? Colors.secondary : Colors.primary,
            borderRadius: 10,
            alignItems: 'center', justifyContent: 'center'
        }} onPress={onPress}
            disabled={disabled}>
            <Text
                style={{
                    color: 'white', fontWeight: 'bold',
                    fontSize: 16
                }}
            >{label}</Text>
        </TouchableScale>
    )
}

export default CustomButton