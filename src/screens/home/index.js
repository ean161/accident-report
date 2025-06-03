import {
    View,
    Text,
    Image,
    Typography
} from "react-native-ui-lib";
import {
    useState,
    useEffect
} from "react";
import CircularSlider from 'react-native-circular-slider';
import Icon from 'react-native-vector-icons/AntDesign';
import commonStyle from "../../theme/commonStyle";
import homeStyle from "../../theme/homeStyle";
import ControlButton from "../../components/controlButton";
import { Pressable } from "react-native";

export default function Home() {
    const wsServer = "ws://160.187.246.117:8070";

    const [ws, setWs] = useState(null);
    const [wsState, setWsState] = useState(false);
    const [wsMessages, setWsMessages] = useState([]);
    const [buzzerTone, setBuzzerTone] = useState(0);
    const [angleLength, setAngleLength] = useState(100);

    const onUpdate = ({ startAngle, angleLength }) => {
        if (startAngle)
            return;
        
        setAngleLength(angleLength);
    };

    const handleStateBtn = () => {
        if (wsState)
            ws.send(`ON_LED`);
    }

    useEffect(() => {
        const angleDeg = angleLength * (180 / Math.PI);
        setBuzzerTone(Math.round(2000/360 * angleDeg).toLocaleString());
    }, [angleLength]);

    useEffect(() => {
        if (wsState)
            ws.send(`SET_BUZZER_TONE|${buzzerTone}`);
    }, [buzzerTone]);

    useEffect(() => {
        const socket = new WebSocket(wsServer);

        socket.onopen = () => {
            setWsState(true);
            socket.send("MOBILE_DEVICE_CONNECTED");
        };

        socket.onmessage = (event) => {
            setWsMessages(prev => [...prev, event.data]);
        };

        socket.onerror = () => {
            setWsState(false);
        }

        setWs(socket);

        return () => {
            socket.close();
        };
    }, []);

    return (
        <View style={commonStyle.wrapper}>
            <View style={homeStyle.header}>
                {/* <Image
                    style={homeStyle.header.icon}
                    source={require("./../../assets/img/icon_trans.png")}
                /> */}
                <Text
                    black
                    text40M
                    style={homeStyle.header.title}
                >Báo va chạm</Text>
                <Pressable
                    children={
                        <Icon
                            name="poweroff"
                            size={25}
                            color="#900"
                        />
                    }
                    onPress={handleStateBtn}
                />
                {/* <Icon source={require("./../../assets/img/icon_trans.png")} size={50} color="red" /> */}
                
            </View>
            <View style={homeStyle.buzzerToneCircular}>
                <Text
                    grey30
                    style={homeStyle.buzzerToneCircular.value}
                >{buzzerTone} Hz</Text>
                <CircularSlider
                    startAngle={0}
                    angleLength={angleLength}
                    onUpdate={onUpdate}
                    segments={5}
                    strokeWidth={40}
                    radius={80}
                    gradientColorFrom="#ff9800"
                    gradientColorTo="#ffcf00"
                    clockFaceColor="#9d9d9d"
                    bgCircleColor="#171717"
                />
                <Text
                    grey30
                    style={homeStyle.buzzerToneCircular.display}
                >Tần số chuông cảnh báo</Text>
            </View>
            <View style={homeStyle.actions}>
                <Text>{wsMessages.join("\n")}</Text>
            </View>
        </View>
    );
}
