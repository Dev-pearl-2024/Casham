import { useFocusEffect } from "@react-navigation/native";
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
  Image
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const FloatingActionButton = ({ props, setExpanded, expanded }) => {
  //  const [expanded, setExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const [showOverlay, setShowOverlay] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setShowOverlay(false);
      setExpanded(false);
      animation.setValue(0); // Reset animation to initial state
    }, [])
  );

  const toggleMenu = () => {
    if (!expanded) {
      setShowOverlay(true);
    }
    Animated.timing(animation, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      useNativeDriver: true
    }).start(() => {
      if (expanded) {
        setTimeout(() => setShowOverlay(false), 200);
      }
    });
    setExpanded(!expanded);
  };

  const purchaseTranslateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -70]
  });

  const redeemTranslateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -140]
  });

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });

  return (
    <View style={styles.fullScreenContainer}>
      {showOverlay && (
        <TouchableWithoutFeedback onPress={toggleMenu}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      <View style={styles.container}>
        <Animated.View
          style={[
            styles.subButtonContainer,
            { opacity, transform: [{ translateY: redeemTranslateY }] }
          ]}
        >
          {showOverlay && (
            <TouchableOpacity
              style={styles.subButton}
              onPress={() => {
                setExpanded(false);
                props.navigation.navigate("Redeem_Scan");
              }}
            >
              <Icon name="qrcode" size={20} color="#333" />
              <Text style={styles.subButtonText}>Redeem</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        <Animated.View
          style={[
            styles.subButtonContainer,
            { opacity, transform: [{ translateY: purchaseTranslateY }] }
          ]}
        >
          {showOverlay && (
            <TouchableOpacity
              style={styles.subButton}
              onPress={() => props.navigation.navigate("Purchase_Vouchar")}
            >
              {/* <Icon name="dollar" size={20} color="#333" /> */}
              <Image
                style={{ width: 20, height: 20 }}
                source={require("../../../Elements/Images/currency.png")}
              />
              <Text style={styles.subButtonText}>Purchase</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        <TouchableOpacity style={styles.fab} onPress={toggleMenu}>
          <Icon name={expanded ? "times" : "plus"} size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end"
  },
  overlay: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    zIndex: Platform.OS === "android" ? 30 : 0
  },
  container: {
    position: "absolute",
    bottom: 20,
    right: 20,
    alignItems: "center"
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    zIndex: 30
  },
  subButtonContainer: {
    position: "absolute",
    right: 0,
    zIndex: 30
  },
  subButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    width: 110,
    justifyContent:"center"
  },
  subButtonText: {
    marginLeft: 8,
    color: "#333",
    fontWeight: "bold"
  }
});

export default FloatingActionButton;
