import { Routes, Route, NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import AddBook from './components/AddBook'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'
import LogOut from './components/LogOut'
import { useApolloClient, useQuery, useSubscription } from '@apollo/client'
import { ME, BOOK_ADDED, ALL_BOOKS } from './query'
import { updateCache } from './helper'





const App = () => {
  const client = useApolloClient()
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)



  const { data } = useQuery(ME, {
    skip: !token
  })



  useEffect(() => {
    const userToken = localStorage.getItem('booksApp-user-token')
    if (userToken) setToken(userToken)
  }, [])

  useEffect(() => {
    if (data) setUser(data.me)
  }, [data])

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      window.alert(`${addedBook} added`)
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)

    }
  })


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
        <Route path='/recommend' element={<Recommend user={user} />} />
      </Routes>
    </div>
  )
}

export default App
