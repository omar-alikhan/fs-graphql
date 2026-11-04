import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS } from "../queries";
import { useState } from "react";

const Books = props => {
  const [genreFilter, setGenreFilter] = useState(null);
  const result = useQuery(ALL_BOOKS, {
    skip: !props.show,
  });

  if (!props.show) {
    return null;
  }

  if (result.loading) {
    return <div>loading....</div>;
  }

  const books = result.data.allBooks;
  const allGenres = books.flatMap(book => book.genres);
  const uniqueGenres = [...new Set(allGenres)].sort();

  const activeStyle = {
    outline: "3px solid lightblue",
  };

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
          {books
            .filter(a => (genreFilter ? a.genres.includes(genreFilter) : true))
            .map(a => (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
        </tbody>
      </table>
      {uniqueGenres.map(genre => (
        <button
          key={genre}
          style={genreFilter === genre ? activeStyle : undefined}
          onClick={e =>
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
