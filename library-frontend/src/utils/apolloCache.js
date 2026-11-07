import { ALL_BOOKS } from "../queries";

export const addBookToCache = (cache, bookToAdd) => {
  cache.updateQuery({ query: ALL_BOOKS, variables: { genre: null } }, data => {
    if (!data) return data;
    const bookExists = data.allBooks.some(book => book.id === bookToAdd.id);

    if (bookExists) {
      return { allBooks };
    }

    return {
      allBooks: data.allBooks.concat(bookToAdd),
    };
  });
};
