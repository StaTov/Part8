import { useApolloClient } from "@apollo/client"


const LogOut = ({ setToken }) => {

    const client = useApolloClient()

    const handleClick = () => {
        setToken(null)
        client.resetStore()
        localStorage.removeItem('booksApp-user-token')
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