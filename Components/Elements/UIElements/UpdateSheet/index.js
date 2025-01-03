import { Dimensions, View } from "react-native"
import { Modal, Portal } from "react-native-paper"
import CustomTextInput from "../TextInput"

const UpdateSheet = ({
    value, email, address,
    visible, dismiss
}) =>{
    return(
        <Portal>
            <Modal style={{alignItems:'center',
                justifyContent:'space-between',
                width:Dimensions.get('window').width,
                height:Dimensions.get('window').height,
                flex:1

            }} visible={visible} onDismiss={dismiss}
            dismissable contentContainerStyle={{
                alignItems:'center',
                justifyContent:'space-between',
                width:Dimensions.get('window').width,
                height:Dimensions.get('window').height,
                flex:1
            }}>
                <View/>
                <View style={{height:200, borderTopEndRadius:25,
                    borderTopStartRadius:25,
                    backgroundColor:'white',
                    width:Dimensions.get('window').width
                }}>
                    <CustomTextInput icon={email? 'email' : 'location-city'}
                    placeholder={email? "Email address" : "Address Details"}/>
                </View>
            </Modal>
        </Portal>
    )
}

export default UpdateSheet