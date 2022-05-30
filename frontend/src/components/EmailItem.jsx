import { useDispatch } from 'react-redux'
import { deleteItem } from '../features/items/itemSlice'

function EmailItem({ item }) {
	const dispatch = useDispatch()
	return (
		<div className='item'>
			<div>{new Date(item.createdAt).toLocaleString('en-US')}</div>
			<h2>{ item.name }</h2>
			<h2>{ item.email }</h2>
			<button onClick={() => dispatch(deleteItem(item._id))} className='close'>
				X
			</button>
		</div>
	)
}

export default EmailItem
