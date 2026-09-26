/**
 * useAuthForm.js
 * Custom hook encapsulating all auth form state, validation schemas,
 * and mock submit handlers. Wire up onLoginSubmit/onSignupSubmit
 * to your real auth provider (Firebase, Supabase, NextAuth, etc.)
 */

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

// ─── Validation Schemas ────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

const signupSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Full name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be under 50 characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    terms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// ─── Password Strength Calculator ─────────────────────────────────────────────

export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500' };
  if (score <= 2) return { score: 2, label: 'Fair', color: 'bg-orange-400' };
  if (score <= 3) return { score: 3, label: 'Good', color: 'bg-yellow-400' };
  if (score <= 4) return { score: 4, label: 'Strong', color: 'bg-green-400' };
  return { score: 5, label: 'Excellent', color: 'bg-emerald-500' };
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAuthForm = () => {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const signupForm = useForm({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'login' ? 'signup' : 'login'));
    loginForm.reset();
    signupForm.reset();
  }, [loginForm, signupForm]);

  const toggleDark = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  // Mock Login Submit — replace with your auth provider
  // Firebase: await signInWithEmailAndPassword(auth, data.email, data.password)
  // Supabase: await supabase.auth.signInWithPassword({ email, password })
  const onLoginSubmit = useCallback(async (data) => {
    setIsLoading(true);
    try {
      console.log('[Auth] Login payload:', data);
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (data.email === 'fail@example.com') reject(new Error('Invalid credentials'));
          else resolve({ user: { email: data.email } });
        }, 1800);
      });
      toast.success('Welcome back! Redirecting\u2026', { duration: 3000 });
      loginForm.reset();
    } catch (err) {
      toast.error(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [loginForm]);

  // Mock Signup Submit — replace with your auth provider
  // Firebase: await createUserWithEmailAndPassword(auth, data.email, data.password)
  // Supabase: await supabase.auth.signUp({ email, password })
  const onSignupSubmit = useCallback(async (data) => {
    setIsLoading(true);
    try {
      console.log('[Auth] Signup payload:', data);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success('Account created! Check your email to verify.', { duration: 4000 });
      signupForm.reset();
      setMode('login');
    } catch (err) {
      toast.error(err.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [signupForm]);

  const onSocialLogin = useCallback(async (provider) => {
    setIsLoading(true);
    try {
      console.log('[Auth] Social login:', provider);
      // TODO: signInWithPopup(auth, new GoogleAuthProvider()) etc.
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success('Signed in with ' + provider + '!');
    } catch (err) {
      toast.error(provider + ' login failed.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    mode,
    toggleMode,
    isDark,
    toggleDark,
    isLoading,
    loginForm,
    signupForm,
    onLoginSubmit,
    onSignupSubmit,
    onSocialLogin,
  };
};
