/**
 * AuthForm.jsx
 * Main auth card — combines Login + Signup with smooth flip/slide animations,
 * glassmorphism styling, dark mode support, and full accessibility.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2, Moon, Sun, Zap } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

import { useAuthForm } from '../hooks/useAuthForm';
import { InputField } from './InputField';
import { PasswordStrength } from './PasswordStrength';
import { SocialButton } from './SocialButton';

// ── Animation variants ─────────────────────────────────────────────────────────

const slideVariants = {
  enterFromRight: { x: 40, opacity: 0 },
  enterFromLeft: { x: -40, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exitToLeft: { x: -40, opacity: 0 },
  exitToRight: { x: 40, opacity: 0 },
};

const shakeVariants = {
  shake: {
    x: [0, -10, 10, -8, 8, -4, 4, 0],
    transition: { duration: 0.5 },
  },
  rest: { x: 0 },
};

const blobVariants = [
  { className: 'top-[-20%] left-[-10%] w-[600px] h-[600px] bg-violet-600/30 animate-blob' },
  { className: 'top-[60%] right-[-15%] w-[500px] h-[500px] bg-fuchsia-600/25 animate-blob animation-delay-2000' },
  { className: 'bottom-[-10%] left-[30%] w-[450px] h-[450px] bg-indigo-600/20 animate-blob animation-delay-4000' },
];

// ── Submit button ──────────────────────────────────────────────────────────────

const SubmitButton = ({ isLoading, isDark, label }) => (
  <motion.button
    type="submit"
    disabled={isLoading}
    className="
      relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600
      px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25
      outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2
      disabled:opacity-60 disabled:cursor-not-allowed
    "
    whileHover={{ scale: isLoading ? 1 : 1.02, y: isLoading ? 0 : -1 }}
    whileTap={{ scale: isLoading ? 1 : 0.98 }}
    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
  >
    {/* Shimmer overlay */}
    <motion.div
      className="absolute inset-0 bg-white/10"
      initial={{ x: '-100%' }}
      whileHover={{ x: '100%' }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    />
    <span className="relative flex items-center justify-center gap-2">
      {isLoading && <Loader2 size={16} className="animate-spin" />}
      {label}
    </span>
  </motion.button>
);

// ── Password toggle button ─────────────────────────────────────────────────────

const EyeToggle = ({ show, onToggle, isDark }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-label={show ? 'Hide password' : 'Show password'}
    className={`transition-colors duration-150 outline-none focus-visible:text-violet-400 ${
      isDark ? 'text-white/30 hover:text-white/70' : 'text-gray-400 hover:text-gray-700'
    }`}
  >
    {show ? <EyeOff size={16} /> : <Eye size={16} />}
  </button>
);

// ── Divider ────────────────────────────────────────────────────────────────────

const Divider = ({ isDark }) => (
  <div className="flex items-center gap-3 my-5">
    <div className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
    <span className={`text-xs ${isDark ? 'text-white/30' : 'text-gray-400'}`}>or continue with</span>
    <div className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
  </div>
);

// ── Main AuthForm ──────────────────────────────────────────────────────────────

export const AuthForm = () => {
  const {
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
  } = useAuthForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const isLogin = mode === 'login';

  // Trigger shake on invalid submit
  const handleInvalidSubmit = () => {
    setShakeKey((k) => k + 1);
  };

  const watchedPassword = signupForm.watch('password');

  const card = isDark
    ? 'bg-white/[0.04] border-white/10 shadow-black/40'
    : 'bg-white/80 border-black/[0.06] shadow-gray-400/20';

  const surface = isDark ? 'text-white' : 'text-gray-900';

  return (
    <>
      {/* ── Toast notifications ───────────────────────────────────────────────── */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: isDark ? '#1a1a2e' : '#fff',
            color: isDark ? '#fff' : '#1a1a2e',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#a855f7', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />

      {/* ── Full-page wrapper ─────────────────────────────────────────────────── */}
      <div
        className={`relative min-h-screen flex items-center justify-center p-4 overflow-hidden transition-colors duration-500 ${
          isDark ? 'bg-[#080810]' : 'bg-slate-50'
        }`}
      >
        {/* ── Animated mesh blobs ─────────────────────────────────────────────── */}
        {blobVariants.map((blob, i) => (
          <div
            key={i}
            className={`pointer-events-none absolute rounded-full blur-3xl ${blob.className}`}
          />
        ))}

        {/* ── Grid overlay ────────────────────────────────────────────────────── */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #8080ff 1px, transparent 1px), linear-gradient(to bottom, #8080ff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* ── Dark mode toggle ─────────────────────────────────────────────────── */}
        <motion.button
          onClick={toggleDark}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className={`
            absolute top-4 right-4 z-20 rounded-full p-2.5 outline-none
            focus-visible:ring-2 focus-visible:ring-violet-500
            ${isDark ? 'bg-white/10 text-white/70 hover:bg-white/20' : 'bg-black/10 text-gray-700 hover:bg-black/15'}
          `}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9, rotate: 30 }}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </motion.button>

        {/* ── Card ─────────────────────────────────────────────────────────────── */}
        <motion.div
          className={`
            relative z-10 w-full max-w-md rounded-2xl border backdrop-blur-xl
            shadow-2xl overflow-hidden ${card}
          `}
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Top accent bar */}
          <div className="h-0.5 w-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-500" />

          <div className="p-8">
            {/* ── Logo / Brand ──────────────────────────────────────────────────── */}
            <div className="flex items-center gap-2 mb-8">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-500/30">
                <Zap size={16} className="text-white" />
              </div>
              <span className={`text-base font-bold tracking-tight ${surface}`}>Gravity</span>
            </div>

            {/* ── Heading (animated per mode) ───────────────────────────────────── */}
            <AnimatePresence mode="wait">
              <motion.div
                key={mode + '-heading'}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.25 }}
                className="mb-6"
              >
                <h1 className={`text-2xl font-bold tracking-tight ${surface}`}>
                  {isLogin ? 'Welcome back' : 'Create account'}
                </h1>
                <p className={`mt-1 text-sm ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
                  {isLogin
                    ? 'Sign in to your account to continue'
                    : 'Get started — it\'s free forever'}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* ── Social login row ──────────────────────────────────────────────── */}
            <div className="flex gap-2">
              {['Google', 'GitHub', 'Apple'].map((p) => (
                <SocialButton
                  key={p}
                  provider={p}
                  onClick={onSocialLogin}
                  isDark={isDark}
                  disabled={isLoading}
                />
              ))}
            </div>

            <Divider isDark={isDark} />

            {/* ── Form (slide animation between login/signup) ───────────────────── */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={mode}
                variants={slideVariants}
                initial={isLogin ? 'enterFromLeft' : 'enterFromRight'}
                animate="center"
                exit={isLogin ? 'exitToRight' : 'exitToLeft'}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* ── Shake wrapper ───────────────────────────────────────────────── */}
                <motion.div
                  key={shakeKey}
                  variants={shakeVariants}
                  animate={shakeKey > 0 ? 'shake' : 'rest'}
                >
                  {isLogin ? (
                    // ════════════════════════════════════════ LOGIN FORM ════════════
                    <form
                      onSubmit={loginForm.handleSubmit(onLoginSubmit, handleInvalidSubmit)}
                      noValidate
                      className="space-y-4"
                    >
                      <InputField
                        id="login-email"
                        label="Email address"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        isDark={isDark}
                        error={loginForm.formState.errors.email?.message}
                        {...loginForm.register('email')}
                      />

                      <InputField
                        id="login-password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        isDark={isDark}
                        error={loginForm.formState.errors.password?.message}
                        rightElement={
                          <EyeToggle
                            show={showPassword}
                            onToggle={() => setShowPassword((v) => !v)}
                            isDark={isDark}
                          />
                        }
                        {...loginForm.register('password')}
                      />

                      {/* Remember me + Forgot */}
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            id="remember-me"
                            className="h-3.5 w-3.5 rounded border-white/20 bg-white/5 accent-violet-500 cursor-pointer"
                            {...loginForm.register('rememberMe')}
                          />
                          <span className={`text-xs ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                            Remember me
                          </span>
                        </label>
                        <button
                          type="button"
                          className="text-xs text-violet-400 hover:text-violet-300 transition-colors outline-none focus-visible:underline"
                          onClick={() => alert('Forgot password flow — wire up to your provider!')}
                        >
                          Forgot password?
                        </button>
                      </div>

                      <SubmitButton isLoading={isLoading} isDark={isDark} label="Sign in" />
                    </form>
                  ) : (
                    // ════════════════════════════════════════ SIGNUP FORM ══════════
                    <form
                      onSubmit={signupForm.handleSubmit(onSignupSubmit, handleInvalidSubmit)}
                      noValidate
                      className="space-y-4"
                    >
                      <InputField
                        id="signup-name"
                        label="Full name"
                        type="text"
                        placeholder="Jane Smith"
                        autoComplete="name"
                        isDark={isDark}
                        error={signupForm.formState.errors.name?.message}
                        {...signupForm.register('name')}
                      />

                      <InputField
                        id="signup-email"
                        label="Email address"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        isDark={isDark}
                        error={signupForm.formState.errors.email?.message}
                        {...signupForm.register('email')}
                      />

                      <div>
                        <InputField
                          id="signup-password"
                          label="Password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Min. 8 chars, 1 uppercase, 1 number"
                          autoComplete="new-password"
                          isDark={isDark}
                          error={signupForm.formState.errors.password?.message}
                          rightElement={
                            <EyeToggle
                              show={showPassword}
                              onToggle={() => setShowPassword((v) => !v)}
                              isDark={isDark}
                            />
                          }
                          {...signupForm.register('password')}
                        />
                        <PasswordStrength password={watchedPassword} />
                      </div>

                      <InputField
                        id="signup-confirm"
                        label="Confirm password"
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        isDark={isDark}
                        error={signupForm.formState.errors.confirmPassword?.message}
                        rightElement={
                          <EyeToggle
                            show={showConfirm}
                            onToggle={() => setShowConfirm((v) => !v)}
                            isDark={isDark}
                          />
                        }
                        {...signupForm.register('confirmPassword')}
                      />

                      {/* Terms */}
                      <div className="space-y-1">
                        <label className="flex items-start gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            id="terms"
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-white/20 bg-white/5 accent-violet-500 cursor-pointer"
                            {...signupForm.register('terms')}
                          />
                          <span className={`text-xs leading-relaxed ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                            I agree to the{' '}
                            <a href="#" className="text-violet-400 hover:underline">Terms of Service</a>{' '}
                            and{' '}
                            <a href="#" className="text-violet-400 hover:underline">Privacy Policy</a>
                          </span>
                        </label>
                        {signupForm.formState.errors.terms && (
                          <p className="text-xs text-red-400 ml-6">
                            {signupForm.formState.errors.terms.message}
                          </p>
                        )}
                      </div>

                      <SubmitButton isLoading={isLoading} isDark={isDark} label="Create account" />
                    </form>
                  )}
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* ── Mode toggle footer ────────────────────────────────────────────── */}
            <p className={`mt-6 text-center text-sm ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={toggleMode}
                className="font-semibold text-violet-400 hover:text-violet-300 transition-colors outline-none focus-visible:underline"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <p className={`absolute bottom-4 text-xs ${isDark ? 'text-white/20' : 'text-gray-400'}`}>
          &copy; {new Date().getFullYear()} Gravity &mdash; Built with React &amp; Framer Motion
        </p>
      </div>
    </>
  );
};
