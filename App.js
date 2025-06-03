
import {
    SafeAreaView
} from "react-native";
import Home from "./src/screens/home";
import commonStyle from "./src/theme/commonStyle";

export default function App() {
    return (
        <SafeAreaView style={commonStyle.wrapper}>
            <Home/>
        </SafeAreaView>
    );
}