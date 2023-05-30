
const typeDefs = `
type Author {
   name: String!
   id: ID!
   born: Int
   bookCount: Int
}
type User {
    username: String!
    passwordHash: String!
    favoriteGenre: String!
    id: ID!
}
type Token {
    value: String!
}
type Book {
   title: String!
   published: Int
   author: Author!
   genres: [String]!
   id: ID!    
}
type Query {
   me: User
   authorCount: Int!
   bookCount: Int!
   allBooks(author: String, genres: String): [Book!]
   allAuthors: [Author!]!
}
type Mutation {
    createUser(
        username: String!
        password: String!
        favoriteGenre: String!
        ): User
    login(
        username: String!
        password: String!
    ): Token
    addAuthor(
        username: String!
        born: Int
    ): Author!
    addBook(
        title: String!
        author: String!
        published: Int
        genres: [String]!
      ): Book!
    editAuthor(
        name: String!, 
        setBornTo: Int!
      ): Author
}
`

module.exports = typeDefs