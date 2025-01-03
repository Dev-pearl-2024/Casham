import { useEffect, useState } from "react";
import { Button, Dialog, Portal, Text } from "react-native-paper";
import { useColors } from "../../Themes/Colors";

export const CustomDialog = ({ dialogMessage, visible, onDismiss, button1, onPress,
  red, settings
}) => {
  const [visibleDialog, setVisibleDialog] = useState(visible);

  const Colors = useColors()

  useEffect(() => {
    setVisibleDialog(visible)
  }, [visible])

  return (
    <Portal>
      <Dialog visible={visibleDialog} onDismiss={onDismiss}
        dismissable={settings ? false : true}>
        <Dialog.Title>Alert</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">{dialogMessage}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onPress} textColor={red ? 'red' : Colors.primary}>{button1}</Button>
          <Button onPress={onDismiss}>{settings ? "Open Settings" : "Cancel"}</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}