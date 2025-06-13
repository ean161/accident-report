import { Pressable } from "react-native";
import {
    useState,
    useEffect,
    useRef
} from "react";

import { Picker } from '@react-native-picker/picker';
import {
    View,
    Text
} from "react-native-ui-lib";
import Icon from 'react-native-vector-icons/MaterialIcons';

import ControlButton from "../../components/controlButton";

import homeStyle from "../../theme/homeStyle";
import commonStyle from "../../theme/commonStyle";

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
    const [thredsholdLevel, setThredsholdLevel] = useState("18");
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

    const handleLedBtn = () => {
        setLedState(!ledState);
        sendWs(`${!ledState ? `ON` : `OFF`}_LED`);
    }

    const handleFindBtn = () => {
        sendWs("FIND_VEHICLE");
    }

    const handleThresholdConfig = (itemValue, itemIndex) => {
        sendWs(`THREDSHOLD_LEVEL|${itemValue}`);
        setThredsholdLevel(itemValue);
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
                case "SYNC_LOCATION":
                    if (args[1] != "ERROR")
                        setLocation(args[1]);
                    break;
                case "CHECK_CIRCUIT_CONNECTED_RESPONSE":
                    setIsCircuitConnected(true);
                    bingTimeout.current = Math.floor(Date.now() / 1000);
                    break;
                case "CIRCUIT_IP":
                    if (checkConnectInterval.current)
                        clearInterval(checkConnectInterval.current);

                    checkConnectInterval.current = setInterval(() => {
                        socket.send("CHECK_CIRCUIT_CONNECTED");
                    }, 1000);
                    break;
                case "THRESHOLD_LEVEL":
                case "SYNC_THRESHOLD_LEVEL":
                    setThredsholdLevel((args[1]));
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
                <View style={homeStyle.header.connectState}>
                    <View style={[
                            homeStyle.header.connectState.icon,
                            { backgroundColor: (isCircuitConnected ? Color.danger.default : Color.danger.fade) }
                        ]}
                    >
                        <Icon
                            name={(isCircuitConnected ?
                                "cloud-queue" :
                                "cloud-off"
                            )}
                            size="50"
                            color="white"
                        />
                    </View>
                    <Text marginT-16 center black text30>
                        {(isCircuitConnected ?
                            "Đã kết nối" :
                            "Mất kết nối"
                        )}
                    </Text>
                    <Text>
                        {isCircuitConnected ?
                            location :
                            "Không tìm thấy"}
                    </Text>
                </View>
            </View>
            <View style={homeStyle.thredsholdConfig}>
                <Picker
                    selectedValue={thredsholdLevel}
                    onValueChange={(itemValue, itemIndex) => {
                        handleThresholdConfig(itemValue, itemIndex);
                    }}
                    mode="dropdown"
                    itemStyle={{ color: "black", width: "100" }}
                >
                    {Array.from({ length: 50 }, (_, i) => (
                        <Picker.Item
                            key={i}
                            label={`${i}`}
                            value={i.toString()}
                        />
                    ))}
                </Picker>
            </View>
            <View style={homeStyle.actions}>
                <View columnGap-16 flexDirection="row" justifyContent="space-around" marginT-200>
                    <ControlButton
                        label="TÌM XE"
                        width={210}
                        color="white"
                        backgroundColor={Color.danger.default}
                        onPress={handleFindBtn}
                    />
                    <Pressable
                        marginR-16
                        style={[
                            homeStyle.actions.button,
                            { backgroundColor: (!ledState ? Color.danger.fade : Color.danger.default) }
                        ]}
                        onPress={handleLedBtn}
                    >
                        <Icon
                            name="motion-photos-on"
                            size={35}
                            color="white"
                        />
                    </Pressable>
                    <Pressable
                        marginR-16
                        style={[
                            homeStyle.actions.button,
                            { backgroundColor: (!state ? Color.danger.fade : Color.danger.default) }
                        ]}
                        onPress={handleStateBtn}
                    >
                        <Icon
                            name="bedtime"
                            size={35}
                            color="white"
                        />
                    </Pressable>
                </View>
            </View>
        </View>
    );
}