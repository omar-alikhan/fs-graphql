const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user");
const jwt = require("jsonwebtoken");
const { GraphQLError } = require("graphql");
const { PubSub } = require("graphql-subscriptions");

const pubsub = new PubSub();

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (args.genre && args.author) {
        const author = await Author.findOne({ name: args.author });
        return Book.find({
          author: author._id,
          genres: { $all: [`${args.genre}`] },
        }).populate("author");
      }
      if (args.genre) {
        return Book.find({ genres: { $all: [`${args.genre}`] } }).populate(
          "author",
        );
      }
      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        return Book.find({ author: author._id }).populate("author");
      }
      return Book.find({}).populate("author");
    },
    allAuthors: async () => Author.find({}).populate("books"),
    me: (root, args, context) => {
      return context.currentUser;
    },
  },

  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }

      const { author, ...bookFields } = args;
      let existingAuthor = await Author.findOne({ name: author });
      if (!existingAuthor) {
        const newAuthor = new Author({ name: author });
        try {
          existingAuthor = await newAuthor.save();
        } catch (error) {
          throw new GraphQLError(`Saving Author failed: ${error.message}`, {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: author,
              error,
            },
          });
        }
      }
      const newBook = new Book({ ...bookFields, author: existingAuthor });

      try {
        await newBook.save();
      } catch (error) {
        throw new GraphQLError(`Saving Book failed: ${error.message}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: { ...bookFields },
          },
        });
      }

      pubsub.publish("BOOK_ADDED", { bookAdded: newBook });

      return newBook;
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }

      const existingAuthor = await Author.findOne({ name: args.name });
      if (!existingAuthor) return null;
      existingAuthor.born = Number(args.setBornTo);

      try {
        await existingAuthor.save();
      } catch (error) {
        throw new GraphQLError(`Saving Author failed: ${error.message}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
          },
        });
      }

      return existingAuthor;
    },
    createUser: async (root, { username, favoriteGenre }) => {
      const user = new User({ username, favoriteGenre });

      try {
        await user.save();
      } catch (error) {
        throw new GraphQLError(`Creating the user failed: ${error.message}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: error,
          },
        });
      }

      return user;
    },
    login: async (root, { username, password }) => {
      const user = await User.findOne({ username });

      if (!user || password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
    _resetDatabase: async () => {
      if (process.env.NODE_ENV !== "test") {
        throw new GraphQLError("_resetDatabase is only available in test mode");
      }

      await Author.deleteMany({});

      await Book.deleteMany({});

      await User.deleteMany({});
      return true;
    },
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator("BOOK_ADDED"),
    },
  },

  Author: {
    bookCount: async (root, args) => {
      return root.books.length;
    },
  },
};

module.exports = resolvers;
