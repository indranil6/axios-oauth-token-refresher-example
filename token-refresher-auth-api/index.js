const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const { expressjwt } = require("express-jwt");
const cors = require("cors");
const app = express();
app.use(bodyParser.json());
app.use(cors()); // Add this line to enable CORS
const SECRET_KEY = "your-secret-key";
const REFRESH_SECRET_KEY = "your-refresh-secret-key";
const ACCESS_TOKEN_EXPIRES_IN = 10;

const users = [
  { id: 1, username: "user1", password: "password1" },
  { id: 2, username: "user2", password: "password2" },
];

let refreshTokens = [];

// Generate Access Token
function generateAccessToken(user) {
  return jwt.sign(user, SECRET_KEY, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
}

// Generate Refresh Token
function generateRefreshToken(user) {
  const refreshToken = jwt.sign(user, REFRESH_SECRET_KEY);
  refreshTokens.push(refreshToken);
  return refreshToken;
}

// Login API
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    const accessToken = generateAccessToken({ username: user.username });
    const refreshToken = generateRefreshToken({ username: user.username });
    res.json({ accessToken, refreshToken });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Token Refresh API
app.post("/token", (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ message: "Token is required" });
  }

  if (!refreshTokens.includes(token)) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  jwt.verify(token, REFRESH_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const accessToken = generateAccessToken({ username: user.username });
    const refreshToken = generateRefreshToken({ username: user.username });

    // Remove old refresh token and add new one
    refreshTokens = refreshTokens.filter((rt) => rt !== token);
    refreshTokens.push(refreshToken);

    res.json({ accessToken, refreshToken });
  });
});

// Protected routes
app.get(
  "/featured-products",
  expressjwt({
    secret: SECRET_KEY,
    algorithms: ["HS256"],
  }),
  (req, res) => {
    setTimeout(() => {
      res.json({ products: ["Product 1", "Product 2", "Product 3"] });
    }, 2000);
  }
);

app.get(
  "/recommended-products",
  expressjwt({
    secret: SECRET_KEY,
    algorithms: ["HS256"],
  }),
  (req, res) => {
    setTimeout(() => {
      res.json({ products: ["Product 4", "Product 5", "Product 6"] });
    }, 2000);
  }
);

app.get(
  "/popular-products",
  expressjwt({
    secret: SECRET_KEY,
    algorithms: ["HS256"],
  }),
  (req, res) => {
    setTimeout(() => {
      res.json({ products: ["Product 7", "Product 8", "Product 9"] });
    }, 2000);
  }
);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
