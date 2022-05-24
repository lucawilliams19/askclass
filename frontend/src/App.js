import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

//Import local functional components
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Upload from './pages/Upload'
import Analytics from './pages/Analyics'
import EmailForm from './components/EmailForm'

function App() {
	return (
		<>
			<Router>
				<div className='container'>
					<Header />
					<Routes>
						{/* import dynamic dashbaord and give route path as '/' */}
						<Route path='/' element={<Dashboard />}></Route>
						{/* import dynamic Login and give route path as '/login' */}
						<Route path='/login' element={<Login />}></Route>
						{/* import dynamic Register and give route path as '/register' */}
						<Route path='/register' element={<Register />}></Route>
						{/* import dynamic Upload and give route path as '/upload' */}
						<Route path='/upload' element={<Upload />}></Route>
						{/* import dynamic email and give route path as '/email' */}
						{/* <Route path='/email' element={<EmailForm />}></Route> */}
						{/* import dynamic email and give route path as '/email' */}
						<Route path='/analytics' element={<Analytics />}></Route>
					</Routes>
				</div>
			</Router>
			<ToastContainer />
		</>
	)
}

export default App
