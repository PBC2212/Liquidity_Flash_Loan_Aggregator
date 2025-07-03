const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Web3Auth JWKS configuration
const client = jwksClient({
  jwksUri: 'https://api-auth.web3auth.io/.well-known/jwks.json',
  requestHeaders: {},
  timeout: 30000,
  cache: true,
  cacheMaxEntries: 5,
  cacheMaxAge: 600000, // 10 minutes
});

// Get signing key for JWT verification
const getKey = (header, callback) => {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      console.error('Error getting signing key:', err);
      return callback(err);
    }
    
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
};

// Verify Web3Auth JWT token
const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getKey,
      {
        audience: 'BHT2385fJC4BKKbk1F6c5zSM_uirDNL6rryCs1Gy9gjtQEmUaAMIfH3ZTchPG3gFSJKn3wiBEUE28yb-vn3fCtU',
        issuer: 'https://api-auth.web3auth.io',
        algorithms: ['RS256'],
      },
      (err, decoded) => {
        if (err) {
          console.error('JWT verification failed:', err);
          return reject(err);
        }
        
        resolve(decoded);
      }
    );
  });
};

// Extract user info from verified token
const extractUserInfo = (decodedToken) => {
  return {
    userId: decodedToken.sub,
    email: decodedToken.email,
    name: decodedToken.name,
    picture: decodedToken.picture,
    walletAddress: decodedToken.wallets?.[0]?.public_key,
    loginProvider: decodedToken.aggregateVerifier,
    iat: decodedToken.iat,
    exp: decodedToken.exp,
  };
};

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Real Estate Liquidity Aggregator Backend',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Verify user JWT token
app.post('/api/verify-user', async (req, res) => {
  try {
    const { idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'ID token is required'
      });
    }
    
    const decoded = await verifyToken(idToken);
    const userInfo = extractUserInfo(decoded);
    
    res.json({
      success: true,
      user: userInfo,
      message: 'User verified successfully'
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token verification failed',
      error: error.message
    });
  }
});

// Get user profile (protected route)
app.post('/api/profile', async (req, res) => {
  try {
    const { idToken } = req.body;
    
    const decoded = await verifyToken(idToken);
    const userInfo = extractUserInfo(decoded);
    
    // Here you could fetch additional user data from your database
    // based on userInfo.userId or userInfo.walletAddress
    
    res.json({
      success: true,
      profile: {
        ...userInfo,
        // Add any additional profile data here
        realEstateAssets: [], // Placeholder for user's real estate tokens
        flashLoanHistory: [], // Placeholder for transaction history
        preferences: {
          defaultProvider: 'aave',
          slippageTolerance: 0.5
        }
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Authentication failed',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.listen(port, () => {
  console.log(`🚀 Real Estate Liquidity Aggregator Backend`);
  console.log(`📡 Server running on http://localhost:${port}`);
  console.log(`🔐 Web3Auth JWKS verification enabled`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
});