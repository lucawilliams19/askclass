import React, { useState, useEffect, createContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createFile } from '../features/files/fileSlice'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import AnalyticsItem from '../components/Analytics/AnalyticsItem'
import Analytics from './Analytics'

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
				fileName: fileExt[0],
				type: fileExt[1],
				content: text,
			})

			for (let i = 0; i < fileValueAsArray.length; i++) {
				if (i % 2 === 0 && i >= 1) {
				}
			}

			// Create two arrays one for data about chat and the other for the text of the chat log

			let arrayOfEntries = entryData.map((e, i) => e + entryChat[i])

			let arrayOfTime = []

			// Set up arrays for names, time stamps, number of entries per name
			if (entryData) {
				// Create array of time
				entryData.map((chatData, i) => {
					if (i < entryData.length - 1) {
						arrayOfTime.push(chatData.split(':')[0] + chatData.split(':')[1] + chatData.split(':')[0].substring(0, 2))
					}
				})
			}
		}

		if (fileExt[1] !== 'txt') {
			toast.error('File is not txt please upload a txt file')
		}
	}

	let tempArray = []
	let chatLog
	if (fileData.content) {
		chatLog = fileData.content.split(/\r\n/g)
	}
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
	const onSubmit = (e) => {
		e.preventDefault()

		// dispatch(createFile(fileData))
		// navigate( '/email' )

		if (!fileData.content) {
			toast.error('Please upload a zoom chat log file')
		} else navigate('/email', { state: fileData })
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
			<h2>Analytics made for you</h2>
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
		</>
	)
}

export default Upload
