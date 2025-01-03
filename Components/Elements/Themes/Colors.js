import { useEffect, useState } from "react"
import { Appearance } from "react-native"

export const DarkColors = {
    background: '#141414',
    primary: "#2D6AFE",
    secondary: "#73D2B4",
    red: "#DC0000",
    text: "#FFFFFF",
    textSecondary: "gray",
}

export const LightColors = {
    background: '#FFF',
    primary: "#2D6AFE",
    secondary: "#73D2B4",
    red: "#DC0000",
    text: "#000",
    textSecondary: "gray",
}

export const useColors = () => {
    const [themeState, setThemeState] = useState(Appearance.getColorScheme())
    const [colors, setColors] = useState(themeState === 'dark' ? DarkColors : LightColors)

    useEffect(() => {
        const listener = ({ colorScheme }) => {
            setThemeState(colorScheme)
            setColors(colorScheme === 'dark' ? DarkColors : LightColors)
        }

        Appearance.addChangeListener(listener)

    }, [])

    return colors
}
