import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useColors } from "../../../Elements/Themes/Colors";
import { BackButton } from "../../../Elements/UIElements/BackButton";
import { format } from "date-fns";

const { width } = Dimensions.get("window");

const ShowTransaction = (props) => {
    const [data, setData] = useState(props.route.params.data);
    const [type, setType] = useState(props.route.params.type)
    const Colors = useColors();

    useEffect(() => {
        setData(props.route.params.data);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            {/* Green Background with Back Button */}
            <View style={styles.header}>
                <View style={{ alignSelf: "flex-start", marginStart: 20 }}>
                    <BackButton props={props} white />
                </View>

                {/* Circle with Arrow */}
                <View style={styles.iconCircle}>
                    <Feather
                        name={type === "received" ? "arrow-down-left" : "arrow-up-right"}
                        size={width / 10}
                        color={"white"}
                    />
                </View>

                {/* Payment Info */}
                <Text style={styles.amountText}>
                    {data.recipientCurrency} {parseInt(data.amount).toLocaleString()}
                </Text>
                <Text style={styles.successText}>{type == 'sent' ? 'Payment Successful' : 'Payment Received'}</Text>
                <Text style={styles.dateText}>
                    {format(new Date(data.date), "dd MMM yyyy")}
                </Text>
            </View>

            {/* Details Section */}
            <View style={styles.detailsContainer}>
                <Text style={styles.title}>{type == 'sent' ? 'To' : 'From'}</Text>
                <Text style={styles.recipientName}>{data.recipientName || "Unknown Recipient"}</Text>
                <Text style={styles.recipientDetails}>{data.recipientMobileNumber || "N/A"}</Text>
                <View style={styles.divider} />

                <Text style={styles.notesTitle}>Notes</Text>
                <Text style={styles.notesText}>Paid via Casham</Text>
                <View style={styles.divider} />

                <Text style={styles.infoTitle}>Transaction ID</Text>
                <Text style={styles.infoText}>{data.requestId}</Text>

                <Text style={styles.infoTitle}>Transfer Reference</Text>
                <Text style={styles.infoText}>{data.transferRef}</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F1F5F8",
    },
    header: {
        backgroundColor: "#00A86B", // Green Background
        paddingTop: 30,
        paddingBottom: 40,
        alignItems: "center",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    iconCircle: {
        width: width / 6,
        height: width / 6,
        borderRadius: width / 3,
        backgroundColor: "rgba(255, 255, 255, 0.2)", // Semi-transparent white
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    amountText: {
        fontSize: width / 16, // Smaller size
        fontWeight: "bold",
        color: "#FFF",
    },
    successText: {
        fontSize: width / 32,
        color: "#FFF",
        marginTop: 5,
    },
    dateText: {
        fontSize: width / 36,
        color: "#EEE",
        marginTop: 2,
    },
    detailsContainer: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    title: {
        fontWeight: "bold",
        fontSize: width / 38,
        color: "#666",
    },
    recipientName: {
        fontWeight: "bold",
        fontSize: width / 34,
        marginVertical: 5,
    },
    recipientDetails: {
        fontSize: width / 40,
        color: "#666",
    },
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        marginVertical: 10,
    },
    notesTitle: {
        fontWeight: "bold",
        fontSize: width / 38,
        color: "#666",
    },
    notesText: {
        fontSize: width / 34,
        marginVertical: 5,
    },
    infoTitle: {
        fontWeight: "bold",
        fontSize: width / 38,
        color: "#666",
        marginTop: 10,
    },
    infoText: {
        fontSize: width / 34,
        color: "#333",
    },
});

export default ShowTransaction;
