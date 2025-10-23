# AI Gmail Summarizer

An intelligent Gmail email summarization tool powered by Google's Gemini AI. This application allows you to authenticate with your Google account, fetch emails from Gmail, and get AI-generated summaries of your emails.

## Features

- 🔐 **Google OAuth Authentication** - Secure login with your Google account
- 📧 **Gmail Integration** - Fetch emails directly from your Gmail inbox
- 🤖 **AI Summarization** - Powered by Google's Gemini AI for intelligent email summaries
- 📱 **Modern UI** - Clean, responsive interface with real-time updates
- ⚡ **Batch Processing** - Summarize multiple emails at once
- 🔍 **Search & Filter** - Find specific emails using Gmail search queries

## Prerequisites

- Node.js (v14 or higher)
- Google Cloud Console project with Gmail API enabled
- Google OAuth 2.0 credentials
- Gemini API key

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Google OAuth

The application is already configured with the provided credentials:
- Client ID: `311927548209-qc6ibnhs4hclgblfdb6ets3hrpn6bn3f.apps.googleusercontent.com`
- Client Secret: `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`
- Redirect URI: `http://localhost:9002/api/auth/google/callback`

### 3. Configure Gemini API

The Gemini API key is already configured:
- API Key: `AIzaSyBqDzU_o_6nVqX-GTurKjnegqrb_VwoJDs`

### 4. Start the Application

```bash
npm start
```

Or for development with auto-restart:

```bash
npm run dev
```

### 5. Access the Application

Open your browser and navigate to:
```
http://localhost:9002
```

## Usage

1. **Sign In**: Click "Sign in with Google" to authenticate with your Google account
2. **Load Emails**: The application will automatically load your recent emails
3. **Select Emails**: Choose which emails you want to summarize
4. **Get Summaries**: Click "Summarize Selected" to get AI-generated summaries
5. **Search**: Use the search box to filter emails by sender, subject, or content

## API Endpoints

### Authentication
- `GET /api/auth/google` - Initiate Google OAuth flow
- `GET /api/auth/google/callback` - OAuth callback handler
- `GET /api/auth/logout` - Logout user
- `GET /api/user` - Get current user info

### Gmail Operations
- `GET /api/gmail/emails` - Fetch emails from Gmail
- `POST /api/gmail/summarize` - Summarize a single email
- `POST /api/gmail/summarize-batch` - Summarize multiple emails

## Configuration

The application uses the following configuration (in `config.js`):

```javascript
module.exports = {
  google: {
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret',
    redirectUri: 'http://localhost:9002/api/auth/google/callback'
  },
  gemini: {
    apiKey: 'your-gemini-api-key'
  },
  session: {
    secret: 'your-session-secret'
  },
  server: {
    port: 9002
  }
};
```

## Features in Detail

### Email Fetching
- Fetches emails from Gmail using the Gmail API
- Supports Gmail search queries (e.g., `from:important@company.com`)
- Configurable number of emails to fetch (10, 20, or 50)
- Displays email metadata (subject, sender, date, snippet)

### AI Summarization
- Uses Google's Gemini Pro model for intelligent summarization
- Provides structured summaries with:
  - Brief overview
  - Key points and action items
  - Important dates and deadlines
  - Sentiment analysis
  - Follow-up recommendations
- Supports both single email and batch summarization

### User Interface
- Modern, responsive design
- Real-time email selection and management
- Loading states and error handling
- Mobile-friendly interface

## Security

- OAuth 2.0 authentication ensures secure access to Gmail
- Session-based authentication for web interface
- No email content is stored permanently
- All API keys are configured securely

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Ensure your Google OAuth credentials are correct
   - Check that the redirect URI matches exactly
   - Verify that Gmail API is enabled in your Google Cloud Console

2. **Gmail API Errors**
   - Ensure you have granted the necessary permissions
   - Check that your Google account has Gmail access
   - Verify the OAuth scopes include Gmail read access

3. **Gemini API Errors**
   - Verify your Gemini API key is valid
   - Check your API quota and usage limits
   - Ensure the API key has the necessary permissions

### Debug Mode

To enable debug logging, set the environment variable:
```bash
DEBUG=* npm start
```

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
