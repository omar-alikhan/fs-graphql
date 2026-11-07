import { useState } from "react";
import { useApolloClient, useSubscription } from "@apollo/client/react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/LoginForm";
import Recommend from "./components/Recommend";
import Notification from "./components/Notification";
import { ALL_BOOKS, BOOK_ADDED } from "./queries";
import { addBookToCache } from "./utils/apolloCache";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(
    localStorage.getItem("library-user-token"),
  );
  const [error, setError] = useState("");
  const client = useApolloClient();

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const bookAdded = data.data.bookAdded;
      window.alert(`A new book "${bookAdded.title}" has been added.`);
      addBookToCache(client.cache, bookAdded);
    },
    onError: error => console.log(error),
  });

  const handleLogout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  return (
    <div>
      <Notification error={error} setError={setError}></Notification>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token && (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommend")}>recommend</button>
            <button onClick={handleLogout}>logout</button>
          </>
        )}
        {!token && <button onClick={() => setPage("login")}>login</button>}
      </div>

      <Authors show={page === "authors"} isUserLoggedIn={!!token} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} />

      <Recommend show={page === "recommend"} />

      <Login
        show={page === "login"}
        setError={setError}
        setToken={setToken}
        setPage={setPage}
      />
    </div>
  );
};

export default App;
