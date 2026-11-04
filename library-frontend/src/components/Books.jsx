import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS } from "../queries";
import { useState } from "react";

const Books = props => {
  const [genreFilter, setGenreFilter] = useState(null);
  const [uniqueGenres, setUniqueGenres] = useState(null);
  const { data: booksData, loading: booksLoading } = useQuery(ALL_BOOKS, {
    skip: !props.show,
    variables: { genre: genreFilter },
  });

  if (!props.show) {
    return null;
  }

  if (booksLoading) {
    return <div>loading....</div>;
  }

  if (!uniqueGenres) {
    const allGenres = booksData.allBooks.flatMap(book => book.genres);
    setUniqueGenres([...new Set(allGenres)].sort());
  }

  return (
    <div>
      <h2>books</h2>
      {genreFilter ? (
        <p>
          in genre <b>{genreFilter}</b>
        </p>
      ) : null}
      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksData.allBooks.map(a => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {uniqueGenres?.map(genre => (
        <button
          key={genre}
          style={
            genreFilter === genre
              ? { outline: "3px solid lightblue" }
              : undefined
          }
          onClick={() =>
            genreFilter === genre ? setGenreFilter(null) : setGenreFilter(genre)
          }
        >
          {genre}
        </button>
      ))}
    </div>
  );
};

export default Books;
