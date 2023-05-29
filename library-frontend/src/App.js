import { Routes, Route, NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import AddBook from './components/AddBook'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'
import LogOut from './components/LogOut'
import { useQuery } from '@apollo/client'
import { ME } from './query'



const App = () => {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)

  const { data } = useQuery(ME, {
    skip: !token
  })


  console.log('me', user)
  useEffect(() => {
    const userToken = localStorage.getItem('booksApp-user-token')
    if (userToken) setToken(userToken)
  }, [])

  useEffect(() => {
    if (data) setUser(data.me)
  }, [data])




  return (
    <div>
      <nav>
        <NavLink to='/authors'>Authors</NavLink>
        <NavLink to='/books'>Books</NavLink>

        {token
          ? <>
            <NavLink to='/addbook'>AddBook</NavLink>
            <NavLink to='/recommend'>recommend</NavLink>
            <LogOut setToken={setToken} />
          </>
          : <NavLink to='/login'>Login</NavLink>
        }
      </nav>
      <Routes>
        <Route path="/authors" element={<Authors />} />
        <Route path='/books' element={<Books />} />
        <Route path='/addbook' element={<AddBook />} />
        <Route path='/login' element={<LoginForm setToken={setToken} />} />
        <Route path='/recommend' element={<Recommend user={user}/>} />
      </Routes>
    </div>
  )
}

export default App
