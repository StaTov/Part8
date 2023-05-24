const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { v1: uuid } = require('uuid')
const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')
const { GraphQLError } = require('graphql')
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

            // check does author exist?

            if (author) {
                id = author.id
            } else {
                const newAuthor = new Author({ name: args.author })
          
                try {
                    await newAuthor.save()
                    id = newAuthor._id
                } catch (error) {
                    throw new GraphQLError('Field author failed', {
                        extensions: {
                            code: 'BAD_USER_INPUT',
                            invalidArgs: args.author,
                            error
                        }
                    })
                }
            }
            const newBook = new Book({ ...args, author: id })

            try {
                await newBook.save()
            } catch (error) {
                throw new GraphQLError('Saving book failed', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.title,
                        error
                    }
                })
            }

            return await Book.findOne({ title: args.title }).populate('author')

        },
        editAuthor: async (root, args) => {
            return await Author.findOneAndUpdate({ name: args.name }, { born: args.setBornTo }, { new: true })
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
