# Gravity Auth ⚡

A premium, production-ready React Login/Signup component featuring glassmorphism design, smooth Framer Motion animations, real-time form validation, and full dark-mode support.

> Inspired by Linear, Vercel, and Stripe's auth pages.

---

## Features

| Feature | Details |
|---|---|
| **Dual mode** | Login / Signup with slide animation |
| **Validation** | react-hook-form + zod schemas, real-time inline errors |
| **Password strength** | Color-coded 5-segment animated bar |
| **Show/hide password** | Eye icon toggle |
| **Social login** | Google, GitHub, Apple buttons |
| **Loading states** | Spinner on submit, disabled inputs |
| **Toasts** | Success / error via react-hot-toast |
| **Dark mode** | Full dark/light toggle |
| **Animations** | Framer Motion transitions, shake on error, blob background |
| **Accessibility** | aria-* attributes, focus rings, keyboard navigation |
| **Responsive** | Mobile-first, works on all screen sizes |

---

## Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "framer-motion": "^11.x",
    "react-hook-form": "^7.x",
    "@hookform/resolvers": "^3.x",
    "zod": "^3.x",
    "lucide-react": "^0.x",
    "react-hot-toast": "^2.x"
  },
  "devDependencies": {
    "vite": "^6.x",
    "@vitejs/plugin-react": "^4.x",
    "tailwindcss": "^4.x",
    "@tailwindcss/vite": "^4.x"
  }
}
```

---

## Quick Start

### 1. Install

```bash
npm install
```

### 2. Run dev

```bash
npm run dev
```

Open http://localhost:5173

### 3. Build

```bash
npm run build
```

---

## File Structure

```
src/
  components/
    AuthForm.jsx          Main card with layout + animations
    InputField.jsx        Reusable animated input with error state
    PasswordStrength.jsx  Animated password strength indicator
    SocialButton.jsx      Google / GitHub / Apple social buttons
  hooks/
    useAuthForm.js        Custom hook - state, schemas, submit handlers
  App.jsx
  main.jsx
  index.css
```

---

## Wiring Up a Real Auth Provider

Open `src/hooks/useAuthForm.js` and replace the mock setTimeout calls.

### Firebase

```bash
npm install firebase
```

```js
// src/lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const app = initializeApp({
  apiKey:     import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:  import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId:      import.meta.env.VITE_FIREBASE_APP_ID,
});
export const auth = getAuth(app);
```

```js
// In useAuthForm.js onLoginSubmit
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
await signInWithEmailAndPassword(auth, data.email, data.password);
```

### Supabase

```bash
npm install @supabase/supabase-js
```

```js
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

```js
// In useAuthForm.js onLoginSubmit
import { supabase } from '../lib/supabase';
const { error } = await supabase.auth.signInWithPassword({ email: data.email, password: data.password });
if (error) throw error;
```

---

## Deploy to Vercel

### CLI

```bash
npm install -g vercel
vercel --prod
```

### Git Integration

1. Push to GitHub
2. Import at vercel.com/new
3. Set environment variables in Settings -> Environment Variables:

   VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, etc.

4. Deploy. Vercel auto-detects Vite (build: npm run build, output: dist).

The included vercel.json handles:
- SPA fallback rewrites
- Security headers (X-Frame-Options, X-XSS-Protection, etc.)
- Long-term asset caching

---

## Customization

### Colors / Brand

Change the gradient in AuthForm.jsx:

```jsx
// Top accent bar
className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-500"

// Submit button  
className="bg-gradient-to-r from-violet-600 to-fuchsia-600"
```

### Font

Replace Inter in index.css:

```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300..800&display=swap');
html { font-family: 'Outfit', sans-serif; }
```

### Validation rules

Edit the Zod schemas in src/hooks/useAuthForm.js

---

## License

MIT - use freely in personal and commercial projects.
