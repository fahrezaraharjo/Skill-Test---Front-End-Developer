import React, { useState, useEffect } from "react";
import axios from "axios";
import { Todo } from "../../types";
const Home = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [todosPerPage, setTodosPerPage] = useState(10);
  const [newTodo, setNewTodo] = useState("");
  const limit = 10;

//-----------------------------POST---------------------------------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await axios.post(`https://jsonplaceholder.typicode.com/todos`, {
      title: newTodo,
      completed: false,
    });

    setTodos([...todos, res.data]);
    setNewTodo("");
  };
//-----------------------------Delete---------------------------------

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error(error);
    }
  };
//-----------------------------GET---------------------------------

useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get("https://jsonplaceholder.typicode.com/todos");
      setTodos(result.data);
    };

    fetchData();
  }, []);
//-----------------------------Pagination---------------------------------

  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);


  return (
    <>
      <div className="backgroundimg"></div>
      <div className="inner-container">
        <h1>Todo List</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button type="submit" className="btn">ADD TODO</button>
        </form>
        <ul>
          {currentTodos.map((todo) => (
            <li key={todo.id}>{todo.title}
              <button className="btn-delete" onClick={() => handleDelete(todo.id)}>Delete</button>
            </li>

          ))}
        </ul>
        <div className="pagination">
          {Array.from({ length: Math.ceil(todos.length / todosPerPage) }, (_, i) => (
            <button key={i + 1} onClick={() => paginate(i + 1)} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
              {i + 1}
            </button>
          ))}
        </div>
        <style jsx>
          {`
          .pagination {
            display: flex;
            justify-content: center;
            padding: 1rem;
          }
          
          .page-item {
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 0.5rem;
            margin: 0 0.5rem;
            cursor: pointer;
          }

          .page-item.active {
            background-color: #ccc;
          }
        `}
        </style>
      </div>
    </>
  );
};

export const getStaticProps = async () => {
  const res = await axios.get(`https://jsonplaceholder.typicode.com/todos`);
  return {
    props: {
      todos: res.data.slice(0, 10),
    },
  };
};

export default Home;