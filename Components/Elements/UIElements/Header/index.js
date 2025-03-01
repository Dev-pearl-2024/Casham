import React, { useEffect, useState } from "react";
import { Animated, Dimensions, Easing, Image, TouchableOpacity, View } from "react-native";
import { Card, Text } from "react-native-paper";
import { useColors } from "../../Themes/Colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";


const Header = ({ visible, profile }) => {

    const animatedPosition = useState(new Animated.Value(0))[0]

    const animateHeader = () => {
        Animated.timing(animatedPosition, {
            toValue: visible ? 0 : profile ? -50 : -100,
            useNativeDriver: false,
            easing: Easing.ease,
            duration: 300
        }).start()
    }

    useEffect(() => {
        animateHeader()
    }, [visible])

    const Colors = useColors()

    return (
        <>
            {visible ?
                <Animated.View style={{
                    width: Dimensions.get('window').width, height: profile ? 160 : 80,
                    backgroundColor: profile ? Colors.primary : 'white',
                    borderBottomWidth: 0.5, borderBottomColor: 'lightgray',
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                    paddingHorizontal: 20, top: animatedPosition,
                    borderTopEndRadius: 0, borderTopStartRadius: 0,
                    borderBottomEndRadius: profile ? 40 : 0, elevation: 10,
                    borderBottomLeftRadius: profile ? 40 : 0
                }} >
                    {profile ?
                        <View style={{
                            width: Dimensions.get('window').width,
                            borderRadius: 40,
                            justifyContent: 'center',
                            alignItems: 'center', alignSelf: 'center',
                            position: 'absolute',
                            bottom: -40, right: 0, left: 0,
                        }}>
                            <Card style={{ borderRadius: 60 }}>
                                <Image source={{ uri: 'https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg' }}
                                    style={{
                                        width: 120, height: 120,
                                        borderRadius: 60,
                                    }} />
                            </Card>
                        </View>
                        :
                        <>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 10 }}>
                                <Image source={require('../../../Elements/Images/standalonelogo.png')}
                                    style={{ width: 30, height: 30 }} />
                                <Text style={{
                                    fontSize: 20, fontWeight: 'bold',
                                    color: Colors.primary
                                }}>Casham</Text>
                            </View>
                            <TouchableOpacity style={{
                                alignItems: 'center',
                                justifyContent: 'center', borderRadius: 5, borderWidth: 1,
                                borderColor: 'darkgray',
                                height: 35, width: 35, marginTop: 10
                            }}>
                                <Ionicons name="notifications-outline" size={20} />
                            </TouchableOpacity>
                        </>}
                </Animated.View>

                :
                profile ?
                    <Animated.View style={{
                        width: Dimensions.get('window').width, height: profile ? 160 : 100,
                        backgroundColor: profile ? Colors.primary : 'white',
                        borderBottomWidth: 0.5, borderBottomColor: 'lightgray',
                        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                        paddingHorizontal: 20, top: animatedPosition,
                        borderTopEndRadius: 0, borderTopStartRadius: 0,
                        borderBottomEndRadius: profile ? 40 : 0, elevation: 10,
                        borderBottomLeftRadius: profile ? 40 : 0
                    }} >
                        {profile ?
                            <View style={{
                                width: Dimensions.get('window').width,
                                borderRadius: 40,
                                justifyContent: 'center',
                                alignItems: 'center', alignSelf: 'center',
                                position: 'absolute',
                                bottom: -40, right: 0, left: 0,
                            }}>
                                <Card style={{ borderRadius: 60 }}>
                                    <Image source={{ uri: 'https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg' }}
                                        style={{
                                            width: 120, height: 120,
                                            borderRadius: 60,
                                        }} />
                                </Card>
                            </View>
                            :
                            <>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 24 }}>
                                    <Image source={require('../../../Elements/Images/standalonelogo.png')}
                                        style={{ width: 30, height: 30 }} />
                                    <Text style={{
                                        fontSize: 20, fontWeight: 'bold',
                                        color: Colors.primary
                                    }}>Casham</Text>
                                </View>
                                <TouchableOpacity style={{
                                    alignItems: 'center',
                                    justifyContent: 'center', borderRadius: 5, borderWidth: 1,
                                    borderColor: 'darkgray',
                                    height: 35, width: 35, marginTop: 24
                                }}>
                                    <Ionicons name="notifications-outline" size={20} />
                                </TouchableOpacity>
                            </>}
                    </Animated.View>
                    :
                    null}
        </>
    )
}

export default Header