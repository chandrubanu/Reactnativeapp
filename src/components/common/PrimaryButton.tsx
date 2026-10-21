import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, ActivityIndicator, View, ViewStyle } from 'react-native';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  className?: string;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
}

/**
 * `Pressable` is RN's modern touch-handling primitive (successor to
 * `TouchableOpacity`). Styled with NativeWind (Tailwind) className strings.
 */
export function PrimaryButton({ label, onPress, disabled, loading, style, className: extraClassName, icon }: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={style}
      className={[
        'rounded-3xl py-4 items-center justify-center',
        disabled || loading ? 'bg-primaryDisabled' : 'bg-primary active:bg-primaryDark',
        extraClassName ?? '',
      ].join(' ')}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {icon && <Ionicons name={icon} size={22} color="#FFFFFF" />}
          <Text className="text-white text-[17px] font-semibold">{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

