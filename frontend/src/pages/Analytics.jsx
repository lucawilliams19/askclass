import React, { useState, useEffect, Component } from 'react'
import { useLocation } from 'react-router-dom'

function Analytics(chatLog) {
	const { state } = useLocation()
	// each item is passed in as array of char
	const { fileName, type, content } = state

	const [entries, setEntries] = useState({
		headers: [],
		msgs: [],
	})
	const [firstLoad, setFirstLoad] = useState(true)
	// States for different tables
	const [msgPerUser, setMsgPerUser] = useState({
		names: [],
		msgCount: [],
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

	let teacherName = 'damon moon'
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
				if (i % 2 !== 0 && i < fileDataArr.length - 2) {
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
				if (!name.toLowerCase().includes(teacherName.split(' ').reverse().join(', ')) && studentNames.indexOf(name) === i) {
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
			case 'fTimestamp':
				requestedData = studentNames.map((name) => {
					let timeIndexByName = []
					headers.map((header) => {
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

	const loadDataOnlyOnce = () => {
		setEntries({
			headers: getSetEntries('headers'),
			msgs: getSetEntries('msgs'),
		})

		setMsgPerUser({
			names: getSetMsgPerUser('names'),
			msgCount: getSetMsgPerUser('msgCount'),
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
	}

	useEffect(() => {
		loadDataOnlyOnce()
	}, [])

	const testVar = msgPerUser.fTimestamp
	// console.log('Name: ', msgPerUser.names)
	// console.log('first time stamp ', testVar)
	// console.log('last time stamp ', msgPerUser.lTimestamp)

	return (
		<div>
			<section className='heading'>
				<h1>Analytics</h1>
			</section>

			<section className='content'>
				<h3> results for {fileName}</h3>
			</section>
			<section>
				<table className='Number of messages per user'>
					<tr>
						<th>Name</th>
						<th>Number of messages</th>
						<th>First Message Timestamp</th>
						<th>Last Message Timestamp</th>
					</tr>

					{msgPerUser.names.map((name, i) => {
						return (
							<tr key={i}>
								<td>{name}</td>
								<td>{msgPerUser.msgCount[i]}</td>
								<td>{msgPerUser.fTimestamp[i]}</td>
								<td>{msgPerUser.lTimestamp[i]}</td>
							</tr>
						)
					})}
				</table>
				<table className='Number of messages and unqiue users'>
					<tr>
						<th> Number of messages</th>
						<th> Unique users </th>
						<th> Users who participated at least 3 times </th>
					</tr>

					<tr>
						<td>{numMsgAndUniqueUser.msgCounter}</td>
						<td>{numMsgAndUniqueUser.uniqueUser}</td>
						<td>{numMsgAndUniqueUser.minParticipation}</td>
					</tr>
				</table>
				{/* <table className='Messages-by-user-by-timestamp'>
					<tr>
						<th>User</th>
						<th>Message</th>
						<th>Time stamp</th>
					</tr>

					{msgByTime.user.map((user, i) => {
						return (
							<tr key={i}>
								<td>{user}</td>
								<td>{msgByTime.msg[i]}</td>
								<td>{msgByTime.timeStamp[i]}</td>
							</tr>
						)
					})}
				</table> */}

				<table className='original-chat-log'>
					<tr>
						<th>Original chat</th>
					</tr>
					{originalChat.headers.map((header, i) => {
						return (
							<tr key={i}>
								<td>{header + ' ' + originalChat.chat[i]}</td>
							</tr>
						)
					})}
				</table>
			</section>
		</div>
	)
}

export default Analytics
