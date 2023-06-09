import { useMutation, useQuery } from "@apollo/client"
import { ALL_AUTHORS, EDIT_AUTHOR } from "../query"
import { useState } from "react"


const Authors = () => {

  const { loading, error, data } = useQuery(ALL_AUTHORS)
  const [name, setName] = useState('Robert Martin')
  const [born, setBorn] = useState('')

  const handleName = ({ target }) => { setName(target.value) }
  const handleBorn = ({ target }) => { setBorn(target.value) }


  const [updater] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ALL_AUTHORS]
  })

  const updateAuthor = event => {
    event.preventDefault()
    updater({ variables: { name, setBornTo: +born } })

    setBorn('')
  }
  if (!data) {
    return null
  }
  if (loading) {
    return <div>loading...</div>
  }
  if (error) {
    return <div>{error.message}</div>
  }
  return (
    <div>
      <div>
        <h2>authors</h2>
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>born</th>
              <th>books</th>
            </tr>
            {data.allAuthors.map((a) => (
              <tr key={a.id}>
                <td>{a.name}</td>
                <td>{a.born}</td>
                <td>{a.bookCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <form onSubmit={updateAuthor}>
          <h3>Set birthyear</h3>
          <div>
            <label>
              name:
              <select
                value={name}
                onChange={handleName}>
                {data.allAuthors.map(a =>
                  <option value={a.name} key={a.id}>{a.name}</option>)}
              </select>
            </label>
          </div>
          <div>
            <label>
              born:
              <input
                type='number'
                min={0}
                value={born}
                onChange={handleBorn} />
            </label>
          </div>
          <button type='submit'>update author</button>
        </form>
      </div>
    </div>
  )
}

export default Authors
