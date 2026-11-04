import { useState } from "react";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";
import { useMutation, useQuery } from "@apollo/client/react";

const BirthYear = () => {
  const [selectedName, setSelectedName] = useState("");
  const [born, setBorn] = useState("");
  const result = useQuery(ALL_AUTHORS);
  const [editAuthor] = useMutation(EDIT_AUTHOR);

  if (result.loading) {
    return <div>loading...</div>;
  }

  const authors = result.data.allAuthors;

  const submit = async e => {
    e.preventDefault();
    console.log(selectedName);
    await editAuthor({
      variables: { name: selectedName, setBornTo: parseInt(born) },
    });
    setSelectedName("");
    setBorn("");
  };

  return (
    <form onSubmit={submit}>
      <label>
        name
        <select
          name="name"
          value={selectedName}
          onChange={e => setSelectedName(e.target.value)}
        >
          <option value="" disabled>
            Select an author
          </option>
          {authors.map(a => (
            <option key={a.id} value={a.name}>
              {a.name}
            </option>
          ))}
        </select>
      </label>
      <br></br>
      <label>
        born
        <input
          name="born"
          type="number"
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
