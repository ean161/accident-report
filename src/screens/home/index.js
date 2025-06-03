import {
    View,
    Text,
    Image
} from "react-native-ui-lib";
import {
    useState,
    useEffect
} from "react";
import commonStyle from "../../theme/commonStyle";
import homeStyle from "../../theme/homeStyle";
import CircularSlider from 'react-native-circular-slider';
import Svg, { G, Path } from 'react-native-svg';

const WAKE_ICON = (
  <G>
    <Path d="M2,12.9h1.7h3h2.7h3H14c0.4,0,0.7-0.3,0.7-0.7c0-0.4-0.3-0.7-0.7-0.7c-0.9,0-1.7-0.7-1.7-1.7v-4
      c0-2.1-1.5-3.8-3.4-4.2C9,1.6,9,1.4,9,1.3c0-0.5-0.4-1-1-1c-0.5,0-1,0.4-1,1c0,0.2,0,0.3,0.1,0.4c-2,0.4-3.4,2.1-3.4,4.2v4
      c0,0.9-0.7,1.7-1.7,1.7c-0.4,0-0.7,0.3-0.7,0.7C1.3,12.6,1.6,12.9,2,12.9z"/>
    <Path d="M8,15.7c1.1,0,2.1-0.9,2.1-2.1H5.9C5.9,14.8,6.9,15.7,8,15.7z"/>
  </G>
);

const TEST_ICON = (
	<G>
		<Path d="M491.52,245.799h-68.28l-45.957-110.285c-3.379-8.11-11.633-13.046-20.275-12.554
			c-8.724,0.594-16.138,6.677-18.391,15.155L278.815,362.31L214.589,57.24c-1.864-8.827-9.277-15.401-18.268-16.179
			c-9.052-1.003-17.428,4.403-20.767,12.78l-76.78,191.939H20.48c-11.305,0-20.48,9.175-20.48,20.48
			c0,11.326,9.175,20.48,20.48,20.48h92.16c8.376,0,15.913-5.1,19.026-12.882l56.791-141.988l67.994,322.929
			c1.946,9.277,10.015,15.995,19.497,16.261c0.164,0,0.348,0,0.532,0c9.257,0,17.408-6.226,19.784-15.176l66.396-248.996
			l28.037,67.277c3.174,7.619,10.65,12.595,18.903,12.595h81.92c11.325,0,20.48-9.155,20.48-20.48
			C512,254.974,502.845,245.799,491.52,245.799z"/>
	</G>
);

const BEDTIME_ICON = (
  <G>
    <Path d="M11.7,10.5c-3.6,0-6.4-2.9-6.4-6.4c0-0.7,0.1-1.4,0.4-2.1C3.1,2.9,1.2,5.3,1.2,8.1c0,3.6,2.9,6.4,6.4,6.4
      c2.8,0,5.2-1.8,6.1-4.4C13.1,10.4,12.4,10.5,11.7,10.5z"/>
    <Path d="M8,7.6l2-2.5H8V4.4H11v0.6L9,7.6h2v0.7H8V7.6z"/>
    <Path d="M11.7,5.4l1.5-1.9h-1.4V3h2.2v0.5l-1.5,1.9h1.5v0.5h-2.2V5.4z"/>
    <Path d="M9.4,3l1.1-1.4h-1V1.3H11v0.4L9.9,3H11v0.4H9.4V3z"/>
  </G>
);

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
            <Text>Its workinggg</Text>
            <View style={homeStyle.buzzerToneCircular}>
                <Text style={homeStyle.buzzerToneDisplay}>{buzzerTone} Hz</Text>
                <CircularSlider
                    startAngle={0}
                    angleLength={angleLength}
                    onUpdate={onUpdate}
                    segments={5}
                    strokeWidth={40}
                    radius={70}
                    gradientColorFrom="#ff9800"
                    gradientColorTo="#ffcf00"
                    clockFaceColor="#9d9d9d"
                    bgCircleColor="#171717"
                />
            </View>
        </View>
    );
}
