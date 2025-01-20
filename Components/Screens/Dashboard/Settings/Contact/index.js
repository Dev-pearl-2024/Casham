import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Dimensions,
} from "react-native";
import { Modalize } from "react-native-modalize";

const { height: screenHeight } = Dimensions.get("window");

const ContactPopup = () => {
  const modalizeRef = useRef(null);

  const phoneNumber = "123-456-7890";

  const makePhoneCall = (number) => {
    Linking.openURL(`tel:${number}`).catch((err) =>
      console.error("Failed to open dialer:", err)
    );
  };

  return (
    <View style={styles.container}>
      <Modalize
        ref={modalizeRef}
        modalHeight={screenHeight / 4}
        adjustToContentHeight={false}
        handlePosition="inside"
        modalStyle={styles.modal}
        alwaysOpen={screenHeight / 4}
        withOverlay={true}
        overlayStyle={styles.overlay}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Contact Us</Text>
          <TouchableOpacity
            style={styles.phoneButton}
            onPress={() => makePhoneCall(phoneNumber)}
          >
            <Text style={styles.phoneText}>{phoneNumber}</Text>
          </TouchableOpacity>
        </View>
      </Modalize>

      {/* Exit Screen */}
      <View style={styles.exitScreen}>
        <TouchableOpacity style={styles.exitButton}>
          <Text style={styles.exitText}>Exit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Blurred background
  },
  modal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  phoneButton: {
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 8,
  },
  phoneText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  exitScreen: {
    position: "absolute",
    bottom: 20, // Position at the bottom
    width: "100%",
    alignItems: "center",
  },
  exitButton: {
    backgroundColor: "#FF6347",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  exitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ContactPopup;
