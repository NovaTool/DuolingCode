import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { COLORS } from '../constants/colors';

export default function DuoButton({
  title,
  onPress,
  variant = 'primary', // primary | secondary | danger | disabled | correct | wrong
  size = 'large',
  style,
}) {
  const getColors = () => {
    switch (variant) {
      case 'primary':
        return { bg: COLORS.green, shadow: COLORS.greenShadow, text: COLORS.textWhite };
      case 'secondary':
        return { bg: COLORS.background, shadow: COLORS.border, text: COLORS.blue, border: COLORS.blue };
      case 'danger':
        return { bg: COLORS.red, shadow: COLORS.redDark, text: COLORS.textWhite };
      case 'correct':
        return { bg: COLORS.green, shadow: COLORS.greenShadow, text: COLORS.textWhite };
      case 'wrong':
        return { bg: COLORS.red, shadow: COLORS.redDark, text: COLORS.textWhite };
      case 'disabled':
        return { bg: COLORS.border, shadow: COLORS.borderDark, text: COLORS.textLight };
      default:
        return { bg: COLORS.green, shadow: COLORS.greenShadow, text: COLORS.textWhite };
    }
  };

  const colors = getColors();
  const isDisabled = variant === 'disabled';

  return (
    <TouchableOpacity
      onPress={isDisabled ? null : onPress}
      activeOpacity={0.85}
      style={style}
    >
      <View
        style={[
          styles.shadow,
          { backgroundColor: colors.shadow },
          size === 'small' && styles.shadowSmall,
        ]}
      />
      <View
        style={[
          styles.button,
          { backgroundColor: colors.bg },
          colors.border && { borderWidth: 2, borderColor: colors.border },
          size === 'small' && styles.buttonSmall,
        ]}
      >
        <Text
          style={[
            styles.text,
            { color: colors.text },
            size === 'small' && styles.textSmall,
          ]}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  shadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 52,
    borderRadius: 16,
    transform: [{ translateY: 4 }],
  },
  shadowSmall: {
    height: 40,
    borderRadius: 12,
  },
  button: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSmall: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  textSmall: {
    fontSize: 14,
  },
});
