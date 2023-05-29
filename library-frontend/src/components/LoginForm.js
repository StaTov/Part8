
import { useEffect, useState } from "react"
import { useMutation } from "@apollo/client"
import { LOGIN } from "../query"
import { useNavigate } from "react-router-dom"

const LoginForm = ({ setToken }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    
    const [getToken, { data, error }] = useMutation(LOGIN)


    useEffect(() => {
        if (data) {
            const token = data.login.value
            setToken(token)
            localStorage.setItem('booksApp-user-token', token)
            
            navigate('/books')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    async function handleSubmit(event) {
        event.preventDefault()

        getToken({ variables: { username, password } })
        if (error)
            console.log(error.graphQLErrors[0].message)

        setUsername('')
        setPassword('')
        
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>username</label>
                    <input
                        value={username}
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </div>
                <div>
                    <label>password</label>
                    <input
                        type='password'
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <button type='submit'>login</button>
            </form>
        </div>
    )
}

export default LoginForm