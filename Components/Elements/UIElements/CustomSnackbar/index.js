import React from "react";
import { Portal, Snackbar } from "react-native-paper";



export const CustomSnackbar = ({ visible, title, onDismissSnackbar, label }) => {
    return (
        <Portal>
            <Snackbar
                visible={visible}
                onDismiss={onDismissSnackbar}
                action={{
                    label: label ? label : 'Okay',
                    onPress: () => {
                        onDismissSnackbar
                    },
                }}>
                {title}
            </Snackbar>
        </Portal>
    )
}