import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormValues } from '../../validation/authSchema';
import { useAuth } from '../../features/auth/useAuth';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { colors, spacing, typography, radii } from '../../constants/theme';

/**
 * React Hook Form: register inputs via `Controller`, validate with the
 * Zod schema via `zodResolver`. Angular comparison: like building a
 * ReactiveForm with `FormGroup` + `Validators`, except the "form group"
 * (useForm) lives inside the component function rather than being
 * assigned to a class field — there's no component class here at all,
 * LoginScreen is a plain function.
 *
 * Demo credentials (mock repository): EMP1001 / password123
 */
export default function LoginScreen() {
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { employeeCode: '', password: '' },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    setSubmitting(true);
    const result = await login(values);
    setSubmitting(false);
    if (!result.success) {
      setServerError(result.message ?? 'Login failed.');
    }
    // No manual navigation call needed here — RootNavigator watches
    // isAuthenticated from useAuth()/useSessionStore and swaps stacks
    // automatically. See navigation/RootNavigator.tsx.
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.brand}>FootPro</Text>
        <Text style={styles.subtitle}>Sign in to mark your attendance</Text>

        <Controller
          control={control}
          name="employeeCode"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Employee Code"
              autoCapitalize="characters"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.employeeCode ? (
          <Text style={styles.fieldError}>{errors.employeeCode.message}</Text>
        ) : null}

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.password ? (
          <Text style={styles.fieldError}>{errors.password.message}</Text>
        ) : null}

        {serverError ? <Text style={styles.fieldError}>{serverError}</Text> : null}

        <PrimaryButton
          label="Log In"
          loading={submitting}
          onPress={handleSubmit(onSubmit)}
          style={styles.button}
        />

        <Text style={styles.hint}>Demo: EMP1001 / password123</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, justifyContent: 'center', padding: spacing.lg },
  brand: { ...typography.h1, color: colors.primary, textAlign: 'center' },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
    ...typography.body,
  },
  fieldError: { color: colors.danger, ...typography.caption, marginBottom: spacing.sm },
  button: { marginTop: spacing.md },
  hint: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
