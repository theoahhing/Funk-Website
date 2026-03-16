# Grocery Customer Service For Funk's Produce

A modern, customer service website with a Node.js + Express backend, OpenAI integration, and email summaries via Nodemailer.

## Future Features
- Sticky navigation and hero CTA
- Floating chat widget with typing indicator
- GPT-4o powered customer service replies
- Issue resolution detection with email summary
- Mobile-responsive layout

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file (already included in this project). Update the values:
   ```env
   OPENAI_API_KEY=your_openai_key_here
   STORE_OWNER_EMAIL=owner@store.com
   GMAIL_USER=your_gmail@gmail.com
   GMAIL_PASS=your_gmail_app_password
   PORT=3000
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Open in your browser:
   ```
   http://localhost:3000
   ```

## Getting an OpenAI API Key
1. Create or sign in to your OpenAI account.
2. Go to the API keys page.
3. Create a new secret key and paste it into `.env` as `OPENAI_API_KEY`.

## Gmail App Password
If you use Gmail SMTP, generate an App Password for the account and set it as `GMAIL_PASS` in `.env`.

## Notes
- The frontend lives entirely in `index.html` with inline CSS/JS.
- The backend handles all OpenAI requests and email sending.
- Full conversation history is sent to the API on each message.
