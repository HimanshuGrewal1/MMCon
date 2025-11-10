



# Project Setup Guide

## After Forking the Repository

Open **three terminals** and run the following commands:

### Terminal 1
```bash
cd backend
npm i
npm run dev
````

### Terminal 2

```bash
cd frontend
npm i
npm run dev
```

### Terminal 3

```bash
cd server
npm i
node index.js
```

---

## Sample `.env` for Backend

```
PORT=
MONGO_URI=
JWT_SECRET=

EMAIL_USER=
EMAIL_PASSWORD=   # note: must use app password

CLIENT_URL=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## Sample `.env` for Frontend

```

VITE_API_URL
```



