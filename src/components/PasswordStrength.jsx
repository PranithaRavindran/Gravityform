/**
 * PasswordStrength.jsx
 * Animated password strength indicator with color-coded bar segments
 */

import { motion } from 'framer-motion';
import { getPasswordStrength } from '../hooks/useAuthForm';

const SEGMENTS = 5;

export const PasswordStrength = ({ password }) => {
  const { score, label, color } = getPasswordStrength(password);

  if (!password) return null;

  return (
    <motion.div
      className="mt-2 space-y-1.5"
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Segmented bar */}
      <div className="flex gap-1">
        {Array.from({ length: SEGMENTS }).map((_, i) => (
          <motion.div
            key={i}
            className="h-1 flex-1 rounded-full overflow-hidden bg-white/10"
          >
            <motion.div
              className={`h-full rounded-full ${i < score ? color : ''}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: i < score ? 1 : 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              style={{ originX: 0 }}
            />
          </motion.div>
        ))}
      </div>

      {/* Label */}
      <div className="flex justify-between items-center">
        <p
          className={`text-xs font-medium transition-colors duration-200 ${
            score <= 1
              ? 'text-red-400'
              : score <= 2
              ? 'text-orange-400'
              : score <= 3
              ? 'text-yellow-400'
              : score <= 4
              ? 'text-green-400'
              : 'text-emerald-400'
          }`}
        >
          {label}
        </p>
        <p className="text-xs text-white/30">
          {score <= 1
            ? 'Try adding numbers & symbols'
            : score <= 3
            ? 'Add a symbol to strengthen'
            : 'Great password!'}
        </p>
      </div>
    </motion.div>
  );
};
