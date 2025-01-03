import { MaterialIcons } from "@expo/vector-icons"
import { TouchableOpacity, View } from "react-native"

export const BackButton = ({props, white}) => {
    return (
        <TouchableOpacity style={{
            borderWidth: 1,
            width: 40, height: 40,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: 'lightgray',
        }} onPress={()=>{
            props.navigation.goBack()
        }} hitSlop={40}>
            <MaterialIcons name="arrow-back-ios-new" size={22} 
            color={white? 'white' : "gray"}/>
        </TouchableOpacity>

    )
}