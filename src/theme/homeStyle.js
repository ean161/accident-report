import { 
    StyleSheet
} from "react-native";

const homeStyle = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 200,
        zIndex: 1,
        connectState: {
            top: 60,
            alignItems: "center",
            icon: {
                justifyContent: "center",
                alignItems: "center",
                height: 100,
                width: 100,
                borderRadius: 100
            }
        }
    },
    actions: {
        marginTop: 50,
        padding: 32,
        height: "100%",
        marginHorizontal: -16,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        button: {
            height: 45,
            width: 45,
            borderRadius: 50,
            padding: 5
        }
    },
    thredsholdConfig: {
        height: 50,
        right: 0,
        top: -400,
        alignSelf: "flex-end"
    }
});

export default homeStyle;