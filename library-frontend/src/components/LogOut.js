import { useApolloClient } from "@apollo/client"
import { useNavigate } from "react-router-dom"


const LogOut = ({ setToken }) => {

    const navigate = useNavigate()
    const client = useApolloClient()

    const handleClick = () => {
        setToken(null)
        client.resetStore()
        localStorage.removeItem('booksApp-user-token')
        navigate('/login')

    }
    return (
        <span>
            logged in
            <button
                onClick={handleClick}
            >
                logOut
            </button>
        </span>
    )
}

export default LogOut