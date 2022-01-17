import React, { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import Todo from './Todo';
import { TiArrowMaximiseOutline } from 'react-icons/ti';
import axios from 'axios'

function TodoList() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
	  const getTodos = async () => {
		  const todosFromServer = await fecthTodos();
		  setTodos(todosFromServer);
	  }

	  getTodos();
  }, []);

  const fecthTodos = async () => {
    const res = await fetch('http://localhost:8080/get')
    const data = await res.json();
    
    return data.todos;
  }

  const fetchTodo = async (id) => {
    const res = await fetch(`http://localhost:8080/get/${id}`)
    const data = await res.json();
    return data.todo
  }

  const addTodo = async (todo_temp) => {
    let todo = {...todo_temp}
    todo['status'] = false
    todo['name'] = todo.text
    delete todo['id']

    if (!todo.text || /^\s*$/.test(todo.text)) {
      return;
    }

    const res = await fetch('http://localhost:8080/post', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },  
      body: JSON.stringify(todo),
    })

    const data = await res.json();
    let todosFromServer = await fecthTodos();
    setTodos(todosFromServer);
    // let temp = data.todo
    // temp['isComplete'] = false
    // setTodos([...todos, data.todo])
    // useEffect(() => {
      //API
      // axios.get('localhost:3000/get').
    // }, [])
    // const newTodos = [todo, ...todos];

    // setTodos(newTodos);
    // console.log(...todos);
  };

  const updateTodo = (todoId, newValue) => {
    // if (!newValue.text || /^\s*$/.test(newValue.text)) {
    //   return;
    // }

    // setTodos(prev => prev.map(item => (item.id === todoId ? newValue : item)));
    
    
  
  };

  const removeTodo =async (id) => {
    // const removedArr = [...todos].filter(todo => todo.id !== id);

    // setTodos(removedArr);
    const res = await fetch(`http://localhost:8080/delete/${id}`, {
      method: 'DELETE',
    });

    res.status === 200
      ? setTodos(todos.filter((todo) => todo.id !== id))
      : alert('There was an error while deleting');
  };

  const completeTodo = async (id) => {
    // let updatedTodos = todos.map(todo => {
    //   if (todo.id === id) {
    //     todo.isComplete = !todo.isComplete;
    //   }
    //   return todo;
    // });
    // setTodos(updatedTodos);

    const todoToToggle = await fetchTodo(id);
    const updatedTodo = { status: !todoToToggle.status }
    console.log(">> id", id);
    const res = await fetch(`http://localhost:8080/put/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(updatedTodo),
    });

	if(res.status === 200) {

		const data = await res.json();
    let todosFromServer = await fecthTodos();
    setTodos(todosFromServer);
		// setTodos(
		//   todos.map((todo) =>
		// 	todo.id === id ? { ...todo, status: data.todo.status } : todo
		//   )
		// )

	}
  };

  return (
    <>
      <h1>What's the Plan for Today?</h1>
      <TodoForm onSubmit={addTodo} />
      <Todo
        todos={todos}
        completeTodo={completeTodo}
        removeTodo={removeTodo}
        updateTodo={updateTodo}
      />
    </>
  );
}

export default TodoList;