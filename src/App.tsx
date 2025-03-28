import { useEffect, useState } from 'react'
import './App.css'
import { Edition, EditionChooser, useEditions } from './Edition';
import { useTasks } from './Tasks';


function App() {
  const editions = useEditions();
  const [edition, setEdition] = useState<Edition | null>(null);
  const tasks = useTasks(edition?.url);
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    if (editions.data === undefined) {
      return;
    }

    if (edition === null || editions.data.indexOf(edition) === -1) {
      setEdition(editions.data[0]);
    }
  }, [editions.data, edition, setEdition]);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 60*1000);
    return () => clearInterval(interval);
  }, []);

  let renderedEditions = <p>Hmmm...</p>;
  if (editions.isLoading) {
    renderedEditions = <p>Loading...</p>;
  }
  if (editions.error) {
    console.error(editions.error);
    renderedEditions = <p>Error</p>;
  }
  if (editions.data !== undefined) {
    renderedEditions = <EditionChooser editions={editions.data} edition={edition} setEdition={setEdition} />;
  }

  let renderedTasks = <p>Hmmm...</p>;
  if (tasks.isLoading) {
    renderedTasks = <p>Loading...</p>;
  }
  if (tasks.error) {
    console.error(tasks.error);
    renderedTasks = <p>Error</p>;
  }
  if (tasks.data !== undefined) {
    const taskList = [...tasks.data].sort((a, b) => b.id - a.id).sort((a, b) => b.end.getTime() - a.end.getTime());
    const activeTasks = <ol>
      {taskList.filter(task => task.start <= time && time <= task.end).map(task => <li key={task.id} value={task.id}><a href={task.file.toString()}>{task.name}</a> ({task.end.toLocaleDateString('pl-PL')})</li>)}
    </ol>;
    const oldTasks = <ol>
      {taskList.filter(task => task.end <= time).map(task => <li key={task.id} value={task.id}><a href={task.file.toString()}>{task.name}</a> ({task.end.toLocaleDateString('pl-PL')})</li>)}
    </ol>;
    renderedTasks = <>
      <h1>Aktywne zadania</h1>
      {activeTasks}
      <h1>Zadania po terminie</h1>
      {oldTasks}
    </>;
  }

  return (
    <>
      <div>
        <h1 style={{float: 'left'}}>Kuźniowa Liga Zadaniowa</h1>
        <div style={{float: 'right', margin: '12px'}}>{renderedEditions}</div>
      </div>
      <hr style={{clear: 'both'}}/>
      {renderedTasks}
    </>
  )
}

export default App;
