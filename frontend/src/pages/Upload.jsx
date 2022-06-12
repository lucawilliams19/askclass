import React, { useState, useEffect, createContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createFile } from '../features/files/fileSlice'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { sendEmail, reset } from '../features/email/emailSlice'
import AnalyticsItem from '../components/Analytics/AnalyticsItem'
import Analytics from './Analytics'

function Upload() {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const [fileData, setFileData] = useState({
		fileName: '',
		fileType: '',
		fileContent: '',
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
			setFileData({
				fileName: fileExt[0],
				fileType: fileExt[1],
				fileContent: text,
			})
		}

		if (fileExt[1] !== 'txt') {
			toast.error('File is not txt please upload a txt file')
		}
	}
	const onSubmit = (e) => {
		e.preventDefault()

		if (!fileData.fileContent) {
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
