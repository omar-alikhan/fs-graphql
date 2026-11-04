import { useState } from "react";
import { LOGIN } from "../queries";
import { useMutation } from "@apollo/client/react";

const LoginForm = ({ show, setError, setToken, setPage }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login] = useMutation(LOGIN, {
    onCompleted: data => {
      const token = data.login.value;
      setToken(token);
      localStorage.setItem("library-user-token", token);
    },
    onError: error => {
      setError("login failed");
      // setTimeout(() => {
      //   setError("");
      // }, 5000);
    },
  });

  if (!show) {
    return null;
  }

  const handleSubmit = async e => {
    e.preventDefault();
    await login({
      variables: {
        username,
        password,
      },
    });
    setPage("authors");
  };

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
        <br></br>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
        <button type="submit">login</button>
      </form>
    </>
  );
};

export default LoginForm;
