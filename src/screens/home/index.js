import {
    View,
    Text,
    Image,
    Typography,
    Button,
    ButtonSpace,
    Colors,
    Color
} from "react-native-ui-lib";
import {
    useState,
    useEffect
} from "react";
import commonStyle from "../../theme/commonStyle";
import homeStyle from "../../theme/homeStyle";
import CircularSlider from 'react-native-circular-slider';
import Svg, { G, Path } from 'react-native-svg';
import ControlButton from "../../components/controlButton";

export default function Home() {
    const [buzzerTone, setBuzzerTone] = useState(0);
    const [angleLength, setAngleLength] = useState(100);

    const onUpdate = ({ startAngle, angleLength }) => {
        if (startAngle)
            return;
        
        setAngleLength(angleLength);
    };

    useEffect(() => {
        const angleDeg = angleLength * (180 / Math.PI);
        setBuzzerTone(Math.round(2000/360 * angleDeg).toLocaleString());
    }, [angleLength]);

    return (
        <View style={commonStyle.wrapper}>
            <View style={homeStyle.header}>
                <Image
                    style={homeStyle.header.icon}
                    source={require("./../../assets/img/icon_trans.png")}
                />
                
                {/* <Text
                    grey20
                    text50M
                    style={homeStyle.header.title}
                    marginV-10
                >Báo va chạm</Text> */}
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
                
            </View>
        </View>
    );
}
