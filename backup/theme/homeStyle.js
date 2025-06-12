import { 
    StyleSheet
} from "react-native";

const homeStyle = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 16,
        zIndex: 1,
        title: {
            fontFamily: "Comfortaa",
            color: "white"
        },
        connectState: {
            position: "absolute",
            marginTop: 510,
            left: "50%",
            transform: [{ translateX: -200 / 2 }]
        }
    },
    actions: {
        marginTop: 412,
        padding: 32,
        height: "100%",
        // backgroundColor: "white",
        marginHorizontal: -16,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        location: {
            flexDirection: "row",
            color: "white",
            top: -12
            // right: -150
        }
    },
    thredsholdConfig: {
        height: 50,
        right: 10,
        top: 481,
        alignSelf: "flex-end",
        title: {
            // top: 0,
            left: -10,
            color: "white"
        }
    }
});

export default homeStyle;