import { ALL_BOOKS } from "../query"
import { useQuery } from "@apollo/client"
import { useState } from "react"

const genre = ['refactoring', 'agile', 'patterns', 'design', 'crime', 'classic', null]

const Books = () => {

  const [nameGenre, setNameGenre] = useState(null)
  
  const { loading, error, data, refetch } = useQuery(ALL_BOOKS)
  

  if (loading) {
    return (<div>loading...</div>)
  }
  if (error) {
    return `Error! ${error.message}`
  }
 
  

  return (
    <div>
      <h2>books</h2>
      <div>in genre <strong>{nameGenre || 'all genres'}</strong></div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {data.allBooks.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genre.map(g =>
          <button
            key={g}
            onClick={() =>{setNameGenre(g); refetch({genres: g})}}
          >{g || 'all genres'}</button>)}
      </div>
    </div>
  )
}

export default Books
