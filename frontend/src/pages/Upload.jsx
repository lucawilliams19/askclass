import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createFile } from '../features/files/fileSlice'

import AnalyticsItem from '../components/Analytics/AnalyticsItem'

function Upload() {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const [fileData, setFileData] = useState({
		name: '',
		type: '',
		content: '',
	})
	let entryData = []
	let entryChat = []

	const [tableData, setTableData] = useState({
		name: '',
		type: '',
		content: [
			{
				studentName: '',
				ParticipationCountOfStudent: 0,
			},
		],
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
			})

			for (let i = 0; i < fileValueAsArray.length; i++) {
				if (i % 2 === 0 && i >= 1) {
				}
			}

			// Create two arrays one for data about chat and the other for the text of the chat log

			console.log('Original array: ', fileValueAsArray)
			console.log(
				'This is all the text: ',
				fileValueAsArray.map((x, i) => {
					if (i % 2 === 0) {
						entryData.push(x)
					}
					if (i % 2 !== 0 && i >= 0) {
						entryChat.push(x)
					}
				})
			)

			let arrayOfEntries = entryData.map((e, i) => e + entryChat[i])
			console.log('This is the entry data: ', entryData)
			console.log('This is the entry chat: ', entryChat)
			console.log('Array of Entries: ', arrayOfEntries)
			let arrayOfTime = []

			// Set up arrays for names, time stamps, number of entries per name
			if (entryData) {
				// Create array of time
				entryData.map((chatData, i) => {
					if (i < entryData.length - 1) {
						arrayOfTime.push(chatData.split(':')[0] + chatData.split(':')[1] + chatData.split(':')[0].substring(0, 2))
					}
				})

				console.log('Array of time: ', arrayOfTime)
			}
		}

		if (fileExt[1] !== 'txt') {
			toast.error('File is not txt please upload a txt file')
		}
	}

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

	// Number of messages per user
	// Name
	// Number of messages for each name
	// First message timestamp
	// Last message time stamp

	// Number of messages per minute
	// Minute of time
	// Number of messages
	// Number of messages and uniquie users
	// Number of messages
	// Unique users
	// Users who participated at least 3 times
	// Messages by User by Timestamp
	// User
	// Message
	//Timestamp

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
	const onSubmit = (e) => {
		e.preventDefault()

		dispatch(createFile(fileData))
		// navigate( '/email' )
		setFileData({
			fileName: '',
			fileType: '',
			fileConent: '',
		})
		navigate('/Analytics')
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
			<section className='content'>
				<h3>Students:</h3>

				<table>
					<tbody>
						<tr>
							<th key={1}>Student Name: </th>
						</tr>
						{studentNameList.map((x, key) => (
							<tr key={key}>
								<td>{x}</td>
							</tr>
						))}

						<tr>
							<th key={2}> Number of participations</th>
						</tr>
					</tbody>
					<tfoot></tfoot>
				</table>
			</section>
			<br />
			{'Participation count: ' + participationCountForClass}
		</>
	)
}

export default Upload
