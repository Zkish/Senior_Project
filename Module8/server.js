const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db');
const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 10;
const cors = require('cors');
const app = express();
const PORT = 3000;
const session = require("express-session");
const { spawn } = require("child_process");



// test DB connection
db.query('SELECT 1', (err) => {
  if (err) console.error('Error connecting to database:', err);
  else console.log('Database connection successful');
});

app.use(cors());
app.use(bodyParser.json());
// directory path may need updated depending on how files are served
app.use(express.static(path.join(__dirname))); 

app.use(session({
  secret: "d2479ab2fc6f3423e6a17b937c7a6ea8f368c3428b1e7dfdf9848201f94ce702",
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// Route: Create Account

app.post("/create-account", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
      return res.json({ success: false, message: "Missing fields" });

  // ensure user doesn't already exist
  const checkSql = "SELECT * FROM Users WHERE email = ? OR username = ?";
  db.query(checkSql, [email, username], async (err, results) => {
      if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ success: false, message: "DB error" });
      }

      if (results.length > 0) {
          return res.json({ success: false, message: "Email or username already exists" });
      }

      // hash password
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      // insert new user
      const insertSql = "INSERT INTO Users (username, email, password_hash) VALUES (?, ?, ?)";
      db.query(insertSql, [username, email, hashedPassword], (err) => {
          if (err) {
              console.error("Insert error:", err);
              return res.status(500).json({ success: false, message: "DB insert error" });
          }

          return res.json({ success: true, message: "Account created" });
      });
  });
});

// Route: Check If Email Exists
app.post('/check-email', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email required' });
  }

  const sql = 'SELECT * FROM Users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (results.length > 0) {
      res.json({ success: true, message: 'Email found' });
    } else {
      res.json({ success: false, message: 'Email not found' });
    }
  });
});

// Route: Reset Password (Hashed)
app.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ success: false, message: 'Email and new password required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const sql = 'UPDATE Users SET password_hash = ? WHERE email = ?';
    db.query(sql, [hashedPassword, email], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      if (results.affectedRows > 0) {
        res.json({ success: true, message: 'Password updated' });
      } else {
        res.json({ success: false, message: 'Email not found' });
      }
    });

  } catch (error) {
    console.error('Hashing error:', error);
    res.status(500).json({ success: false, message: 'Server error during password hashing' });
  }
});

// Route: Login

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  const sql = "SELECT * FROM Users WHERE username = ?";
  db.query(sql, [username], async (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (results.length === 0) {
      return res.json({ success: false, message: "User not found" });
    }

    const user = results[0];

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.json({ success: false, message: "Incorrect password" });
    }

    // user session
    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email
    };

    return res.json({ success: true, message: "Login successful" });
  });
});

// Route: Check Login

app.get("/auth-check", (req, res) => {
  if (req.session.user) {
    return res.json({ loggedIn: true, user: req.session.user });
  }
  res.json({ loggedIn: false });
});

// Route: logout
 
app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

// risk assessment

app.post("/predict", (req, res) => {
    const py = spawn("python3", ["predict.py"]);
  
    py.stdin.write(JSON.stringify(req.body));
    py.stdin.end();
  
    let result = "";
    let errorOutput = "";
  
    py.stdout.on("data", (data) => {
        console.log("PYTHON OUTPUT:", data.toString());
      result += data.toString();
    });
  
    py.stderr.on("data", (data) => {
        console.error("PYTHON ERROR:", data.toString());
      errorOutput += data.toString();
    });
  
    py.on("close", (code) => {
      if (errorOutput) {
        console.error("Python error:", errorOutput);
      }
  
      if (!result) {
        return res.status(500).json({
          error: "No result from Python",
          pythonError: errorOutput || null
        });
      }
  
      try {
        const parsed = JSON.parse(result);
        res.json(parsed);
      } catch (err) {
        console.error("JSON parse error. Raw result:", result);
        return res.status(500).json({
          error: "Invalid JSON from Python",
          raw: result
        });
      }
    });
  });


// server start
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on http://0.0.0.0:${PORT}`));
