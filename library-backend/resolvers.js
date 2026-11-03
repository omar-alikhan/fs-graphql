const Book = require("./models/books");
const Author = require("./models/author");
const { GraphQLError } = require("graphql");

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (_, args) => {
      if (args.genre && args.author) {
        const author = await Author.findOne({ name: args.author });
        return Book.find({
          author: author._id,
          genres: { $all: [`${args.genre}`] },
        });
      }
      if (args.genre) {
        return Book.find({ genres: { $all: [`${args.genre}`] } });
      }
      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        return Book.find({ author: author._id });
      }
      return Book.find({});
    },
    allAuthors: async () => Author.find({}),
  },

  Mutation: {
    addBook: async (_, args) => {
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

      return newBook;
    },
    editAuthor: async (_, args) => {
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
  },
};

module.exports = resolvers;
