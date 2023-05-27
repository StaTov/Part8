import { Routes, Route, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import LogOut from './components/LogOut'


const App = () => {

  useEffect(() => {
    const userToken = localStorage.getItem('booksApp-user-token')
    if (userToken) setToken(userToken)
  }, [])

  const [token, setToken] = useState(null)

  return (
    <div>
      <nav>
        <Link to='/authors'>Authors</Link>
        <Link to='/books'>Books</Link>
        <Link to='/newbook'>NewBook</Link>
        {token
          ? <LogOut setToken={setToken} />
          : <Link to='/login'>Login</Link>
        }
      </nav>
      <Routes>
        <Route path="/authors" element={<Authors />} />
        <Route path='/books' element={<Books />} />
        <Route path='/newbook' element={<NewBook />} />
        <Route path='/login' element={<LoginForm setToken={setToken} />} />
      </Routes>
    </div>
  )
}

export default App
