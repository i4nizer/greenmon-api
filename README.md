# Greenmon API

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/i4nizer/greemon-api.git
   ```
2. Navigate to the project directory:
   ```sh
   cd greenmon-api
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Set up environment variables (`.env` file):
   ```env
    NODE_ENV=development

    PORT=4001
    CLIENT_DOMAIN=http://localhost:3000
    CONNECTION_STRING=mongodb://localhost:27017/greenmonv1

    DEV_EMAIL=youremail@gmail.com

    API_EMAIL=websiteemail@gmail.com
    API_EMAIL_PASSWORD=websiteemailpsk

    OTP_LIFE=300000
    API_LIFE=604800000
    ACCESS_LIFE=900000
    REFRESH_LIFE=604800000

    RESET_PASSWORD_DURATION=900000

    OTP_DIGITS=6

    API_KEY=yourapikey
    ACCESS_KEY=youraccesskey
    REFRESH_KEY=yourrefreshkey
   ```
5. Start the server:
   ```sh
   npm start
   ```