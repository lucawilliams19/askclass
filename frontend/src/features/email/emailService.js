import axios from 'axios'

//const API_URL = 'http://localhost:5000/api/send_email'

const sendEmail = async ( emailData ) => {
 const response = await axios.post('http://localhost:5000/api/send_email', emailData)
 return response.data
}
 
const emailService = {
 sendEmail,
}

export default emailService