const Book = require("./models/books");
const Author = require("./models/author");

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (_, args) => {
      let filteredBooks = books;
      if (args.author)
        filteredBooks = filteredBooks.filter(b => b.author === args.author);
      if (args.genre)
        filteredBooks = filteredBooks.filter(b =>
          b.genres.includes(args.genre),
        );
      return filteredBooks;
    },
    allAuthors: async () => Author.find({}),
  },

  Mutation: {
    addBook: async (_, args) => {
      const { author, ...bookFields } = args;
      let existingAuthor = await Author.findOne({ name: author });
      if (!existingAuthor) {
        const newAuthor = new Author({ name: author });
        existingAuthor = await newAuthor.save();
      }
      const newBook = new Book({ ...bookFields, author: existingAuthor });
      return newBook.save();
    },
    editAuthor: async (_, args) => {
      const existingAuthor = await Author.findOne({ name: args.name });
      if (!existingAuthor) return null;
      existingAuthor.born = Number(args.setBornTo);
      return existingAuthor.save();
    },
  },
};

module.exports = resolvers;
