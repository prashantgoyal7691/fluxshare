# FluxShare 🚀

FluxShare is a modern temporary file sharing platform built with Next.js, Node.js, MongoDB, and AWS S3.  
Users can upload files securely, share them using secret keys or links, and automatically delete files after expiry.

---

# ✨ Features

- 📂 Drag & Drop File Upload
- 🔐 Temporary Secure File Sharing
- ☁️ AWS S3 Cloud Storage Integration
- ⏳ Auto File Expiry & Deletion
- 🔗 Shareable Download Links
- 📥 Signed URL Secure Downloads
- 📱 Responsive Modern UI
- 🎨 Glassmorphism Design
- ⚡ Fast Upload & Download
- 📊 Download Limits
- 🔥 Real-Time Upload Progress
- 🗑 Automatic Cleanup Cron Job

---

# 🛠 Tech Stack

## Frontend
- Next.js 16
- React.js
- Tailwind CSS
- Framer Motion
- Axios
- React Hot Toast
- Lucide React

## Backend
- Node.js
- Express.js
- MongoDB Atlas
- AWS S3
- Multer
- Node-Cron

## Deployment
- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas
- AWS S3

---

# 📁 Project Structure

```bash
file-share-app/
│
├── client/
│   ├── app/
│   │   ├── receive/
│   │   │   └── page.js
│   │   ├── transfer/
│   │   │   └── [key]/
│   │   │       └── page.js
│   │   ├── upload/
│   │   │   └── page.js
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── public/
│   ├── .env.local
│   ├── next.config.ts
│   ├── package.json
│   └── tsconfig.json
│
├── server/
│   ├── config/
│   │   └── s3.js
│   │
│   ├── controllers/
│   │
│   ├── cron/
│   │   └── cleanup.js
│   │
│   ├── middleware/
│   │   └── upload.js
│   │
│   ├── models/
│   │   └── File.js
│   │
│   ├── routes/
│   │   └── fileRoutes.js
│   │
│   ├── uploads/
│   │   └── .gitkeep
│   │
│   ├── .env
│   ├── app.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

# ⚙️ Environment Variables

## Client `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5002
```

---

## Server `.env`

```env
PORT=5002

MONGO_URI=your_mongodb_connection_string

AWS_REGION=your_aws_region
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_BUCKET_NAME=your_bucket_name
```

---

# 🚀 Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/prashantgoyal7691/fluxshare.git
cd fluxshare
```

---

# 2️⃣ Install Frontend Dependencies

```bash
cd client
npm install
```

---

# 3️⃣ Install Backend Dependencies

```bash
cd ../server
npm install
```

---

# 4️⃣ Run Backend

```bash
npm run dev
```

Backend runs on:

```bash
http://localhost:5002
```

---

# 5️⃣ Run Frontend

```bash
cd ../client
npm run dev
```

Frontend runs on:

```bash
http://localhost:3000
```

---

# ☁️ AWS S3 Setup

1. Create AWS S3 Bucket
2. Create IAM User
3. Give S3 Access Permissions
4. Add AWS Credentials in `.env`
5. Enable Bucket CORS if needed

---

# 🗑 Auto File Deletion

Expired files are automatically deleted using:

- `node-cron`
- AWS S3 DeleteObjectCommand

Cleanup runs every minute.

---

# 🔐 Security Features

- Signed Download URLs
- Temporary File Access
- Download Limits
- Auto Expiry
- Hidden S3 Bucket Access

---

# 📦 Deployment

## Frontend
Deploy on:

- Vercel

## Backend
Deploy on:

- Render

---

# 🌐 Custom Domain

Example Production Setup:

```bash
Frontend → fluxshare.p19.in
Backend  → api.p19.in
```

---

# 📸 Screenshots

(Add screenshots here)

---

# 👨‍💻 Author

Prashant Goyal

GitHub:
https://github.com/prashantgoyal7691

---

# ⭐ Support

If you like this project, give it a ⭐ on GitHub.