'use client';

import { useState } from 'react';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  return (
    <div className="max-w-xs mx-auto mt-10 bg-gray-800 rounded-lg shadow-2xl p-6">
      <div className="bg-black rounded-lg p-4 mb-4">
        <div className="text-white text-right text-3xl font-mono overflow-hidden">
          {display}
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {/* Clear button */}
        <button
          onClick={clear}
          className="col-span-2 bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-4 rounded-lg text-xl transition-colors"
        >
          Clear
        </button>
        
        {/* Division */}
        <button
          onClick={() => inputOperation('÷')}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-4 rounded-lg text-xl transition-colors"
        >
          ÷
        </button>
        
        {/* Multiplication */}
        <button
          onClick={() => inputOperation('×')}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-4 rounded-lg text-xl transition-colors"
        >
          ×
        </button>

        {/* Number 7 */}
        <button
          onClick={() => inputNumber('7')}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-4 rounded-lg text-xl transition-colors"
        >
          7
        </button>
        
        {/* Number 8 */}
        <button
          onClick={() => inputNumber('8')}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-4 rounded-lg text-xl transition-colors"
        >
          8
        </button>
        
        {/* Number 9 */}
        <button
          onClick={() => inputNumber('9')}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-4 rounded-lg text-xl transition-colors"
        >
          9
        </button>
        
        {/* Subtraction */}
        <button
          onClick={() => inputOperation('-')}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-4 rounded-lg text-xl transition-colors"
        >
          -
        </button>

        {/* Number 4 */}
        <button
          onClick={() => inputNumber('4')}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-4 rounded-lg text-xl transition-colors"
        >
          4
        </button>
        
        {/* Number 5 */}
        <button
          onClick={() => inputNumber('5')}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-4 rounded-lg text-xl transition-colors"
        >
          5
        </button>
        
        {/* Number 6 */}
        <button
          onClick={() => inputNumber('6')}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-4 rounded-lg text-xl transition-colors"
        >
          6
        </button>
        
        {/* Addition */}
        <button
          onClick={() => inputOperation('+')}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-4 rounded-lg text-xl transition-colors"
        >
          +
        </button>

        {/* Number 1 */}
        <button
          onClick={() => inputNumber('1')}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-4 rounded-lg text-xl transition-colors"
        >
          1
        </button>
        
        {/* Number 2 */}
        <button
          onClick={() => inputNumber('2')}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-4 rounded-lg text-xl transition-colors"
        >
          2
        </button>
        
        {/* Number 3 */}
        <button
          onClick={() => inputNumber('3')}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-4 rounded-lg text-xl transition-colors"
        >
          3
        </button>
        
        {/* Equals */}
        <button
          onClick={performCalculation}
          className="row-span-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-4 rounded-lg text-xl transition-colors"
        >
          =
        </button>

        {/* Number 0 */}
        <button
          onClick={() => inputNumber('0')}
          className="col-span-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-4 rounded-lg text-xl transition-colors"
        >
          0
        </button>
        
        {/* Decimal point */}
        <button
          onClick={() => inputNumber('.')}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-4 rounded-lg text-xl transition-colors"
        >
          .
        </button>
      </div>
    </div>
  );
}
