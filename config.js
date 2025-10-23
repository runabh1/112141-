// Configuration file for the Gmail Summarizer
module.exports = {
  // Google OAuth Credentials
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || 'your-google-client-id-here',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret-here',
    redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:9002/api/auth/google/callback'
  },
  
  // Gemini API Key
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || 'your-gemini-api-key-here'
  },
  
  // Session configuration
  session: {
    secret: process.env.SESSION_SECRET || 'your-super-secret-session-key-here'
  },
  
  // Server configuration
  server: {
    port: process.env.PORT || 9002
  }
};
