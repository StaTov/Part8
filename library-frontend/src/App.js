import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'

const App = () => {
  const [page, setPage] = useState('authors')

  return (
    <div>
      <div>
        <Link to="/authors">Authors</Link>
        <Link to='/books'>Books</Link>
        <Link to='/newbook'>NewBook</Link>
      </div>
      <Routes>
        <Route path="/authors" element={<Authors/>} />
        <Route path='/books' element={<Books/>} />
        <Route path='/newbook' element={<NewBook/>} />
      </Routes>
    </div>
  )
}

export default App
