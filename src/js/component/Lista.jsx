import React, { useState, useEffect } from 'react';
import Item from './Item';
import '../../styles/index.css';

function Lista() {
  // Estado para almacenar la lista de tareas y verificar si la lista ya ecxiste previamente
  const [taskList, setTaskList] = useState([]);
  const [todoListExists, setTodoListState] = useState(false);

  // UseEfect para cargar la lista de tareas al inicio
  useEffect(() => {
    fetch('https://playground.4geeks.com/apis/fake/todos/user/alegonfern', {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(resp => {
      if (resp.status !== 200) {
        createNewTodoList();
      }
      return resp.json();
    })
    .then(data => {
      if (data.length && data[0]?.label !== "example task") {
        setTaskList(data);
        setTodoListState(true);
      }
    })
    .catch(error => {
      console.log(error);
    });
  }, []);

  // Función para crear una nueva lista de tareas en la API
  const createNewTodoList = () => {
    setTodoListState(true);
    fetch('https://playground.4geeks.com/apis/fake/todos/user/alegonfern', {
      method: "POST",
      body: JSON.stringify([]),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(resp => {
      return resp.json();
    })
    .then(() => {
      setTaskList([]);
    })
    .catch(error => {
      console.log(error);
    });
  }

  // Función para agregar una tarea 
  const addTask = async (e) => {
    e.preventDefault();
    const newTask = document.getElementById("newTask").value;
    const temp = [...taskList, newTask];
    document.getElementById("taskForm").reset();

    if (!todoListExists) {
      await createNewTodoList();
    }

    await syncTasksToAPI(temp);
  }

  // Función para eliminar una tarea
  const deleteTask = async (index) => {
    const temp = [...taskList];
    temp.splice(index, 1);

    if (temp.length) {
      await syncTasksToAPI(temp);
    } else {
      await deleteTodoList();
    }
  }

  // Función para eliminar toda la lista asociada a el usuaro de la API 
  const deleteTodoList = async () => {
    try {
      setTodoListState(false);
      const response = await fetch('https://playground.4geeks.com/apis/fake/todos/user/alegonfern', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (response.ok) {
        setTaskList([]);
      } else {
        console.error('Error borrando Lista');
      }
    } catch (error) {
      console.error('Error borrando Lista:', error);
    }
  }

  // Función para sincronizar las tareas con la API
  const syncTasksToAPI = async (updatedTasks) => {
    try {
      const response = await fetch('https://playground.4geeks.com/apis/fake/todos/user/alegonfern', {
        method: 'PUT',
        body: JSON.stringify(updatedTasks),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error('Error sincronizando con API');
      } else {
        setTaskList(updatedTasks);
      }
    } catch (error) {
      console.error('Error al sincronizar Tareas con API:', error);
    }
  };

  return (
    <div className="Lista">
      <h1>TODOLIST API</h1> 
      <form id="taskForm" onSubmit={addTask}>
        <input
          type="text"
          placeholder="Agregar tarea..."
          id="newTask"
        />
        <button type="submit">Agregar</button>
      </form>
      <ul className="task-list">
        {taskList.length === 0 ? (
          <li>No hay tareas, añadir tareas</li>
        ) : (
          taskList.map((task, index) => (
            <Item
              key={index}
              task={task}
              onDelete={() => deleteTask(index)}
            />
          ))
        )}
      </ul>
      <button className="clear-button" onClick={deleteTodoList}>
        Limpiar todas las tareas
      </button>
    </div>
  );
}

export default Lista;