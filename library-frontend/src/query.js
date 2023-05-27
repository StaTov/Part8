import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query Query {
      allAuthors {
        name
        bookCount
        born
        id
      }
    }
`
export const ALL_BOOKS = gql`
  query Query {
    allBooks {
      author {
        name
        id
        born
        bookCount
      }
      id
      published
      title
      genres
    }
  }
`
export const ADD_BOOK = gql`
mutation AddBook($title: String!, $author: String!, $published: Int, $genres: [String]!) {
  addBook(title: $title, author: $author, published: $published, genres: $genres) {
    title
    published
    author {
      bookCount
      name
      id
      born
    }
    genres
    id
  }
}
`
export const EDIT_AUTHOR = gql`
  mutation Mutation($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      bookCount
      born
      id
      name
    }
  }
`
export const LOGIN = gql`
  mutation GetToken($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
   }
  }
`