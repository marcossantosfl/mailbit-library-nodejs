const axios = require('axios');

class Mailbit {
    constructor(apiKey) {
        if (!apiKey) {
            throw new Error("API key is required");
        }
        this.apiKey = apiKey;
        this.baseUrl = 'https://public-api.mailbit.io';
    }

    static generateErrorMessage(code, message) {
        return { code, message };
    }

    async sendEmail(emailData) {
        const url = `${this.baseUrl}/send-email`;

        try {
            const response = await axios.post(url, emailData, { headers: { 'token': this.apiKey } });
            console.log('Email sent successfully:', response.data.message);
            return response.data;
        } catch (err) {
            if (err.response) {
                const { code, message } = err.response.data;
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
