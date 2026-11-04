import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS, MY_FAVORITE_GENRE } from "../queries";

const Recommend = props => {
  const { data: booksData, loading: booksLoading } = useQuery(ALL_BOOKS, {
    skip: !props.show,
  });
  const { data: favoriteGenreData, loading: favoriteGenreLoading } = useQuery(
    MY_FAVORITE_GENRE,
    {
      skip: !props.show,
    },
  );

  if (!props.show) {
    return null;
  }

  if (booksLoading || favoriteGenreLoading) {
    return <div>loading....</div>;
  }

  const books = booksData.allBooks;
  const favoriteGenre = favoriteGenreData.me.favoriteGenre;

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre <b>{favoriteGenre}</b>
      </p>
      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books
            .filter(a => a.genres.includes(favoriteGenre))
            .map(a => (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommend;
