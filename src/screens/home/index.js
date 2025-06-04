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
    const [angleLength, setAngleLength] = useState(100);

    const [dvcLed, setDvcLed] = useState(0);
    const [dvcBuzzer, setDvcBuzzer] = useState(0);
    const [buzzerTone, setBuzzerTone] = useState(10);

    const onUpdate = ({ startAngle, angleLength }) => {
        if (startAngle || (angleLength < (1/10) * Math.PI) || (angleLength > (19/10) * Math.PI))
            return;
        setAngleLength(angleLength);
    };

    const handleStateBtn = () => {
        sendWs("ON_LED");
    }

    const sendWs = (data) => {
        if (wsState)
            ws.send(data);
    }

    useEffect(() => {
        const angleDeg = angleLength * (180 / Math.PI);
        let cirVal = Math.round(2000/360 * angleDeg);
        setBuzzerTone(Math.round((cirVal - (cirVal % 100))).toString().toLocaleString());
    }, [angleLength]);

    useEffect(() => {
        if (buzzerTone != null)
            sendWs(`BUZZER_TONE|${buzzerTone.toString().replace(",", "")}`);
    }, [buzzerTone]);

    useEffect(() => {
        const socket = new WebSocket(wsServer);

        socket.onopen = () => {
            setWsState(true);
            socket.send("MOBILE_DEVICE_CONNECTED");
        };

        socket.onmessage = (event) => {
            setWsMessages(prev => [...prev, event.data]);

            const args = event.data.split("|");

            switch (args[0]) {
                case "SYNC_LED":
                    setDvcLed(parseInt(args[1]));
                    break;
                case "SYNC_BUZZER":
                    setDvcBuzzer(parseInt(args[1]));
                    break;
                case "SYNC_BUZZER_TONE":
                    let hzVal = parseInt(args[1]);

                    if (hzVal < 100 || hzVal > 1900)
                        hzVal = 1000;
                    
                    let cirVal = Math.round((hzVal / 2000) * 360);
                    setAngleLength(cirVal * Math.PI / 180);
                    setBuzzerTone(cirVal - (cirVal / 100));
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
        console.log(`LED${dvcLed}-`);

    }, [dvcLed]);

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
                <View style={{
                    flexDirection: "row",
                    columnGap: 16
                }}>
                    <ControlButton
                        label={(`${dvcLed == 0 ? `BẬT` : `TẮT`} LED`)}
                        color="black"
                        onPress={() => {
                            setDvcLed(!dvcLed);
                            sendWs(`${dvcLed == 0 ? `ON` : `OFF`}_LED`);
                        }}
                    />
                    <ControlButton
                        label={(`${dvcBuzzer == 0 ? `BẬT` : `TẮT`} CHUÔNG`)}
                        color="black"
                        onPress={() => {
                            setDvcBuzzer(!dvcBuzzer);
                            sendWs(`${dvcBuzzer == 0 ? `ON` : `OFF`}_SOUND`);
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