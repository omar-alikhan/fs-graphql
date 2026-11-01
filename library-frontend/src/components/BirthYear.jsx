import { useState } from "react";
import { EDIT_AUTHOR } from "../queries";
import { useMutation } from "@apollo/client/react";

const BirthYear = () => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");
  const [editAuthor] = useMutation(EDIT_AUTHOR);

  const submit = async e => {
    e.preventDefault();
    editAuthor({ variables: { name, setBornTo: parseInt(born) } });
    setName("");
    setBorn("");
  };

  return (
    <form onSubmit={submit}>
      <label>
        name
        <input
          name="name"
          type="text"
          value={name}
          onChange={({ target }) => setName(target.value)}
        />
      </label>
      <br></br>
      <label>
        born
        <input
          name="born"
          type="text"
          value={born}
          onChange={({ target }) => setBorn(target.value)}
        />
      </label>
      <br></br>
      <button type="submit">update author</button>
    </form>
  );
};

export default BirthYear;
