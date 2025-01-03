import { Dimensions, View } from "react-native"
import stylesheet from "../../Elements/Styles"
import { BackButton } from "../../Elements/UIElements/BackButton"
import { Divider } from "react-native-paper"
import WebView from "react-native-webview"

const PrivacyPolicy = (props) => {

    const url = "https://www.freeprivacypolicy.com/live/03ba458a-0da8-44d4-a6ea-21b7a7f302ff"
    return (
        <View style={[stylesheet.container]}>
            <View style={{
                alignSelf: 'flex-start',
                marginTop: 45, marginStart: 25
            }}>
                <BackButton props={props} />
            </View>
            <Divider style={{
                width: '100%',
                marginTop: 20, backgroundColor: 'darkgray'
            }} />
            <WebView
                source={{ uri: url }}
                forceDarkOn
                style={{
                    flex: 1,
                    width: Dimensions.get('window').width,
                    height: '100%',
                }} />
        </View>
    )
}

export default PrivacyPolicy