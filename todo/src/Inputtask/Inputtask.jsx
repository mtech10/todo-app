import React, { useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import '../Inputtask/inputtask.css';

const Inputtask = ({ onAdd }) => {
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const handleSubmit = () => {
    if (newTitle.trim() === "") return;

    const newTodoItem = {
      title: newTitle,
      description: newDescription
    };

    onAdd(newTodoItem);

    setNewTitle("");
    setNewDescription("");
  };

  return (
    <div className='todo-input'>
      <div className='todo-input-item'>
        <input 
          type="text" 
          value={newTitle} 
          onChange={(e) => setNewTitle(e.target.value)} 
          placeholder='What would you like to do?'
        />
        <input 
          type="text" 
          value={newDescription} 
          onChange={(e) => setNewDescription(e.target.value)} 
          placeholder='Description'
        />
      </div>
      <div  className='todo-input-item'>
        <button className='send-icon' onClick={handleSubmit}><SendIcon/></button>
      </div>
    </div>
  );
};

export default Inputtask;