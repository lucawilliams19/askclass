import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createFile } from '../features/files/fileSlice'

function Upload() {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const [fileData, setFileData] = useState({
		name: '',
		type: '',
		content: '',
	})

	const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.file)

	//const handleAnalytics = () => {}

	let fileValueAsArray
	const onChange = (e) => {
		const fileName = '' || document.getElementById('chatLog').files[0].name
		const fileExt = '' || fileName.split('.')
		const reader = new FileReader()
		reader.readAsText(e.target.files[0])

		reader.onload = (e) => {
			const text = e.target.result
			const regex = /\r\n/g
			fileValueAsArray = text.split(regex)
			setFileData({
				name: fileExt[0],
				type: fileExt[1],
				content: text,
			} )
			console.log('text: ', text.split(regex))
		}

		if (fileExt[1] !== 'txt') {
			toast.error('File is not txt please upload a txt file')
		}
	}

	console.log('This is the file data: ', fileData)
	let student = {
		name: {
			type: String,
		},
		participationCount: {
			type: Number,
		},
	}

	let tempArray = []
	let chatLog = fileData.content.split(/\r\n/g)
	let participationCountForClass = 0
	let studentName = ''
	let studentNameList = []
	let participationTimeStamps = []
	let currentTimeStamp = ''

	if (chatLog) {
		//loop through the chat logs
		for (let i = 0; i <= chatLog.length - 2; i++) {
			//even numbers are the entry data(time, from this person, to this person, and if it is addressed to everyone)

			tempArray = chatLog.at(i).split(' ')

			//Look at only the header of each chat
			if (i % 2 === 0) {
				// Ignore all DMs
				if (tempArray.at(tempArray.length - 1) === 'Everyone:') {
					participationCountForClass++
				}

				//get current student's name
				studentName = tempArray.at(3) + ' ' + tempArray.at(4)

				//if studentName unique add to namelist
				if (studentNameList.indexOf(studentName) === -1) {
					studentNameList.push(studentName)
				}

				//Store time stamps
				currentTimeStamp = tempArray.at(0)
				participationTimeStamps.push(currentTimeStamp)

				// When a student participated
			}

			//Odd numbers are the actual conent of the text
		}
	}
	console.log('this is the file data above onSubmit: ', fileData)
	const onSubmit = (e) => {
		e.preventDefault()

		dispatch(createFile(fileData))
		// navigate( '/email' )
		setFileData({
			fileName: '',
			fileType: '',
			fileConent: '',
		})
	}

	useEffect(() => {
		if (isError) {
			console.log(message)
			toast.error(message)
		}
	}, [user, isError, isSuccess, message, navigate])

	return (
		<>
			<section className='heading'>
				<h1>Upload zoom chat log</h1>
			</section>
			<h2>Analytics sent right to you</h2>
			<section className='form'>
				<form onSubmit={onSubmit}>
					<div className='form-group'>
						<h1>
							<input
								type='file'
								className='form-control'
								accept='.txt, text/plain'
								id='chatLog'
								name='chatLog'
								placeholder='Enter your name'
								onChange={onChange}
							></input>
						</h1>
					</div>

					<div className='form-group'>
						<button type='submit' className='btn btn-block'>
							Submit
						</button>
					</div>
				</form>
			</section>
			{'Students: ' + studentNameList + '\r\n\t'}
			<br />
			{'Participation count: ' + participationCountForClass}
		</>
	)
}

export default Upload
