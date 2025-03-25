const BackblazeB2 = require('backblaze-b2');
const dotenv = require('dotenv');

dotenv.config();

const b2 = new BackblazeB2({
    applicationKeyId: process.env.B2_KEY_ID,
    applicationKey: process.env.B2_APPLICATION_KEY
});

async function authorize() {
    await b2.authorize();
}

module.exports = { b2, authorize };
