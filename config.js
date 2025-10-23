// Configuration file for the Gmail Summarizer
module.exports = {
  // Google OAuth Credentials
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '311927548209-qc6ibnhs4hclgblfdb6ets3hrpn6bn3f.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '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',
    redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:9002/api/auth/google/callback'
  },
  
  // Gemini API Key
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || 'AIzaSyBqDzU_o_6nVqX-GTurKjnegqrb_VwoJDs'
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
