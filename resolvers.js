const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { GraphQLError } = require('graphql')
require('dotenv').config()

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const resolvers = {
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
        }
    },
    Query: {
        me: (root, args, { currentUser }) => currentUser,
        authorCount: async () => Author.collection.countDocuments(),

        bookCount: () => Book.collection.countDocuments(),

        allBooks: async (root, args) => {

            const books = await Book.find({}).populate('author', { name: 1, id: 1, born: 1 })

            let filtredBooksByAuthor = !args.author
                ? books
                : books.filter(b => b.author.name === args.author)

            let filtredBooksByGenres = !args.genres
                ? filtredBooksByAuthor
                : filtredBooksByAuthor.filter(b => b.genres.includes(args.genres))

            return filtredBooksByGenres
        },

        allAuthors: async () => {
        console.log('Author.find')
        return Author.find({})
        },
    },
    Author: {
        bookCount: async (root) => {
            const books = await Book.find({}).populate('author')
            return books.filter(b => b.author.name === root.name).length
        }
    },
    Mutation: {
        login: async (root, args) => {
            const user = await User.findOne({ username: args.username })
            const checkPassword = await bcrypt.compare(args.password, user.passwordHash)

            if (!user || !checkPassword) {
                throw new GraphQLError('wrong credentials', {
                    extensions: 'BAD_USER_INPUT'
                })
            }

            userForToken = {
                username: user.username,
                id: user._id
            }

            return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
        },
        createUser: async (root, args) => {
            const saltRounds = 10
            const passwordHash = await bcrypt.hash(args.password, saltRounds)

            const newUser = new User({ ...args, passwordHash })

            return newUser.save()
                .catch(error => {
                    throw new GraphQLError('Failed field', {
                        extensions: {
                            code: 'BAD_USER_INPUT',
                            error
                        }
                    })
                })
        },
        addBook: async (root, args, { currentUser }) => {
            if (!currentUser) {
                throw new GraphQLError('not authenticated', {
                    extensions: {
                        code: 'BAD_USER_INPUT'
                    }
                })
            }

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

            // create new book
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

            const resultBook = await Book.findOne({ title: args.title }).populate('author')

            //публикация уведомеления всем подписчикам
            pubsub.publish('BOOK_ADDED', { bookAdded: resultBook })

            return resultBook
        },
        editAuthor: async (root, args, { currentUser }) => {
            if (!currentUser) {
                throw new GraphQLError('not authenticated', {
                    extensions: {
                        code: 'BAD_USER_INPUT'
                    }
                })
            }
            return await Author.findOneAndUpdate({ name: args.name }, { born: args.setBornTo }, { new: true })
        }
    }
}

module.exports = resolvers