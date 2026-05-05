import React from 'react';
import './styles.css';

const NewPage = () => {
  return (
    <div className="new-page">
      <h1>Enter Your Name</h1>
      <input type="text" placeholder="Name" className="name-input" />
    </div>
  );
};

export default NewPage;
