import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormValues } from '../../validation/authSchema';
import { useAuth } from '../../features/auth/useAuth';



const useReducedMotionFlag = () => false; // swap for AccessibilityInfo.isReduceMotionEnabled if needed

/** 0 → 1 → 0 loop, eased. Runs on the native thread. */
function useLoop(duration: number, delay = 0) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(v, {
          toValue: 1,
          duration,
          delay,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(v, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [v, duration, delay]);
  return v;
}

/** Soft glowing orb that drifts around. Glow is faked with stacked translucent circles (no blur dependency). */
function Orb({
  size,
  color,
  x,
  y,
  dx,
  dy,
  duration,
  delay = 0,
}: {
  size: number;
  color: string;
  x: number; // left, in px
  y: number; // top, in px
  dx: number;
  dy: number;
  duration: number;
  delay?: number;
}) {
  const t = useLoop(duration, delay);
  const translateX = t.interpolate({ inputRange: [0, 1], outputRange: [0, dx] });
  const translateY = t.interpolate({ inputRange: [0, 1], outputRange: [0, dy] });
  const scale = t.interpolate({ inputRange: [0, 1], outputRange: [1, 1.18] });

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        transform: [{ translateX }, { translateY }, { scale }],
      }}
    >
      {[1, 0.78, 0.58, 0.4, 0.24].map((k, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            width: size * k,
            height: size * k,
            left: (size - size * k) / 2,
            top: (size - size * k) / 2,
            borderRadius: size,
            backgroundColor: color,
            opacity: 0.1,
          }}
        />
      ))}
    </Animated.View>
  );
}

/** Rising "chart bar" – echoes the production dashboard theme. */
function Bar({
  left,
  bottom,
  width,
  height,
  color,
  duration,
  delay,
}: {
  left: number;
  bottom: number;
  width: number;
  height: number;
  color: string;
  duration: number;
  delay: number;
}) {
  const t = useLoop(duration, delay);
  const scaleY = t.interpolate({ inputRange: [0, 1], outputRange: [0.45, 1] });
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left,
        bottom,
        width,
        height,
        borderRadius: 4,
        backgroundColor: color,
        opacity: 0.35,
        transform: [{ translateY: height / 2 }, { scaleY }, { translateY: -height / 2 }],
      }}
    />
  );
}

/** Slowly drifting dot grid line – gives the "circuit" feel without images. */
function Pulse({ left, top, delay }: { left: number; top: number; delay: number }) {
  const t = useLoop(2400, delay);
  const opacity = t.interpolate({ inputRange: [0, 1], outputRange: [0.08, 0.6] });
  const scale = t.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.6] });
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left,
        top,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#7dd3c0',
        opacity,
        transform: [{ scale }],
      }}
    />
  );
}

function AnimatedBackground() {
  const { width, height } = useWindowDimensions();
  const w = Math.max(width, 360);
  const h = Math.max(height, 640);

  const pulses = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        left: ((i * 137) % 100) / 100 * w,
        top: ((i * 71 + 13) % 100) / 100 * h,
        delay: i * 260,
      })),
    [w, h],
  );

  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      <LinearGradient
        colors={['#0b0b10', '#14141c', '#0e1a1c']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <Orb size={w * 0.7} color="#a855f7" x={-w * 0.2} y={h * 0.45} dx={60} dy={-50} duration={7000} />
      <Orb size={w * 0.55} color="#14b8a6" x={w * 0.05} y={-h * 0.1} dx={50} dy={60} duration={9000} delay={600} />
      <Orb size={w * 0.6} color="#ec4899" x={w * 0.55} y={h * 0.55} dx={-70} dy={-40} duration={8000} delay={300} />
      <Orb size={w * 0.4} color="#6366f1" x={w * 0.6} y={-h * 0.05} dx={-40} dy={50} duration={10000} delay={900} />

      {pulses.map((p, i) => (
        <Pulse key={i} {...p} />
      ))}

      <Bar left={w * 0.06} bottom={h * 0.08} width={14} height={90} color="#c084fc" duration={2600} delay={0} />
      <Bar left={w * 0.06 + 26} bottom={h * 0.08} width={14} height={140} color="#2dd4bf" duration={3100} delay={300} />
      <Bar left={w * 0.06 + 52} bottom={h * 0.08} width={14} height={110} color="#f472b6" duration={2800} delay={600} />
      <Bar left={w * 0.82} bottom={h * 0.1} width={14} height={120} color="#2dd4bf" duration={3000} delay={200} />
      <Bar left={w * 0.82 + 26} bottom={h * 0.1} width={14} height={80} color="#c084fc" duration={2500} delay={500} />
      <Bar left={w * 0.82 + 52} bottom={h * 0.1} width={14} height={150} color="#818cf8" duration={3300} delay={800} />
    </View>
  );
}

export default function LoginScreen() {
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { employeeCode: '', password: '' },
  });

  // Card entrance (one orchestrated moment, not per-element)
  const enter = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [enter]);

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    setSubmitting(true);
    const result = await login(values);
    setSubmitting(false);
    if (!result.success) setServerError(result.message ?? 'Login failed.');
    // RootNavigator swaps stacks automatically when isAuthenticated changes.
  };

  // Frosted-glass look. backdropFilter only exists on web; native falls back to a translucent fill.
  const glass: any = Platform.select({
    web: { backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' },
    default: {},
  });

  return (
    <View className="flex-1 bg-[#0b0b10]">
      <AnimatedBackground />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerClassName="flex-grow items-center justify-center p-5"
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={[
              {
                width: '100%',
                maxWidth: 420,
                opacity: enter,
                transform: [
                  { translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) },
                ],
              },
            ]}
          >
            <View
              className="w-full rounded-[32px] border border-white/15 bg-white/10 px-6 py-8"
              style={glass}
            >
              {/* Logo */}
              <View className="items-center">
                <View className="rounded-xl bg-white px-3 py-2">
                  <Image
                    source={require('../../../assets/fulllogo.jpg')}
                    style={{ width: 220, height: 64 }}
                    resizeMode="contain"
                  />
                </View>
                <Text className="mb-7 mt-1 text-base text-white/70">Sign in to your account</Text>
              </View>

              {/* Employee code */}
              <Controller
                control={control}
                name="employeeCode"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="rounded-lg border border-white/20 bg-white/10 px-4 py-4 text-base text-white"
                    placeholder="Employee Code"
                    placeholderTextColor="rgba(255,255,255,0.55)"
                    autoCapitalize="characters"
                    autoCorrect={false}
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              {errors.employeeCode ? (
                <Text className="mt-1 text-sm text-red-400">{errors.employeeCode.message}</Text>
              ) : null}

              {/* Password */}
              <View className="mt-4 flex-row items-center rounded-lg border border-white/20 bg-white/10">
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      className="flex-1 px-4 py-4 text-base text-white"
                      placeholder="Password"
                      placeholderTextColor="rgba(255,255,255,0.55)"
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      value={value}
                      onChangeText={onChange}
                      onSubmitEditing={handleSubmit(onSubmit)}
                    />
                  )}
                />
                <Pressable
                  onPress={() => setShowPassword((s) => !s)}
                  hitSlop={10}
                  className="px-4"
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                >
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={22}
                    color="rgba(255,255,255,0.8)"
                  />
                </Pressable>
              </View>
              {errors.password ? (
                <Text className="mt-1 text-sm text-red-400">{errors.password.message}</Text>
              ) : null}

              {serverError ? (
                <Text className="mt-3 text-sm text-red-400">{serverError}</Text>
              ) : null}

              {/* Sign in */}
              <Pressable
                onPress={handleSubmit(onSubmit)}
                disabled={submitting}
                accessibilityRole="button"
                className="mt-6 overflow-hidden rounded-lg active:opacity-80"
              >
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ paddingVertical: 16, alignItems: 'center', justifyContent: 'center' }}
                >
                  {submitting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-base font-semibold text-white">Sign In</Text>
                  )}
                </LinearGradient>
              </Pressable>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
