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

export default function ControlButton({ backgroundColor = "#d71f17", fontWeight = 600, label, color, onPress }) {
    return (
        <Button
            backgroundColor={backgroundColor}
            label={label}
            labelStyle={{
                fontWeight: fontWeight,
                color: color
            }}
            style={{
                width: 200
            }}
            enableShadow
            onPress={onPress}
            marginB-16
        />
    );
}