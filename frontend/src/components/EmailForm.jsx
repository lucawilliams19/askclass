import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { createItem, reset } from '../features/items/itemSlice'
import { toast } from 'react-toastify'

function EmailForm() {
	const { state } = useLocation()

	if (state) {
		const { fileName, type, content } = state
	}

	const [itemData, setItemData] = useState({
		email: '',
		name: '',
	})
	const { email, name } = itemData

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const { user, isError, isSuccess, message } = useSelector((state) => state.item)

	const onChange = (e) => {
		setItemData((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}))
	}

	useEffect(() => {
		if (isError) {
			toast.error(message)
			dispatch(reset())
		}

		if (isSuccess) {
			navigate('/analytics', { state: state })
		}
	}, [user, isError, isSuccess, message, navigate])

	console.log(itemData.email)
	console.log(itemData.name)
	const onSubmit = (e) => {
		e.preventDefault()

		dispatch(createItem(itemData))
	}

	return (
		<div>
			<section className='heading'>
				<h1>Email</h1>
			</section>

			<section className='form'>
				<form onSubmit={onSubmit}>
					<div className='form-group'>
						<label htmlFor='text'> Email </label>
						<input type='text' name='email' id='email' value={email} onChange={onChange} />
						<label htmlFor='text'> Name </label>
						<input type='text' name='name' id='name' value={name} onChange={onChange} />
					</div>
					<div className='form-group'>
						<button className='btn btn-block' type='submit'>
							Add Email
						</button>
					</div>
				</form>
			</section>
		</div>
	)
}

export default EmailForm
