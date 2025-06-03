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

export default function ControlButton({ backgroundColor = "#f7f6fc", fontWeight = 600, label, color, onPress }) {
    return (
        <Button
            backgroundColor={backgroundColor}
            label={label}
            labelStyle={{
                fontWeight: fontWeight,
                color: color
            }}
            enableShadow
            onPress={onPress}
        />
    );
}