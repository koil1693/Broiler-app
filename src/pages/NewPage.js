import React, { useState } from 'react';
import './styles.css';

const NewPage = () => {
  const [name, setName] = useState('');

  const handleButtonClick = () => {
    alert(name);
  };

  return (
    <div className="new-page">
      <h1>Enter Your Name</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <button onClick={handleButtonClick}>Submit</button>
    </div>
  );
};

export default NewPage;