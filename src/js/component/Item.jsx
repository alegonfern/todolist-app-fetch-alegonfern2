import React from 'react';
import '../../styles/index.css';

function Item({ task, onDelete }) {
  return (
    <li className="Item">
      {task}
      <span className="delete-icon" onClick={onDelete}>
        x
      </span>
    </li>
  );
}

export default Item;
