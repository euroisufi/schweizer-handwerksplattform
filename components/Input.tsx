import React, { useState, useRef } from 'react';
import { StyleSheet, Text, TextInput, View, ViewStyle, TextStyle, TextInputProps, Pressable } from 'react-native';
import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/layout';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  errorStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  leftText?: string;
  rightText?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  leftIcon,
  rightIcon,
  leftText,
  rightText,
  onFocus,
  onBlur,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus && onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur && onBlur(e);
  };

  const handleContainerPress = () => {
    inputRef.current?.focus();
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <Pressable
        style={[
          styles.inputContainer,
          isFocused && styles.focusedInput,
          error && styles.errorInput,
        ]}
        onPress={handleContainerPress}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        {leftText && <View style={styles.leftText}><Text style={styles.textLabel}>{leftText}</Text></View>}
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            (leftIcon || leftText) && styles.inputWithLeftIcon,
            (rightIcon || rightText) && styles.inputWithRightIcon,
            inputStyle,
          ]}
          placeholderTextColor={COLORS.gray[400]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          textAlignVertical={rest.multiline ? 'top' : 'center'}
          {...rest}
        />
        {rightText && <View style={styles.rightText}><Text style={styles.textLabel}>{rightText}</Text></View>}
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </Pressable>
      {error && <Text style={[styles.error, errorStyle]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    ...FONTS.body2,
    color: COLORS.text,
    marginBottom: 8,
    fontWeight: '600' as const,
    fontSize: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderWidth: 1.5,
    borderColor: COLORS.gray[300],
    borderRadius: 12,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    minHeight: 52,
  },
  input: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: COLORS.text,
    ...FONTS.body1,
    fontSize: 16,
    lineHeight: 20,
  },
  inputWithLeftIcon: {
    paddingLeft: 12,
  },
  inputWithRightIcon: {
    paddingRight: 12,
  },
  leftIcon: {
    paddingLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightIcon: {
    paddingRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftText: {
    paddingLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightText: {
    paddingRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textLabel: {
    ...FONTS.body2,
    color: COLORS.textLight,
    fontWeight: '500' as const,
  },
  focusedInput: {
    borderColor: COLORS.modernGreen,
    borderWidth: 2,
    shadowColor: COLORS.modernGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  errorInput: {
    borderColor: COLORS.error,
  },
  error: {
    color: COLORS.error,
    ...FONTS.caption,
    marginTop: 4,
  },
});

export default Input;