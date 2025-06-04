import {
    View,
    Text,
    Image,
    Typography,
    StackAggregator
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
import { ScrollView } from "react-native-gesture-handler";

export default function Home() {
    const wsServer = "ws://160.187.246.117:8070";

    const [ws, setWs] = useState(null);
    const [wsState, setWsState] = useState(false);
    const [wsMessages, setWsMessages] = useState([]);
    const [angleLength, setAngleLength] = useState(100);

    const [state, setState] = useState(0);
    const [ledState, setLedState] = useState(0);
    const [buzzerState, setBuzzerState] = useState(0);
    const [buzzerFre, setBuzzerFre] = useState(10);

    const onUpdate = ({ startAngle, angleLength }) => {
        if (startAngle || (angleLength < (1/10) * Math.PI) || (angleLength > (19/10) * Math.PI))
            return;
        setAngleLength(angleLength);
    };

    const handleStateBtn = () => {
        let newState = state == 1 ? 0 : 1;
        setState(newState);
        sendWs(`STATE|${newState}`);
    }

    const sendWs = (data) => {
        if (wsState)
            ws.send(data);
    }

    useEffect(() => {
        const angleDeg = angleLength * (180 / Math.PI);
        let cirVal = Math.round(2000/360 * angleDeg);
        setBuzzerFre(Math.round((cirVal - (cirVal % 100))).toString().toLocaleString());
    }, [angleLength]);

    useEffect(() => {
        if (buzzerFre != null)
            sendWs(`BUZZER_TONE|${buzzerFre.toString().replace(",", "")}`);
    }, [buzzerFre]);

    useEffect(() => {
        const socket = new WebSocket(wsServer);

        socket.onopen = () => {
            setWsState(true);
            socket.send("MOBILE_DEVICE_CONNECTED");
        };

        socket.onmessage = (event) => {
            setWsMessages(prev => [...prev, event.data + " ----- " + Math.random()].slice(-20));
            const args = event.data.split("|");

            switch (args[0]) {
                case "SYNC_STATE":
                    setState(parseInt(args[1]));
                    break;
                case "SYNC_LED":
                    setLedState(parseInt(args[1]));
                    break;
                case "SYNC_BUZZER":
                    setBuzzerState(parseInt(args[1]));
                    break;
                case "SYNC_BUZZER_TONE":
                    let hzVal = parseInt(args[1]);

                    if (hzVal < 100 || hzVal > 1900)
                        hzVal = 1000;

                    let cirVal = Math.round((hzVal / 2000) * 360);
                    setAngleLength(cirVal * Math.PI / 180);
                    setBuzzerFre(cirVal - (cirVal / 100));
                    break;
            }
        };

        socket.onerror = () => {
            setWsState(false);
        }

        setWs(socket);

        return () => {
            socket.close();
        };
    }, []);

    useEffect(() => {
        console.log(`LED${ledState}-`);

    }, [ledState]);

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
                            color={(state ? "red" : "green")}
                        />
                    }
                    onPress={handleStateBtn}
                />
                {/* <Icon source={require("./../../assets/img/icon_trans.png")} size={50} color="red" /> */}
                
            </View>
            <View style={homeStyle.buzzerFreCircular}>
                <Text
                    grey30
                    style={homeStyle.buzzerFreCircular.value}
                >{buzzerFre} Hz</Text>
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
                    style={homeStyle.buzzerFreCircular.display}
                >Tần số chuông cảnh báo</Text>
            </View>
            <View style={homeStyle.actions}>
                <View style={{
                    flexDirection: "row",
                    columnGap: 16
                }}>
                    <ControlButton
                        label={(`${!ledState ? `BẬT` : `TẮT`} LED`)}
                        color="black"
                        onPress={() => {
                            setLedState(!ledState);
                            sendWs(`${!ledState ? `ON` : `OFF`}_LED`);
                        }}
                    />
                    <ControlButton
                        label={(`${!buzzerState ? `BẬT` : `TẮT`} CHUÔNG`)}
                        color="black"
                        onPress={() => {
                            setBuzzerState(!buzzerState);
                            sendWs(`${!buzzerState ? `ON` : `OFF`}_SOUND`);
                        }}
                    />
                </View>
                <Text>{wsMessages.join("\n")}</Text>
            </View>
        </View>
    );
}


/*
Quay x/360 => tone => server (tone)

server => push tone ve => 

    */