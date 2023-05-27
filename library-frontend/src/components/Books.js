import { ALL_BOOKS } from "../query"
import { useQuery } from "@apollo/client"

const Books = () => {

  const { loading, error, data } = useQuery(ALL_BOOKS)


  if (loading) {
    
    return (<div>loading...</div>)
  }
  if(error) {
    return `Error! ${error.message}`
  }

  return (
    <div>
      <h2>books</h2>

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
    </div>
  )
}

export default Books
