import React, { useState, useEffect, useRef } from "react";
import CheckBoxOutlineBlankOutlinedIcon from "@mui/icons-material/CheckBoxOutlineBlankOutlined";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AddIcon from "@mui/icons-material/Add";
import DateDisplay from "../DateDisplay";
import Inputtask from "../Inputtask/Inputtask";
// import Calendar from "../Calendar/Cal";
import axios from "axios";
import "../Home/home.css";
import { useAuth } from "../AuthContext";

const Home = () => {
  const { user, logout } = useAuth();
  const [allTodos, setAllTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    if (!user) {
      return;
    }
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`https://todo-app-backend-jnox.onrender.com/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allFetchedTasks = response.data;

        const activeTasks = allFetchedTasks.filter(
          (task) => task.is_complete === false
        );
        const completedTasks = allFetchedTasks.filter(
          (task) => task.is_complete === true
        );
        setAllTodos(activeTasks);
        setCompletedTodos(completedTasks);
      } catch (error) {
        console.error(error.response?.data || error.message);
      }
    };
    fetchTasks();
  }, [user]);

  const handleAddTodo = (newTodoItem) => {
    const token = localStorage.getItem("token");
    axios
      .post(
        "https://todo-app-backend-jnox.onrender.com/new-task",
        {
          title: newTodoItem.title,
          description: newTodoItem.description,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        setAllTodos([response.data, ...allTodos]);
        setIsInputVisible(false);
      })
      .catch((error) => {
        console.error(error.response?.data || error.message);
        alert("Failed to add task.");
      });
  };

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
  };

  const handleSaveEdit = (taskId, isCompletedList) => {
    const token = localStorage.getItem("token");

    axios.patch(`https://todo-app-backend-jnox.onrender.com/edit-task/${taskId}`, 
      { title: editTitle, description: editDescription },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then((response) => {
      const updatedTask = response.data;
      if (isCompletedList) {
        setCompletedTodos(completedTodos.map(t => t.id === taskId ? updatedTask : t));
      } else {
        setAllTodos(allTodos.map(t => t.id === taskId ? updatedTask : t));
      }

      setEditingTaskId(null); 
    })
    .catch((error) => {
      console.error(error.response?.data || error.message);
      alert("Failed to save edits.");
    });
  };

  const handleDeleteTodo = (index, isCompletedList) => {
    const token = localStorage.getItem("token");
    const taskToDelete = isCompletedList
      ? completedTodos[index]
      : allTodos[index];

    axios
      .delete(`https://todo-app-backend-jnox.onrender.com/delete-task/${taskToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        if (isCompletedList) {
          let reducedTodo = [...completedTodos];
          reducedTodo.splice(index, 1);
          setCompletedTodos(reducedTodo);
        } else {
          let reducedTodo = [...allTodos];
          reducedTodo.splice(index, 1);
          setAllTodos(reducedTodo);
        }
      })
      .catch((error) => {
        console.error(error.response?.data || error.message);
        alert("Failed to delete task from server");
      });
  };

  const handleComplete = (index) => {
    const token = localStorage.getItem("token");
    const taskToComplete = allTodos[index];

    axios
      .patch(
        `https://todo-app-backend-jnox.onrender.com/complete-task/${taskToComplete.id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        setCompletedTodos([...completedTodos, response.data]);
        let reducedTodo = [...allTodos];
        reducedTodo.splice(index, 1);
        setAllTodos(reducedTodo);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to mark task as complete. Please try again.");
      });
  };

  const handleUncomplete = (index) => {
    const token = localStorage.getItem("token");
    const taskToUncomplete = completedTodos[index];

    axios
      .patch(
        `https://todo-app-backend-jnox.onrender.com/uncomplete-task/${taskToUncomplete.id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        setAllTodos([...allTodos, response.data]);
        let reducedCompleted = [...completedTodos];
        reducedCompleted.splice(index, 1);
        setCompletedTodos(reducedCompleted);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to mark task as uncomplete. Please try again.");
      });
  };

  
  const invisibleInputStyle = {
    border: "none",
    background: "transparent",
    outline: "none",
    width: "100%",
    fontFamily: "inherit",
    color: "inherit",
    padding: 0,
    margin: 0
  };

  return (
    <div className="home-wrapper">
      {/* <div className="calendar-section">
        <Calendar />
      </div> */}
      <div className="todo-container">
        <div className="taskAdded">
          <button className="logout-btn" onClick={logout}>Logout</button>
          <h3 className="todo-header">TO DO LIST APP</h3>
          
          <img src="purple-calendar.png" alt="Calendar picture" className="todo-header-img" />
        
          {allTodos.length === 0 && completedTodos.length === 0 ? (
            <div className="noTask">
              <p className="noTask1">You have a free day</p>
              <p className="noTask2">Take it easy</p>
            </div>
          ) : (
            allTodos.map((item, index) => (
              <div className="todo-list-item" key={item.id || index}>
                <div className="todo-left-section">
                  <div className="todo-date">
                    <DateDisplay date={new Date()} />
                  </div>

                  <div className="tasks-details" style={{ width: '100%' }}>
                    {editingTaskId === item.id ? (
                      <div className="edit-mode-container" style={{display: 'flex', flexDirection: 'column', gap: '2px', width: '100%' }}>
                        <input 
                          type="text"
                          autoFocus
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit(item.id, false);
                            if (e.key === 'Escape') setEditingTaskId(null);
                          }}
                          style={{ ...invisibleInputStyle, fontSize: '1.17em', fontWeight: 'bold' }} 
                        />
                        <input 
                          type="text" 
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit(item.id, false);
                            if (e.key === 'Escape') setEditingTaskId(null);
                          }}
                          style={{ ...invisibleInputStyle, fontSize: '14px', color: '#666' }} 
                          placeholder="Add description..."
                        />
                      </div>
                    ) : (
                      <div onClick={() => startEditing(item)} style={{ cursor: 'text', width: '100%' }}>
                        <h3 className="main-text" style={{ margin: 0 }}>{item.title}</h3>
                        <p className="small-text" style={{ margin: 0 }}>{item.description}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="todo-right-section">
                  <div
                    className="check-icon"
                    onClick={() => handleComplete(index)}
                  >
                    <CheckBoxOutlineBlankOutlinedIcon />
                  </div>
                  <div
                    className="delete-icon"
                    onClick={() => handleDeleteTodo(index, false)}
                  >
                    <DeleteOutlinedIcon />
                  </div>
                </div>
              </div>
            ))
          )}

          {completedTodos.length > 0 && (
            <div className="completed-area">
              <h3 className="completed-header">
                COMPLETED ({completedTodos.length})
              </h3>
              {completedTodos.map((item, index) => (
                <div className="todo-list-item completed-item" key={item.id || index}>
                  <div className="todo-left-section">
                    <div className="tasks-details" style={{ width: '100%' }}>
                      {editingTaskId === item.id ? (
                        <div className="edit-mode-container" style={{display: 'flex', flexDirection: 'column', gap: '2px', width: '100%' }}>
                          <input 
                            type="text"
                            autoFocus
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEdit(item.id, true);
                              if (e.key === 'Escape') setEditingTaskId(null);
                            }}
                            style={{ ...invisibleInputStyle, fontSize: '1.17em', fontWeight: 'bold', textDecoration: 'line-through' }} 
                          />
                          <input 
                            type="text" 
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEdit(item.id, true);
                              if (e.key === 'Escape') setEditingTaskId(null);
                            }}
                            style={{ ...invisibleInputStyle, fontSize: '14px', color: '#666', textDecoration: 'line-through' }} 
                          />
                        </div>
                      ) : (
                        <div onClick={() => startEditing(item)} style={{ cursor: 'text', width: '100%' }}>
                          <h3 className="main-text" style={{ margin: 0 }}>{item.title}</h3>
                          <p className="small-text" style={{ margin: 0 }}>{item.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="todo-right-section">
                    <div
                      className="delete-icon"
                      onClick={() => handleDeleteTodo(index, true)}
                    >
                      <DeleteOutlinedIcon />
                    </div>
                    <div
                      className="check-icon"
                      onClick={() => handleUncomplete(index)}
                    >
                      <CheckBoxIcon />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!isInputVisible && (
          <button
            className="add-task-btn"
            onClick={() => setIsInputVisible(true)}
          >
            <AddIcon />
          </button>
        )}

        {isInputVisible && (
          <div className="input-overlay">
            <Inputtask onAdd={handleAddTodo} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;