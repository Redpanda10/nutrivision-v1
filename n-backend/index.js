// const express = require('express');
// const cors = require('cors');
// const authRouter = require('./routes/authRouter');
// const userAuth = require('./middleware/authMiddleware');
// const helmet = require('helmet');
// require('dotenv').config();
// const connectDB = require('./config/db');

// const app = express();

// app.use(cors());
// app.use(helmet());
// app.use(express.json());

// connectDB();

// app.get('/', (req, res) => {
//     res.send('Server is running!');  
// });

// app.use('/api/auth', authRouter);

// app.get('/api/protected', userAuth, (req, res) => {
//     res.json({ message: 'This is a protected route', user: req.user });
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//     console.log(`App listening on port ${PORT}!`);
// }); 

require("dotenv").config();

const express = require("express");

const cors = require("cors");

const helmet = require("helmet");

const path = require("path");

const connectDB = require("./config/db");

/* =========================
   ROUTES
========================= */

const authRoutes = require("./routes/authRoutes");

const foodRoutes = require("./routes/foodRoutes");

/* =========================
   APP
========================= */

const app = express();

/* =========================
   SECURITY
========================= */

app.use(helmet());

app.use(
  cors({
    origin:
      process.env.CLIENT_URL || "*",

    credentials: true,
  })
);

/* =========================
   BODY PARSERS
========================= */

app.use(
  express.json({
    limit: "15mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "15mb",
  })
);

/* =========================
   STATIC FILES
========================= */

app.use(
  "/uploads",

  express.static(
    path.join(__dirname, "uploads"),
    {
      maxAge: "7d",
    }
  )
);

/* =========================
   HEALTH CHECK
========================= */

app.get("/", (req, res) => {
  res.send(
    "NutriVision API is active"
  );
});

/* =========================
   API ROUTES
========================= */

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/food",
  foodRoutes
);

/* =========================
   404 HANDLER
========================= */

app.use( (req, res) => {
  return res.status(404).json({
    message: "Route not found",
  });
});

/* =========================
   GLOBAL ERROR HANDLER
========================= */

app.use(
  (err, req, res, next) => {
    console.error(
      "❌ Server Error:",
      err
    );

    // Multer errors
    if (
      err.name === "MulterError"
    ) {
      return res.status(400).json({
        message: err.message,
      });
    }

    return res.status(
      err.status || 500
    ).json({
      message:
        err.message ||
        "Internal server error",
    });
  }
);

/* =========================
   START SERVER
========================= */

const PORT =
  process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(
        `🚀 Server running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "❌ Failed to start server:",
      error.message
    );

    process.exit(1);
  }
};

startServer();