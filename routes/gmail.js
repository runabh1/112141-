const express = require('express');
const { google } = require('googleapis');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');

const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(config.gemini.apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Get Gmail service
const getGmailService = (accessToken) => {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  return google.gmail({ version: 'v1', auth: oauth2Client });
};

// Fetch emails from Gmail
router.get('/emails', requireAuth, async (req, res) => {
  try {
    const { maxResults = 10, query = '' } = req.query;
    const gmail = getGmailService(req.user.accessToken);
    
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: parseInt(maxResults),
      q: query
    });

    const messages = response.data.messages || [];
    const emailDetails = [];

    for (const message of messages) {
      const email = await gmail.users.messages.get({
        userId: 'me',
        id: message.id,
        format: 'full'
      });

      const headers = email.data.payload.headers;
      const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
      const from = headers.find(h => h.name === 'From')?.value || 'Unknown Sender';
      const date = headers.find(h => h.name === 'Date')?.value || '';
      
      // Extract email body
      let body = '';
      if (email.data.payload.body && email.data.payload.body.data) {
        body = Buffer.from(email.data.payload.body.data, 'base64').toString();
      } else if (email.data.payload.parts) {
        for (const part of email.data.payload.parts) {
          if (part.mimeType === 'text/plain' && part.body && part.body.data) {
            body = Buffer.from(part.body.data, 'base64').toString();
            break;
          }
        }
      }

      emailDetails.push({
        id: message.id,
        subject,
        from,
        date,
        body: body.substring(0, 1000), // Limit body length for preview
        snippet: email.data.snippet
      });
    }

    res.json({ emails: emailDetails });
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
});

// Summarize a specific email
router.post('/summarize', requireAuth, async (req, res) => {
  try {
    const { emailId } = req.body;
    const gmail = getGmailService(req.user.accessToken);
    
    const email = await gmail.users.messages.get({
      userId: 'me',
      id: emailId,
      format: 'full'
    });

    const headers = email.data.payload.headers;
    const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
    const from = headers.find(h => h.name === 'From')?.value || 'Unknown Sender';
    
    // Extract full email body
    let body = '';
    if (email.data.payload.body && email.data.payload.body.data) {
      body = Buffer.from(email.data.payload.body.data, 'base64').toString();
    } else if (email.data.payload.parts) {
      for (const part of email.data.payload.parts) {
        if (part.mimeType === 'text/plain' && part.body && part.body.data) {
          body = Buffer.from(part.body.data, 'base64').toString();
          break;
        }
      }
    }

    // Create prompt for Gemini
    const prompt = `
Please provide a comprehensive summary of this email:

Subject: ${subject}
From: ${from}
Content: ${body}

Please provide:
1. A brief summary (2-3 sentences)
2. Key points or action items
3. Important dates or deadlines mentioned
4. Overall sentiment/tone
5. Any follow-up actions needed

Format your response in a clear, structured way.
    `;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    res.json({
      emailId,
      subject,
      from,
      summary,
      originalBody: body
    });
  } catch (error) {
    console.error('Error summarizing email:', error);
    res.status(500).json({ error: 'Failed to summarize email' });
  }
});

// Summarize multiple emails
router.post('/summarize-batch', requireAuth, async (req, res) => {
  try {
    const { emailIds } = req.body;
    const gmail = getGmailService(req.user.accessToken);
    const summaries = [];

    for (const emailId of emailIds) {
      try {
        const email = await gmail.users.messages.get({
          userId: 'me',
          id: emailId,
          format: 'full'
        });

        const headers = email.data.payload.headers;
        const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
        const from = headers.find(h => h.name === 'From')?.value || 'Unknown Sender';
        
        let body = '';
        if (email.data.payload.body && email.data.payload.body.data) {
          body = Buffer.from(email.data.payload.body.data, 'base64').toString();
        } else if (email.data.payload.parts) {
          for (const part of email.data.payload.parts) {
            if (part.mimeType === 'text/plain' && part.body && part.body.data) {
              body = Buffer.from(part.body.data, 'base64').toString();
              break;
            }
          }
        }

        const prompt = `
Please provide a brief summary of this email:

Subject: ${subject}
From: ${from}
Content: ${body.substring(0, 2000)}

Provide a concise 2-3 sentence summary focusing on the main points and any action items.
        `;

        const result = await model.generateContent(prompt);
        const summary = result.response.text();

        summaries.push({
          emailId,
          subject,
          from,
          summary
        });
      } catch (error) {
        console.error(`Error summarizing email ${emailId}:`, error);
        summaries.push({
          emailId,
          subject: 'Error',
          from: 'Unknown',
          summary: 'Failed to summarize this email'
        });
      }
    }

    res.json({ summaries });
  } catch (error) {
    console.error('Error in batch summarization:', error);
    res.status(500).json({ error: 'Failed to summarize emails' });
  }
});

module.exports = router;
