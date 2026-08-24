# FluxShare 🚀

FluxShare is a modern temporary file-sharing platform that allows users to upload multiple files, generate a secure transfer link, and share those files with others.

Files are stored securely in **AWS S3** and automatically removed when the transfer expires.

The application is built with **React, Node.js, Express, MongoDB, Redis, and AWS S3**, with a focus on secure file handling, temporary access, download limits, and reliable cleanup.

---

## ✨ Features

- 📂 Drag & Drop File Upload
- 📋 Copy & Paste File Upload
- 📁 Multiple File Upload
- 📦 Selective Multi-File Download
- 🗜️ Automatic ZIP Generation for Multiple Downloads
- 📥 Direct Download for Single Files
- 🔗 Secure Shareable Transfer Links
- 🔐 Signed AWS S3 Download URLs
- ⏳ Configurable Transfer Expiry
- ⚡ Real-Time Transfer Expiry Countdown
- 📊 Configurable Download Limits
- 🚫 Automatic Transfer Expiration
- 🗑️ Automatic S3 File Cleanup
- 📱 Fully Responsive UI
- 🎨 Modern Glassmorphism Interface
- 🔥 Real-Time Upload Progress
- 🚦 Redis-Based Sliding Window Rate Limiting
- 🛡️ Upload Size and File Count Validation
- ☁️ AWS S3 Object Storage
- 🧹 Automated Background Cleanup with Node-Cron

---

# 🛠️ Tech Stack

## Frontend

- React
- Vite
- Tailwind CSS
- Framer Motion
- Axios
- React Hot Toast
- Lucide React

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Redis
- AWS S3
- Multer
- Multer-S3
- Node-Cron

## Infrastructure & Deployment

- AWS S3
- MongoDB Atlas
- Redis
- Vercel
- Render

---

# 🏗️ Architecture

FluxShare follows a modular client-server architecture.

```text
                         ┌──────────────────┐
                         │      React       │
                         │     Frontend     │
                         └────────┬─────────┘
                                  │
                                  │ HTTP
                                  ▼
                         ┌──────────────────┐
                         │    Express.js    │
                         │     Backend      │
                         └────────┬─────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                    ▼             ▼             ▼
             ┌────────────┐ ┌───────────┐ ┌────────────┐
             │  MongoDB   │ │   Redis   │ │  AWS S3    │
             │            │ │           │ │            │
             │ Transfers  │ │   Cache   │ │   Files    │
             │ & Metadata │ │ & Limits  │ │  Storage   │
             └────────────┘ └───────────┘ └────────────┘
```

---

# 📁 Project Structure

```bash
file-share-app/
│
├── client/
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── upload/
│   │   │   └── receive/
│   │   │
│   │   ├── hooks/
│   │   │
│   │   ├── pages/
│   │   │
│   │   ├── services/
│   │   │
│   │   ├── utils/
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── .env
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── server/
│   │
│   ├── config/
│   │   ├── redis.js
│   │   └── s3.js
│   │
│   ├── controllers/
│   │   └── fileController.js
│   │
│   ├── services/
│   │   ├── fileService.js
│   │   ├── storageService.js
│   │   ├── cacheService.js
│   │   └── zipService.js
│   │
│   ├── middleware/
│   │   ├── upload.js
│   │   ├── uploadErrorHandler.js
│   │   └── rateLimiter.js
│   │
│   ├── routes/
│   │   └── fileRoutes.js
│   │
│   ├── models/
│   │   └── File.js
│   │
│   ├── cron/
│   │   └── cleanup.js
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

## Client

Create:

```text
client/.env
```

Add:

```env
VITE_API_URL=http://localhost:5002
```

---

## Server

Create:

```text
server/.env
```

Add:

```env
PORT=5002

MONGO_URI=your_mongodb_connection_string

AWS_REGION=your_aws_region
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_BUCKET_NAME=your_bucket_name

REDIS_URL=your_redis_connection_string
```

Never commit `.env` files or AWS credentials to GitHub.

---

# 🚀 Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/prashantgoyal7691/fluxshare.git
cd fluxshare
```

---

## 2. Install Frontend Dependencies

```bash
cd client
npm install
```

---

## 3. Install Backend Dependencies

```bash
cd ../server
npm install
```

---

# ▶️ Running the Application

You need to run the frontend and backend separately.

## Start Backend

From the `server` directory:

```bash
npm run dev
```

Backend:

```text
http://localhost:5002
```

---

## Start Frontend

Open another terminal:

```bash
cd client
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 📤 Upload Flow

The upload process works as follows:

```text
User selects files
       │
       ▼
React Frontend
       │
       ▼
Upload API
       │
       ▼
Rate Limiter
       │
       ▼
Multer Validation
       │
       ├── Maximum 500 MB per file
       └── Maximum 10 files
       │
       ▼
AWS S3
       │
       ▼
Upload Controller
       │
       ▼
Transfer Validation
       │
       ▼
MongoDB
       │
       ▼
Transfer Link
```

---

# 📥 Download Flow

For a single selected file:

```text
Receive Page
     │
     ▼
Download Request
     │
     ▼
Validate Transfer
     │
     ▼
Validate Download Limit
     │
     ▼
Generate Signed S3 URL
     │
     ▼
Browser Downloads File
```

For multiple files:

```text
Receive Page
     │
     ▼
Select Files
     │
     ▼
Download Request
     │
     ▼
Validate Selected Files
     │
     ▼
Create ZIP
     │
     ▼
Stream ZIP to Client
```

---

# 📏 Upload Limits

FluxShare currently enforces:

| Limit | Value |
|---|---:|
| Maximum file size | 500 MB |
| Maximum files per transfer | 10 |
| Maximum transfer size | 2 GB |

The maximum transfer size applies **per transfer**, not globally.

For example:

```text
User A → 1.8 GB ✅
User B → 1.9 GB ✅
User C → 2.0 GB ✅
```

These transfers can coexist independently.

---

# ⏳ Transfer Expiry

Each transfer has its own expiry time.

When the transfer expires:

```text
Transfer expires
       │
       ▼
Cleanup Cron
       │
       ▼
Delete S3 Objects
       │
       ▼
Delete Redis Cache
       │
       ▼
Delete MongoDB Transfer
```

S3 deletion is treated as the critical cleanup operation.

If an S3 deletion fails:

```text
S3 deletion ❌
      │
      ▼
MongoDB record remains
      │
      ▼
Next cleanup cycle retries
```

This prevents orphaned S3 objects.

Redis is treated as a cache. If Redis deletion fails after successful S3 cleanup, MongoDB cleanup can still proceed because the Redis entry has its own expiration.

---

# 🚦 Rate Limiting

FluxShare uses a **Redis-based Sliding Window Counter** rate limiter.

Different endpoints have different limits.

```text
Client Request
      │
      ▼
Redis Rate Limiter
      │
      ├── Allowed → Continue
      │
      └── Limit exceeded → 429
```

This protects the application from excessive requests while avoiding the boundary burst problem of a basic fixed-window counter.

---

# 🔐 Security

FluxShare includes several security mechanisms:

- Signed AWS S3 download URLs
- Temporary transfer links
- Download limits
- Transfer expiry
- File size validation
- File count validation
- Transfer size validation
- Redis-based rate limiting
- Sanitized S3 object keys
- Private S3 object access
- Automatic expired-file cleanup
- Environment-based secret management

---

# ☁️ AWS S3

FluxShare uses Amazon S3 for file storage.

Files are uploaded to a private S3 bucket and downloaded through temporary signed URLs.

The application does not expose permanent public S3 URLs.

### S3 Setup

1. Create an S3 bucket
2. Create an IAM user
3. Grant the required S3 permissions
4. Configure the bucket region
5. Add AWS credentials to the server environment
6. Configure CORS if required by the application

---

# 🗄️ MongoDB

MongoDB stores transfer metadata such as:

- Transfer key
- File information
- File names
- S3 keys
- File sizes
- Expiry time
- Download limits
- Download usage

MongoDB acts as the primary source of truth for transfer information.

---

# ⚡ Redis

Redis is used for:

- Transfer information caching
- Transfer expiry synchronization
- Rate limiting

Redis is treated as a cache rather than the permanent source of truth.

---

# 🧹 Automatic Cleanup

FluxShare uses `node-cron` to periodically check for expired transfers.

The cleanup process:

```text
Every minute
     │
     ▼
Find expired transfers
     │
     ▼
Delete associated S3 objects
     │
     ├── Failure → Keep MongoDB record → Retry
     │
     └── Success
             │
             ▼
       Delete Redis cache
             │
             ▼
       Delete MongoDB record
```

This ensures expired files do not remain permanently in S3.

---

# 📦 Deployment

## Frontend

The React frontend can be deployed using:

- Vercel

## Backend

The Node.js/Express backend can be deployed using:

- Render

## External Services

- MongoDB Atlas
- AWS S3
- Redis


# 🌐 Production Example

```text
Frontend
    ↓
https://fluxshare.p19.in

Backend
    ↓
Production API

        ┌──────────────┐
        │   MongoDB    │
        └──────────────┘
                │
        ┌──────────────┐
        │    Redis     │
        └──────────────┘
                │
        ┌──────────────┐
        │    AWS S3    │
        └──────────────┘
```

---

# 🧪 Testing Checklist

Before deploying a new version, verify:

- [ ] Single file upload
- [ ] Multiple file upload
- [ ] Drag & drop upload
- [ ] Copy & paste upload
- [ ] 500 MB file limit
- [ ] 10-file limit
- [ ] 2 GB transfer limit
- [ ] Transfer creation
- [ ] Transfer expiry countdown
- [ ] Expired transfer handling
- [ ] Single-file download
- [ ] Multi-file ZIP download
- [ ] File selection/deselection
- [ ] Download limit
- [ ] Rate limiting
- [ ] S3 cleanup
- [ ] Redis cleanup
- [ ] MongoDB cleanup
- [ ] Responsive layout

---

# 👨‍💻 Author

**Prashant Goyal**

GitHub:  
https://github.com/prashantgoyal7691

---

# ⭐ Support

If you like FluxShare, consider giving the repository a ⭐ on GitHub.