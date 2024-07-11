const axios = require('axios');

class Mailbit {
    constructor(apiKey, baseUrl = 'https://public-api.mailbit.io') {
        if (!apiKey) {
            throw new Error("API key is required");
        }
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;

        // Create an axios instance with default configuration
        this.client = axios.create({
            baseURL: this.baseUrl,
            headers: {
                'token': this.apiKey,
                'Connection': 'keep-alive',
                'Content-Type': 'application/json'
            },
            timeout: 30000,
        });
    }

    static generateErrorMessage(code, message) {
        return { code, message };
    }

    async sendEmail(emailData) {
        const url = '/send-email';

        try {
            const response = await this.client.post(url, emailData);
            console.log('Email sent successfully:', response.data.message);
            return response.data;
        } catch (err) {
            if (err.response) {
                const responseBody = err.response.data;
                let message;
                let code;

                if (Array.isArray(responseBody.errors)) {
                    message = responseBody.errors.map(error => `Code: ${error.code}, Message: ${error.message}`).join(' | ');
                    code = err.response.status;
                } else {
                    code = responseBody.code || 'Unknown';
                    message = responseBody.message || 'No error message provided';
                }

                console.error(`Error sending email\nCode: ${code}\nMessage: ${message}`);
                throw Mailbit.generateErrorMessage(code, message);
            } else if (err.request) {
                console.error('Error sending email - No response received:', err.request);
                throw new Error('No response received from Mailbit API');
            } else {
                console.error('Error sending email - General error:', err.message);
                throw new Error(err.message);
            }
        }
    }
}

module.exports = Mailbit;
