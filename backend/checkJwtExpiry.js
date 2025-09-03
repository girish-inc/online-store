const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Function to generate a token for testing
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.jwtSecret, {
    expiresIn: process.env.jwtAccessTokenExpire,
  });
};

// Generate a test token
const userId = '123456789';
const token = generateToken(userId);

// Decode the token without verification to check its contents
const decoded = jwt.decode(token);

// Calculate expiration time in human-readable format
const expiryDate = new Date(decoded.exp * 1000);
const currentDate = new Date();
const diffInMilliseconds = expiryDate - currentDate;
const diffInMinutes = Math.round(diffInMilliseconds / (1000 * 60));

console.log('\nJWT Token Expiration Check');
console.log('========================');
console.log(`Token: ${token}`);
console.log('\nDecoded Token:');
console.log(decoded);
console.log('\nExpiration Details:');
console.log(`Current time: ${currentDate.toISOString()}`);
console.log(`Expiry time: ${expiryDate.toISOString()}`);
console.log(`Time until expiration: ~${diffInMinutes} minutes`);
console.log(`Environment setting: ${process.env.jwtAccessTokenExpire}`);

// Verify the token is currently valid
console.log('\nToken Verification:');
try {
  const verified = jwt.verify(token, process.env.jwtSecret);
  console.log('✅ Token is currently VALID');
  console.log(verified);
} catch (error) {
  console.log('❌ Token is INVALID');
  console.log(error.message);
}

// Simulate token verification after expiration
console.log('\nSimulating verification after expiration:');

// Create a manually crafted expired token
// We'll use a fixed past timestamp for the 'exp' claim
const pastTimestamp = Math.floor(Date.now() / 1000) - 60; // 1 minute in the past
const payload = { id: userId, exp: pastTimestamp };
const expiredToken = jwt.sign(payload, process.env.jwtSecret, { noTimestamp: true });

// Decode the expired token
const decodedExpired = jwt.decode(expiredToken);
console.log('Expired token payload:');
console.log(decodedExpired);
console.log(`Expired at: ${new Date(decodedExpired.exp * 1000).toISOString()} (${Math.round((Date.now()/1000 - decodedExpired.exp)/60)} minutes ago)`);

// Verify the expired token
try {
  const verified = jwt.verify(expiredToken, process.env.jwtSecret);
  console.log('✅ Expired token verification passed (unexpected)');
  console.log(verified);
} catch (error) {
  console.log('❌ Expired token verification failed (expected)');
  console.log(`Error: ${error.message}`);
}

console.log('========================\n');

console.log('How to manually verify a JWT token:');
console.log('1. Go to https://jwt.io/');
console.log('2. Paste your token in the debugger');
console.log('3. Check the payload section for "exp" timestamp');
console.log('4. Convert the exp timestamp to a date using:');
console.log('   new Date(exp * 1000).toISOString()');
console.log('\nNote: JWT expiration times use Unix timestamps (seconds since epoch)');