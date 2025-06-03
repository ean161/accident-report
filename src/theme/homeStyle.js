import { 
    StyleSheet
} from "react-native";

const homeStyle = StyleSheet.create({
    buzzerToneCircular: {
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        height: 290,
        value: {
            position: "absolute"
        },
        display: {
            position: "absolute",
            bottom: 10
        }
    },
    header: {
        flexDirection: "row",
        icon: {
            width: 50,
            height: 50,
            resizeMode: "contain"
        },
        title: {
            marginLeft: 16,
            fontFamily: "Comfortaa"
        }
    },
    actions: {
        marginTop: 32,
        padding: 32,
        height: "100%",
        backgroundColor: "white",
        marginHorizontal: -16,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50
    }
});

export default homeStyle;