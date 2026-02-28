# DEMO NGO - Setup & Deployment Guide

## Project Structure
```
ngo/
├── client/                 # React frontend (Vite + Tailwind CSS 4)
│   ├── src/
│   │   ├── components/     # Toast, ImpactTracker
│   │   ├── pages/          # Home, About, Privacy, Terms, Admin, PaymentSuccess, NotFound
│   │   ├── App.jsx         # Root layout with routing
│   │   ├── PaymentComponent.jsx
│   │   └── main.jsx
│   ├── .env                # Frontend env vars
│   └── index.html          # SEO meta tags
├── server/
│   ├── server.js           # Express API (production-hardened)
│   ├── .env                # Backend env vars
│   ├── error.log           # Error logs (auto-generated)
│   └── combined.log        # All logs (auto-generated)
└── INSTRUCTIONS.md
```

## Environment Variables

### Backend (`server/.env`)
```env
PORT=5000
DATABASE_URL=postgres://user:password@localhost:5432/demongo
RAZORPAY_KEY_ID=YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
SMTP_EMAIL=your-gmail@gmail.com
SMTP_PASSWORD=your-16-char-app-password
FRONTEND_URL=http://localhost:5173
ADMIN_PASSWORD=your-admin-password
NODE_ENV=development
```

### Frontend (`client/.env`)
```env
VITE_RAZORPAY_KEY_ID=YOUR_KEY_ID
```

## Running Locally

1. **Database**: PostgreSQL running, `demongo` database exists
2. **Backend**: `cd server && npm install && npm start`
3. **Frontend**: `cd client && npm install && npm run dev`

## Routes
| Route | Page | Auth |
|---|---|---|
| `/` | Home + Donation Form | Public |
| `/about` | About Us | Public |
| `/privacy` | Privacy Policy | Public |
| `/terms` | Terms of Service | Public |
| `/admin` | Admin Dashboard | 🔒 Password |
| `/payment-success` | Payment Receipt | Via redirect |
| `/*` | 404 Not Found | Public |

## API Endpoints
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | — | Health check |
| POST | `/api/create-order` | Origin | Create Razorpay order |
| POST | `/api/verify-payment` | Origin | Verify payment signature |
| GET | `/api/stats` | — | Public donation stats |
| GET | `/api/donations` | 🔒 Admin | List all donations |
| POST | `/api/admin/login` | — | Verify admin password |

## Security Features
- **Helmet** — security headers
- **CORS** — restricted to `FRONTEND_URL`
- **Rate limiting** — 20 req/15min on payments, 100 req/15min general
- **Origin validation** — payment endpoints verify request origin
- **Admin auth** — `/api/donations` requires `x-admin-password` header
- **Input validation** — name, email, amount sanitized
- **Body size limit** — 10kb max request body
- **Winston logging** — file + console, error-only + combined logs
- **Error handler** — stack traces hidden in production

## Going Live

### 1. Switch Razorpay Keys
Replace test keys with live keys in both `server/.env` and `client/.env`.

### 2. Set Production Env Vars
```env
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
ADMIN_PASSWORD=strong-unique-password
```

### 3. Deploy
- **Frontend**: `cd client && npm run build` → deploy `dist/` to Vercel/Netlify
- **Backend**: deploy to Render/Railway (set env vars in dashboard)
- **Database**: Neon/Supabase/Railway Postgres

### 4. Post-Deploy
- Verify HTTPS is active
- Do a ₹1 live test transaction
- Check `/admin` with your admin password
- Monitor `error.log` for issues
