import React, { useState } from 'react';

const Calculator = () => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [result, setResult] = useState(0);

  const handleCalculation = (operation) => {
    let res;
    switch (operation) {
      case 'add':
        res = num1 + num2;
        break;
      case 'subtract':
        res = num1 - num2;
        break;
      case 'multiply':
        res = num1 * num2;
        break;
      case 'divide':
        res = num2 !== 0 ? num1 / num2 : 'Error';
        break;
      default:
        res = 0;
    }
    setResult(res);
  };

  return (
    <div>
      <h1>Calculator</h1>
      <input type='number' value={num1} onChange={(e) => setNum1(Number(e.target.value))} />
      <input type='number' value={num2} onChange={(e) => setNum2(Number(e.target.value))} />
      <div>
        <button onClick={() => handleCalculation('add')}>Add</button>
        <button onClick={() => handleCalculation('subtract')}>Subtract</button>
        <button onClick={() => handleCalculation('multiply')}>Multiply</button>
        <button onClick={() => handleCalculation('divide')}>Divide</button>
      </div>
      <h2>Result: {result}</h2>
    </div>
  );
};

export default Calculator;