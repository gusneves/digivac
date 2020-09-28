import {StyleSheet} from 'react-native';

export default class StyleSheetFactory {
    static getSheet(boxPadding, boxWidth, boxColor,
                    boxBorderWidth, boxMargin,
                    boxBorderRadius, boxBorderColor, boxHeight) {
        return StyleSheet.create({
            box : {
                padding:boxPadding, 
                width: boxWidth,
                backgroundColor: boxColor,
                //margin: boxMargin,
                //borderWidth: boxBorderWidth,
                borderRadius: boxBorderRadius,
                borderColor: boxBorderColor,
                height: boxHeight
            }
        })
    }
}

