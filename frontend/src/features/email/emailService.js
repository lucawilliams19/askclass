import axios from 'axios'

const API_URL = '/api/send_email'

const sendEmail = async ( emailData ) => {
 const response = await axios.post( API_URL, emailData )
 return response.data
}
 
const emailService = {
 sendEmail,
}

export default emailService