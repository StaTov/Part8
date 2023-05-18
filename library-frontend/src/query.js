import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
query Query {
    allAuthors {
      name
      bookCount
      born
    }
  }
`