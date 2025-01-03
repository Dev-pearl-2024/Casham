import AsyncStorage from "@react-native-async-storage/async-storage"
import { baseURL } from "./baseURL"
import { useEffect } from "react"
import axios from "axios"

const CheckSession = ({ props }) => {

    const RequestSessionCheck = async () => {
        const device_token = await AsyncStorage.getItem("device_token")
        const api_token = await AsyncStorage.getItem("api_token")
        await axios.get(`${baseURL}login`, {
            params: {
                token: device_token,
            },
            headers: {
                'Authorization': `Bearer ${api_token}`
            }
        }).then((rs) => {
            if (!rs.data.status == 202) {
                props.navigation.reset(
                    {
                        index: 0,
                        routes: [{ name: 'Login' }],
                    },
                )
            } else {
                console.log("Here");

            }

        }).catch((err) => {
            console.log(err);

        })
    }

    useEffect(() => {
        RequestSessionCheck()
    }, [])
}

export default CheckSession