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
        }
    },
    actions: {
        marginTop: 200,
        padding: 32,
        height: "100%",
        backgroundColor: "white",
        marginHorizontal: -16,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50
    }
});

export default homeStyle;