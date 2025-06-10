import { 
    StyleSheet
} from "react-native";

const homeStyle = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 16,
        title: {
            fontFamily: "Comfortaa",
            color: "white"
        },
        connectState: {
            position: "absolute",
            marginTop: 210,
            left: "50%",
            transform: [{ translateX: -150 / 2 }]
        }
    },
    actions: {
        marginTop: 200,
        padding: 32,
        height: "100%",
        backgroundColor: "white",
        marginHorizontal: -16,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        location: {
            flexDirection: "row",
            justifyContent: "flex-end"
        }
    }
});

export default homeStyle;