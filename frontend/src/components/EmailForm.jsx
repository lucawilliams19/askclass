import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { createItem, reset } from '../features/items/itemSlice'
import { toast } from 'react-toastify'
import emailjs from 'emailjs-com'

function EmailForm() {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { state } = useLocation()
	const { fileName, fileType, fileContent } = state

	const [passData, setPassData] = useState({
		teacherName: '',
		meetingTitle: '',
		passFileName: '',
		type: '',
		content: '',
		emailAddress: '',
	})
	const { meetingTitle, passFileName, type, content } = passData
	const [itemData, setItemData] = useState({
		email: '',
		name: '',
	})
	const { email, name } = itemData

	const { user, isError, isSuccess, message } = useSelector((state) => state.item)

	const onChange = (e) => {
		e.preventDefault()

		let fieldName = e.target.name
		switch (fieldName) {
			case 'meetingTitle':
				setPassData((prevState) => ({
					...prevState,
					meetingTitle: e.target.value,
					passFileName: fileName,
					type: fileType,
					content: fileContent,
				}))

				break

			default:
				setItemData((prevState) => ({
					...prevState,
					[e.target.name]: e.target.value,
				}))
				break
		}
	}

	useEffect(() => {
		// if (isError) {
		// 	toast.error(message)
		// 	dispatch(reset())
		// }

		// if (isSuccess) {
		// 	navigate('/analytics', { state: passData })
		// }
	}, [user, isError, isSuccess, message, navigate])

	const setTheStuff = () => { 
	setPassData((prevState) => ({
		...prevState,
		teacherName: name,
		meetingTitle: meetingTitle,
		passFileName: fileName,
		passFileType: state.fileType,
		passFileContent: state.fileContent,
		emailAddress: itemData.email,
	}))
	}

	const onSubmit = (e) => {
		e.preventDefault()

		console.log(itemData.email)

	setTheStuff()
		
		dispatch(createItem(itemData))
		if (isError) {
			toast.error(message)
			dispatch(reset())
		}

if (isSuccess) {
	navigate('/analytics', { state: passData })
}
	}

	return (
		<div>
			<section className='heading'>
				<h1>Email</h1>
			</section>

			<section className='form'>
				<form onSubmit={onSubmit}>
					<div className='form-group'>
						<label htmlFor='text'> Meeting Title </label>
						<input
							placeholder='ex: Psych 101 session 3'
							type='text'
							name='meetingTitle'
							id='meetingTitle'
							value={meetingTitle}
							onChange={onChange}
						/>
						<label htmlFor='text'> Email </label>
						<input
							placeholder='ex: teacher@schoolemail.com'
							type='text'
							name='email'
							id='email'
							value={email}
							onChange={onChange}
						/>
						<label htmlFor='text'> Name </label>
						<input placeholder='ex: John Doe' type='text' name='name' id='name' value={name} onChange={onChange} />
					</div>
					<div className='form-group'>
						<button className='btn btn-block' type='submit'>
							Submit
						</button>
					</div>
				</form>
			</section>
			<section>
				<p>Analysis report will be sent via email</p>

				<br />
				<footer>
					<p>
						We will occasionally send product updates that could help engage your audience <br />
						AskClass will never sell your data
					</p>
				</footer>
			</section>
		</div>
	)
}

export default EmailForm
