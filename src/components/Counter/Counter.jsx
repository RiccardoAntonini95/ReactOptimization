import { useState, memo, useCallback, useMemo, useEffect } from 'react';

import IconButton from '../UI/IconButton.jsx';
import MinusIcon from '../UI/Icons/MinusIcon.jsx';
import PlusIcon from '../UI/Icons/PlusIcon.jsx';
import CounterOutput from './CounterOutput.jsx';
import CounterHistory from './CounterHistory.jsx'
import { log } from '../../log.js';

function isPrime(number) {
  log(
    'Calculating if is prime number',
    2,
    'other'
  );
  if (number <= 1) {
    return false;
  }

  const limit = Math.sqrt(number);

  for (let i = 2; i <= limit; i++) {
    if (number % i === 0) {
      return false;
    }
  }

  return true;
}

//memo come wrapper della funziona fa si che venga ri-eseguita solo se la prop che riceve cambia rispetto a prima
//ora che ho cambiato la struttura dei componenti e al cambio dello state non è più coinvolta App.jsx non servirebbe più ma la lascio qui per esercizio
const Counter =  memo (function Counter({ initialCount }) {
  log('<Counter /> rendered', 1);

  //useMemo a differenza di memo è per le funzioni normali, non per i component, fa si che questa funzione si esegua solo se cambia il valore di
  //ciò che sta nell'array di dependency, quindi a noi interessa quando cambia initialCount perchè solo allora cambiera il valore di ciò che torna la funzione
  //altrimenti si sarebbe rieseguita ad ogni re-render di questo component
  const initialCountIsPrime = useMemo(() => isPrime(initialCount), [initialCount]);

  //const [counter, setCounter] = useState(initialCount);
  const [counterChanges, setCounterChanges] = useState([{value : initialCount, id: Math.random() * 1000}]);

  const currentCounter = counterChanges.reduce(
    (prevCounter, counterChange) => prevCounter + counterChange.value,
    0
  );

  //grazie a useCallback prevengo che questa funzione venga ricreata ad ogni esecuzione di questo component, così memo su IconButton funzionerà visto che le prop non cambieranno
  const handleDecrement = useCallback(function handleDecrement() {
    //setCounter((prevCounter) => prevCounter - 1);
    setCounterChanges((prevCounterChanges) => [{value: -1, id: Math.random() * 1000}, ...prevCounterChanges]);
  }, [])

   const handleIncrement = useCallback (function handleIncrement() {
    //setCounter((prevCounter) => prevCounter + 1);
    setCounterChanges((prevCounterChanges) => [{value: 1, id: Math.random() * 1000}, ...prevCounterChanges]);
  }, [])

 
/* Non necessario, risolto con key su app.jsx

  useEffect(() => {
    setCounterChanges([{value: initialCount, id: Math.random() * 1000}]);
  }, [initialCount]) */

  return (
    <section className="counter">
      <p className="counter-info">
        The initial counter value was <strong>{initialCount}</strong>. It{' '}
        <strong>is {initialCountIsPrime ? 'a' : 'not a'}</strong> prime number.
      </p>
      <p>
        <IconButton icon={MinusIcon} onClick={handleDecrement}>
          Decrement
        </IconButton>
        <CounterOutput value={currentCounter} />
        <IconButton icon={PlusIcon} onClick={handleIncrement}>
          Increment
        </IconButton>
      </p>
      <CounterHistory history={counterChanges} />
    </section>
  );
})

export default Counter