import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import axios from 'axios'
import { CSVLink, CSVDownload } from 'react-csv'
import { usePapaParse } from 'react-papaparse'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { sendEmail, reset } from '../features/email/emailSlice'
import { Papa } from 'react-papaparse'

function Analytics(chatLog) {
	const { jsonToCSV } = usePapaParse()
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const { state } = useLocation()

	const { meetingTitle, content, teacherName, emailAddress } = state
console.log(emailAddress)
	const [entries, setEntries] = useState({
		headers: [],
		msgs: [],
	})
	const [firstLoad, setFirstLoad] = useState(true)
	// States for different tables
	const [msgPerUser, setMsgPerUser] = useState({
		names: [],
		msgCount: [],
		participationCount: [],
		fTimestamp: [],
		lTimestamp: [],
	})

	const [numMsgAndUniqueUser, setNumMsgAndUniqueUser] = useState({
		msgCounter: 0,
		uniqueUser: 0,
		minParticipation: 0,
	})
	const [msgByTime, setMsgByTime] = useState({
		user: [],
		msg: [],
		timeStamp: [],
	})

	const [originalChat, setOriginalChat] = useState({
		headers: [],
		chat: [],
	})

	let fileDataTxt = ''
	let fileDataArr = []
	let headers = []
	let msgs = []
	let studentNames = []
	let msgsSortedByName = []
	let indexOfStudentMsgs = []

	const alphaNumericSortArr = (arr) => {
		return arr
			.sort((currentName, nextName) => {
				return currentName.localeCompare(nextName, undefined, {
					numeric: true,
					sensitivity: 'base',
				})
			})
			.filter((name) => {
				if (name) {
					return true
				} else return false
			})
	}

	// If the file exists then set variables
	if (state) {
		fileDataTxt = content
		fileDataArr = content.split(/\r\n/g)

		headers = fileDataArr
			.map((header, i) => {
				if (i % 2 === 0 && i < fileDataArr.length - 2) {
					return header
				} else return null
			})
			.filter((header) => {
				if (!header) {
					return false
				}
				return true
			})

		msgs = fileDataArr
			.map((header, i) => {
				if (i % 2 !== 0 && i < fileDataArr.length - 1) {
					return header
				} else return null
			})
			.filter((header) => {
				if (!header) {
					return false
				}
				return true
			})

		studentNames = headers.map((header) => {
			// Omit time stamp, sender, address
			let studentName = header
				.split(' ')
				.splice(3, header.split(' ').length - 7)
				.filter((name) => {
					if ((name.toLowerCase() === 'to' && name.length === 2) || name.length === 0) {
						return false
					}

					return true
				})
				.reverse()
				.join(', ')
			return studentName
		})
		// removes duplicates and teacher name
		studentNames = alphaNumericSortArr(
			studentNames.filter((name, i) => {
				if (
					!name.toLowerCase().includes(teacherName.toLowerCase().split(' ').reverse().join(', ')) &&
					studentNames.indexOf(name) === i
				) {
					return true
				}
				return false
			})
		).map((name) => {
			return name.split(', ').reverse().join(' ')
		})
	}

	for (let i = 0; i < headers.length; i++) {
		msgsSortedByName.push(headers[i] + ' ' + msgs[i])
	}

	let temp = {
		names: studentNames,
		msgCount: studentNames.map((name) => {
			let chatCount = 0
			headers.map((header, i) => {
				let currentMsgAsArr = []

				if (header.includes(name) && !header.toLowerCase().includes(teacherName)) {
					chatCount++
				}
				if (headers) {
					return true
				} else return false
			})
			if (chatCount > 0) {
				return chatCount
			} else return null
		}),
		participationCount: studentNames.map((name) => {
			let chatCount = 0
			headers.map((header, i) => {
				let currentMsgAsArr = []

				if (header.includes(name) && !header.toLowerCase().includes(teacherName)) {
					if (msgs[i] && msgs[i].split(' ').length >= 7) {
						chatCount++
					}
				}
				if (headers) {
					return true
				} else return false
			})
			if (chatCount > 0) {
				return chatCount
			} else return null
		}),
		fTimestamp: studentNames.map((name) => {
			let timeIndexByName = []

			headers.map((header, i) => {
				if (header.indexOf(name) !== -1 && !header.toLowerCase().includes(teacherName)) {
					timeIndexByName.push(header.split(' ')[0].split(':').join(''))
				}

				if (headers) {
					return true
				} else return false
			})

			return timeIndexByName[0]
		}),
		lTimestamp: studentNames.map((name) => {
			let timeIndexByName = []
			headers.map((header) => {
				if (header.indexOf(name) !== -1 && !header.toLowerCase().includes(teacherName)) {
					timeIndexByName.push(header.split(' ')[0].split(':').join(''))
				}
			})

			return timeIndexByName[timeIndexByName.length - 1]
		}),
	}

	const getSetEntries = (specifiedField) => {
		let requestedData = []

		switch (specifiedField) {
			// If headers get only the headers
			case 'headers':
				requestedData = headers

				break

			// If msgs get only the messages
			case 'msgs':
				requestedData = msgs
				break

			default:
				break
		}

		return requestedData
	}

	const getSetMsgPerUser = (specifiedField) => {
		let requestedData = []

		switch (specifiedField) {
			case 'names':
				requestedData = studentNames

				break

			case 'msgCount':
				requestedData = studentNames.map((name) => {
					let chatCount = 0
					headers.map((header, i) => {
						let currentMsgAsArr = []

						if (header.includes(name) && !header.toLowerCase().includes(teacherName)) {
							chatCount++
						}
						if (headers) {
							return true
						} else return false
					})
					if (chatCount > 0) {
						return chatCount
					} else return null
				})

				break
			case 'participationCount':
				requestedData = studentNames.map((name) => {
					let chatCount = 0
					headers.map((header, i) => {
						let currentMsgAsArr = []

						if (header.includes(name) && !header.toLowerCase().includes(teacherName)) {
							if (msgs[i] && msgs[i].split(' ').length >= 7) {
								chatCount++
							}
						}
						if (headers) {
							return true
						} else return false
					})
					if (chatCount > 0) {
						return chatCount
					} else return null
				})

				break
			case 'fTimestamp':
				requestedData = studentNames.map((name) => {
					let timeIndexByName = []

					headers.map((header, i) => {
						if (header.indexOf(name) !== -1 && !header.toLowerCase().includes(teacherName)) {
							timeIndexByName.push(header.split(' ')[0].split(':').join(''))
						}

						if (headers) {
							return true
						} else return false
					})

					return timeIndexByName[0]
				})
				break
			case 'lTimestamp':
				requestedData = requestedData = studentNames.map((name) => {
					let timeIndexByName = []
					headers.map((header) => {
						if (header.indexOf(name) !== -1 && !header.toLowerCase().includes(teacherName)) {
							timeIndexByName.push(header.split(' ')[0].split(':').join(''))
						}
					})

					return timeIndexByName[timeIndexByName.length - 1]
				})
				break
			default:
				break
		}

		return requestedData
	}

	const getSetMsgAndUniqueUsers = (specifiedField) => {
		let requestedData = 0
		switch (specifiedField) {
			case 'msgCounter':
				requestedData = headers.length
				break
			case 'uniqueUser':
				requestedData = studentNames.length
				break
			case 'minParticipation':
				requestedData = studentNames
					.map((name) => {
						let counter = 0
						headers.map((header) => {
							if (header.includes(name)) {
								counter++
							}
						})
						return counter
					})
					.filter((x) => {
						if (x > 2) {
							return true
						} else return false
					}).length

				break

			default:
				break
		}

		return requestedData
	}
	const getSetMsgByTime = (specifiedField) => {
		let requestedData = []
		switch (specifiedField) {
			case 'user':
				requestedData = headers.map((header) => {
					// Omit time stamp, sender, address
					let studentName = header
						.split(' ')
						.splice(3, header.split(' ').length - 7)
						.filter((name) => {
							if ((name.toLowerCase() === 'to' && name.length === 2) || name.length === 0) {
								return false
							}

							return true
						})
						.reverse()
						.join(', ')
					return studentName
				})
				requestedData = alphaNumericSortArr(
					requestedData.filter((name, i) => {
						if (!name.toLowerCase().includes(teacherName.split(' ').reverse().join(', '))) {
							return true
						}
						return false
					})
				).map((name) => {
					return name.split(', ').reverse().join(' ')
				})
				break

			case 'msg':
				let tempStudentName = headers.map((header) => {
					// Omit time stamp, sender, address
					let studentName = header
						.split(' ')
						.splice(3, header.split(' ').length - 7)
						.filter((name) => {
							if ((name.toLowerCase() === 'to' && name.length === 2) || name.length === 0) {
								return false
							}

							return true
						})
						.reverse()
						.join(', ')
					return studentName
				})
				// removes duplicates and teacher name
				studentNames = alphaNumericSortArr(
					studentNames.filter((name, i) => {
						if (!name.toLowerCase().includes(teacherName.split(' ').reverse().join(', ')) && studentNames.indexOf(name) === i) {
							return true
						}
						return false
					})
				).map((name) => {
					return name.split(', ').reverse().join(' ')
				})
				requestedData = indexOfStudentMsgs.map((location, i) => {
					// console.log(tempStudentName)
				})
				console.log(msgs)

				break

			case 'timeStamp':
				requestedData = headers.map((header) => {
					return header.split(' ')[0]
				})

				break
			default:
				break
		}
		return requestedData
	}

	const getSetOriginalChat = (specifiedField) => {
		let requestedData = []

		switch (specifiedField) {
			case 'headers':
				requestedData = headers
				break
			case 'chat':
				requestedData = msgs
				break

			default:
				break
		}
		return requestedData
	}

	const fileName = (category) => {
		let newDate = new Date()
		return (
			newDate.getDate() +
			'-' +
			newDate.getMonth() +
			'-' +
			newDate.getFullYear() +
			'_' +
			teacherName
				.split(' ')
				.map((name) => {
					return name.substring(0, 1).toUpperCase() + name.substring(1, name.length)
				})
				.join('_') +
			'_' +
			meetingTitle.split(' ').join('_') +
			'_' +
			category +
			'.csv'
		)
	}

	const [emailData, setEmailData] = useState({
		email: '',
		text: '',
		file: {
			filename: '',
			content: '',
			contentType: '',
		},
	})

	let csvData = {
		msgPerUser: {
			fileName: fileName(''),
			header: [
				{ label: 'Name', key: 'name' },
				{ label: 'Number of Messages', key: 'numMsgs' },
				{ label: 'Messages longer than 7 words', key: 'partCount' },
				{ label: 'First Message Timestamp', key: 'fMsg' },
				{ label: 'Last Message Timestamp', key: 'lMsg' },
			],
			data: [
				...msgPerUser.names.map((name, i) => {
					return {
						name: name,
						numMsgs: msgPerUser.msgCount[i],
						partCount: msgPerUser.participationCount[i],
						fMsg: msgPerUser.fTimestamp[i],
						lMsg: msgPerUser.lTimestamp[i],
					}
				}),
				{
					name: '',
					numMsgs: '',
					partCount: '',
					fMsg: '',
					lMsg: '',
				},
				{
					name: 'Number of messages',
					numMsgs: 'Unique users',
					partCount: 'Participated at least 3 times',
					fMsg: '',
					lMsg: '',
				},
				{
					name: numMsgAndUniqueUser.msgCounter,
					numMsgs: numMsgAndUniqueUser.uniqueUser,
					partCount: numMsgAndUniqueUser.minParticipation,
					fMsg: '',
					lMsg: '',
				},
				{
					name: '',
					numMsgs: '',
					partCount: '',
					fMsg: '',
					lMsg: '',
				},
				{
					name: 'first name',
					numMsgs: 'last name',
					partCount: ' time',
					fMsg: 'message',
					lMsg: '',
				},
				...originalChat.headers.map((header, i) => {
					return {
						// First name
						name: header
							.split(' ')
							.splice(3, header.split(' ').length - 7)
							.filter((name) => {
								if ((name.toLowerCase() === 'to' && name.length === 2) || name.length === 0) {
									return false
								}

								return true
							})[0],
						// Last name
						numMsgs: header
							.split(' ')
							.splice(3, header.split(' ').length - 7)
							.filter((name, i) => {
								if ((name.toLowerCase() === 'to' && name.length === 2) || name.length === 0) {
									return false
								}
								return true
							})[
							header
								.split(' ')
								.splice(3, header.split(' ').length - 7)
								.filter((name, i) => {
									if ((name.toLowerCase() === 'to' && name.length === 2) || name.length === 0) {
										return false
									}
									return true
								}).length - 1
						],
						// Time
						partCount: header.split(' ')[0],
						//Message
						fMsg: originalChat.chat[i],
					}
				}),
			],
		},
	}

	let csvData2 = [
		...temp.names.map((name, i) => {
			return {
				name: name,
				numMsgs: temp.msgCount[i],
				partCount: temp.participationCount[i],
				fMsg: temp.fTimestamp[i],
				lMsg: temp.lTimestamp[i],
			}
		}),
		{
			name: '',
			numMsgs: '',
			partCount: '',
			fMsg: '',
			lMsg: '',
		},
		{
			name: 'Number of messages',
			numMsgs: 'Unique users',
			partCount: 'Participated at least 3 times',
			fMsg: '',
			lMsg: '',
		},
		{
			name: temp.msgCounter,
			numMsgs: temp.uniqueUser,
			partCount: temp.minParticipation,
			fMsg: '',
			lMsg: '',
		},
		{
			name: '',
			numMsgs: '',
			partCount: '',
			fMsg: '',
			lMsg: '',
		},
		{
			name: 'first name',
			numMsgs: 'last name',
			partCount: ' time',
			fMsg: 'message',
			lMsg: '',
		},
		...originalChat.headers.map((header, i) => {
			return {
				// First name
				name: header
					.split(' ')
					.splice(3, header.split(' ').length - 7)
					.filter((name) => {
						if ((name.toLowerCase() === 'to' && name.length === 2) || name.length === 0) {
							return false
						}

						return true
					})[0],
				// Last name
				numMsgs: header
					.split(' ')
					.splice(3, header.split(' ').length - 7)
					.filter((name, i) => {
						if ((name.toLowerCase() === 'to' && name.length === 2) || name.length === 0) {
							return false
						}
						return true
					})[
					header
						.split(' ')
						.splice(3, header.split(' ').length - 7)
						.filter((name, i) => {
							if ((name.toLowerCase() === 'to' && name.length === 2) || name.length === 0) {
								return false
							}
							return true
						}).length - 1
				],
				// Time
				partCount: header.split(' ')[0],
				//Message
				fMsg: originalChat.chat[i],
			}
		}),
	]

	const loadDataOnlyOnce = () => {
		setEntries({
			headers: getSetEntries('headers'),
			msgs: getSetEntries('msgs'),
		})

		setMsgPerUser({
			names: getSetMsgPerUser('names'),
			msgCount: getSetMsgPerUser('msgCount'),
			participationCount: getSetMsgPerUser('participationCount'),
			fTimestamp: getSetMsgPerUser('fTimestamp'),
			lTimestamp: getSetMsgPerUser('lTimestamp'),
		})

		setNumMsgAndUniqueUser({
			msgCounter: getSetMsgAndUniqueUsers('msgCounter'),
			uniqueUser: getSetMsgAndUniqueUsers('uniqueUser'),
			minParticipation: getSetMsgAndUniqueUsers('minParticipation'),
		})

		// setMsgByTime({
		// 	user: getSetMsgByTime('user'),
		// 	msg: getSetMsgByTime('msg'),
		// 	timeStamp: getSetMsgByTime('timeStamp'),
		// })

		setOriginalChat({
			headers: getSetOriginalChat('headers'),
			chat: getSetOriginalChat('chat'),
		})

		setEmailData({
			...emailData,
			email: emailAddress,
			file: {
				filename: csvData.msgPerUser.fileName,
				content: jsonToCSV(csvData2),
				contentType: 'csv',
			},
		} )
		
		setSent(true)

		// console.log('email address', state.emailAddress)

		dispatch(sendEmail(emailData))
	}

	const [sent, setSent] = useState(false)
	const [text, setText] = useState('')

	const setCSV = () => {
		console.log(jsonToCSV(csvData.msgPerUser.data).toString())
		setEmailData({
			file: {
				filename: csvData.msgPerUser.fileName,
				content: 'This makes me want to die, but I am not sure how to do that.',
				contentType: 'csv',
			},
		})
		console.log(emailData)
	}

	const handleSend = async ( e ) => {

		e.preventDefault()
	
		// setSent(true)

		// // console.log('email address', state.emailAddress)

		// dispatch(sendEmail(emailData))
	}

	useEffect(() => {
		let ignore = false
		if (!ignore) {
			loadDataOnlyOnce()
			// handleSend()
		}
		return () => {
			ignore = true
		}
	}, [state])

	const handleClick = (e) => {
		e.preventDefault()

		navigate('/')
	}

	return (
		<div>
			<section className='heading'>
				<h1>Analytics</h1>
			</section>
		
			

			<button onClick={handleClick} className='btn btn-block'>
				Upload a new document
			</button>

			<div>
				{!sent ? (
					<div>
						<h1>Loading</h1>
						<button onClick={handleSend} className='btn btn-block'>
							send Email
						</button>
					</div>
				) : (
					<h1>Email Sent</h1>
				)}
			</div>
		</div>
	)
}

export default Analytics
