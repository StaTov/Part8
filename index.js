const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { v1: uuid } = require('uuid')
const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')
require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('connected to MongoBD')
    })
    .catch((error) => {
        console.log('error connection to MongoDB: ', error.message)
    })

let authors = [
    {
        name: "Robert Martin",
        id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
        born: 1952,
    },
    {
        name: "Martin Fowler",
        id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
        born: 1963,
    },
    {
        name: "Fyodor Dostoevsky",
        id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
        born: 1821,
    },
    {
        name: "Joshua Kerievsky", // birthyear not known
        id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
    },
    {
        name: "Sandi Metz", // birthyear not known
        id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
    },
];

let books = [
    {
        title: "Clean Code",
        published: 2008,
        author: "Robert Martin",
        id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
        genres: ["refactoring"],
    },
    {
        title: "Agile software development",
        published: 2002,
        author: "Robert Martin",
        id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
        genres: ["agile", "patterns", "design"],
    },
    {
        title: "Refactoring, edition 2",
        published: 2018,
        author: "Martin Fowler",
        id: "afa5de00-344d-11e9-a414-719c6709cf3e",
        genres: ["refactoring"],
    },
    {
        title: "Refactoring to patterns",
        published: 2008,
        author: "Joshua Kerievsky",
        id: "afa5de01-344d-11e9-a414-719c6709cf3e",
        genres: ["refactoring", "patterns"],
    },
    {
        title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
        published: 2012,
        author: "Sandi Metz",
        id: "afa5de02-344d-11e9-a414-719c6709cf3e",
        genres: ["refactoring", "design"],
    },
    {
        title: "Crime and punishment",
        published: 1866,
        author: "Fyodor Dostoevsky",
        id: "afa5de03-344d-11e9-a414-719c6709cf3e",
        genres: ["classic", "crime"],
    },
    {
        title: "The Demon ",
        published: 1872,
        author: "Fyodor Dostoevsky",
        id: "afa5de04-344d-11e9-a414-719c6709cf3e",
        genres: ["classic", "revolution"],
    },
];

const typeDefs = `
    type Author {
       name: String!
       id: ID!
       born: Int
       bookCount: Int
}
    type Book {
       title: String!
       published: Int
       author: Author!
       genres: [String]!
       id: ID!    
}
    type Query {
       authorCount: Int!
       bookCount: Int!
       allBooks(author: String, genres: String): [Book!]
       allAuthors: [Author!]!
}
    type Mutation {
        addAuthor(
            name: String!
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


const resolvers = {
    Query: {
        authorCount: async () => Author.collection.countDocuments(),

        bookCount: () => Book.collection.countDocuments(),

        allBooks: async (root, args) => {

            const books = await Book.find({}).populate('author', { name: 1, id: 1 })

            let filtredBooksByAuthor = !args.author
                ? books
                : books.filter(b => b.author.name === args.author)

            let filtredBooksByGenres = !args.genres
                ? filtredBooksByAuthor
                : filtredBooksByAuthor.filter(b => b.genres.includes(args.genres))

            return filtredBooksByGenres
        },

        allAuthors: async () => Author.find({}),
    },
    Author: {
        bookCount: async (root) => {
            const books = await Book.find({}).populate('author')
            return books.filter(b => b.author.name === root.name).length
        }


    },
    Mutation: {
        addBook: async (root, args) => {
            let id
            const author = await Author.findOne({ name: args.author })
            
            if (author) {
                id = author.id
            } else {
                const newAuthor = new Author({ name: args.author })
                await newAuthor.save()
                id = newAuthor._id
            }

            const newBook = new Book({ ...args, author: id })
            await newBook.save()

            return await Book.findOne({ title: args.title }).populate('author')

        },
        editAuthor: (root, args) => {
            const author = authors.find(a => a.name === args.name)
            if (!author) {
                return null
            }
            const updatedAuthor = { ...author, born: args.setBornTo }
            authors = authors.map(a => a.name === args.name ? updatedAuthor : a)
            return updatedAuthor
        }
    }
}


const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const PORT = process.env.PORT

startStandaloneServer(server, {
    listen: { port: PORT },
}).then(({ url }) => {
    console.log(`Server ready at ${url}`);
});
