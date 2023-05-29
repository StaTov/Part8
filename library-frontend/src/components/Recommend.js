import { useQuery } from "@apollo/client"
import { ALL_BOOKS } from "../query"


const Recommend = ({ user }) => {


    const { loading, error, data} = useQuery(ALL_BOOKS, {
        variables: { genres: user.favoriteGenre },
        skip: !user.favoriteGenre
    })



    if (loading) {
        return <div>loading...</div>
    }
    if (error) {
        return <div>{error.message}</div>
    }
    if (!data) {
        return null
    }
    return (
        <div>
            <h2>recommendation</h2>
            <div>
                books in your favorite genre <strong>{user.favoriteGenre}</strong>
            </div>
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

export default Recommend