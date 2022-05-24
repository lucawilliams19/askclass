import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import EmailForm from '../components/EmailForm'
import EmailItem from '../components/EmailItem'
import Spinner from '../components/Spinner'
import { getItems, reset } from '../features/items/itemSlice'

function Dashboard() {
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const { user } = useSelector((state) => state.auth)
	const { items, isError, isLoading, message } = useSelector((state) => state.item)

	useEffect(() => {
		if (isError) {
			console.log(message)
		}

		if (!user) {
			navigate('/login')
		}

		// Fetch items from backend
		dispatch(getItems())

		// Return inside of a useEffect triggers on the component unmount
		return () => {
			dispatch(reset())
		}
	}, [user, navigate, dispatch])

	if (isLoading) {
		return <Spinner />
	}

	return (
		<>
			<section className='heading'>
				<h1>Welcome {user && user.name}</h1>
				<p>Email Dashboard</p>
			</section>
			<EmailForm />

			<section className='content'>
				{items.length > 0 ? (
					<div className='items'>
						{items.map((item) => (
							<EmailItem key={item._id} item={item} />
						))}
					</div>
				) : (
					<h3>No emails</h3>
				)}
			</section>
		</>
	)
}

export default Dashboard
