/**
 * InputField.jsx
 * Reusable animated input with floating label, error state, and optional
 * right-side action slot (e.g. show/hide password toggle).
 */

import { forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

export const InputField = forwardRef(
  (
    {
      id,
      label,
      type = 'text',
      placeholder,
      error,
      rightElement,
      isDark,
      ...rest
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);

    const baseInput = isDark
      ? 'bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet-500/70 focus:ring-violet-500/20'
      : 'bg-black/5 border-black/10 text-gray-900 placeholder:text-gray-400 focus:border-violet-500/70 focus:ring-violet-500/20';

    const errorInput = isDark
      ? 'border-red-500/60 focus:border-red-500/80 focus:ring-red-500/20'
      : 'border-red-400 focus:border-red-500 focus:ring-red-400/20';

    return (
      <div className="space-y-1.5">
        {/* Label */}
        <label
          htmlFor={id}
          className={`block text-sm font-medium transition-colors duration-150 ${
            isDark ? 'text-white/70' : 'text-gray-700'
          } ${focused ? (isDark ? 'text-violet-400' : 'text-violet-600') : ''}`}
        >
          {label}
        </label>

        {/* Input wrapper */}
        <div className="relative">
          <motion.input
            ref={ref}
            id={id}
            type={type}
            placeholder={placeholder}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`
              w-full rounded-xl border px-4 py-3 text-sm outline-none
              transition-all duration-200 ease-out
              focus:ring-2
              ${rightElement ? 'pr-12' : ''}
              ${baseInput}
              ${error ? errorInput : ''}
            `}
            whileFocus={{ scale: 1.005 }}
            transition={{ duration: 0.15 }}
            {...rest}
          />

          {/* Right slot (e.g., eye toggle) */}
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}
        </div>

        {/* Error message */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              id={`${id}-error`}
              role="alert"
              className="flex items-center gap-1.5 text-xs text-red-400"
              initial={{ opacity: 0, x: -8, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: -8, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <AlertCircle size={12} className="shrink-0" />
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

InputField.displayName = 'InputField';
