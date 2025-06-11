import {
    View,
    Text,
    Image,
    Typography,
    StackAggregator
} from "react-native-ui-lib";
import {
    useState,
    useEffect,
    useRef,
    Colors
} from "react";
import Icon from 'react-native-vector-icons/MaterialIcons';
import commonStyle from "../../theme/commonStyle";
import homeStyle from "../../theme/homeStyle";
import ControlButton from "../../components/controlButton";
import { Pressable } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Color from "./../../utils/color";

export default function Home() {
    const wsServer = "ws://160.187.246.117:8070";
    const checkConnectInterval = useRef(null);
    const bingTimeout = useRef(Math.floor(Date.now() / 1000));

    const [ws, setWs] = useState(null);
    const [wsState, setWsState] = useState(false);
    const [wsMessages, setWsMessages] = useState([]);

    const [state, setState] = useState(0);
    const [ledState, setLedState] = useState(0);
    const [buzzerState, setBuzzerState] = useState(0);
    const [location, setLocation] = useState("");
    const [isCircuitConnected, setIsCircuitConnected] = useState(false);

    const sendWs = (data) => {
        if (wsState)
            ws.send(data);
    }
    
    const handleStateBtn = () => {
        let newState = state == 1 ? 0 : 1;
        setState(newState);
        sendWs(`STATE|${newState}`);
    }

    useEffect(() => {
        const socket = new WebSocket(wsServer);

        socket.onopen = () => {
            setWsState(true);
            socket.send("MOBILE_DEVICE_CONNECTED");
            socket.send("CHECK_CIRCUIT_CONNECTED");
        };

        socket.onmessage = (event) => {
            setWsMessages(prev => [...prev, event.data + ";" + Math.floor(Math.random() * 10000)].slice(-20));
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
                case "SYNC_LOCATION":
                    if (args[1] != "ERROR")
                        setLocation(args[1]);
                    break;
                case "CHECK_CIRCUIT_CONNECTED_RESPONSE":
                    setIsCircuitConnected(true);
                    bingTimeout.current = Math.floor(Date.now() / 1000);
                    break;
                case "CIRCUIT_IP":
                    if (checkConnectInterval.current) {
                        clearInterval(checkConnectInterval.current);
                    }

                    checkConnectInterval.current = setInterval(() => {
                        socket.send("CHECK_CIRCUIT_CONNECTED");
                    }, 1000);
                    break;
                case "CLIENT_DISCONNECTED":
                case "CIRCUIT_DEVICE_CONNECTED":
                    //
                    break;
                default:
                    break;
            }
        };

        socket.onerror = () => {
            setWsState(false);
        }

        setWs(socket);

        return () => {
            socket.close();
            if (checkConnectInterval.current) {
                clearInterval(checkConnectInterval.current);
            }
        };
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Math.floor(Date.now() / 1000);
            if (now - bingTimeout.current > 5) {
                setIsCircuitConnected(false);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [])

    return (
        <View style={commonStyle.wrapper}>
            <View style={homeStyle.header}>
                <Text
                    black
                    text40M
                    style={homeStyle.header.title}
                >Báo va chạm</Text>
                <Pressable
                    children={
                        <Icon
                            name="connect-without-contact"
                            size={30}
                            color={(state ? Color.success.fade : "white")}
                        />
                    }
                    onPress={handleStateBtn}
                />
                <View style={homeStyle.header.connectState}>
                    <Icon
                        name={(isCircuitConnected ? "cloud-queue" : "cloud-off")}
                        size="150"
                        color="white"
                    />
                    <Text center white>
                        {(isCircuitConnected ?
                            "Đã kết nối" :
                            "Mất kết nối"
                        )}
                    </Text>
                </View>
            </View>
            <View style={homeStyle.actions}>
                <View marginB-16 style={homeStyle.actions.location}>
                    <Icon
                        name="location-on"
                        color={Color.danger.default}
                        size={16}
                    />
                    <Text marginL-5 style={{
                        color: Color.danger.default
                    }}>{isCircuitConnected ? location : "Không tìm thấy"}</Text>
                </View>
                <View style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    columnGap: 16
                }}>
                    <ControlButton
                        label={(`${!ledState ? `BẬT` : `TẮT`} LED`)}
                        color={(!ledState ? Color.danger.default : Color.danger.fade)}
                        backgroundColor={(!ledState ? Color.danger.fade : Color.danger.default)}
                        onPress={() => {
                            setLedState(!ledState);
                            sendWs(`${!ledState ? `ON` : `OFF`}_LED`);
                        }}
                    />
                    <ControlButton
                        label={(`${!buzzerState ? `BẬT` : `TẮT`} CHUÔNG`)}
                        color={(!buzzerState ? Color.danger.default : Color.danger.fade)}
                        backgroundColor={(!buzzerState ? Color.danger.fade : Color.danger.default)}
                        onPress={() => {
                            setBuzzerState(!buzzerState);
                            sendWs(`${!buzzerState ? `ON` : `OFF`}_SOUND`);
                        }}
                    />
                </View>
                <Text marginT-16>{wsMessages.join("\n")}</Text>
            </View>
        </View>
    );
}