import { useEffect, useState } from 'react'
import './App.css'
import { Edition, EditionChooser, useEditions } from './Edition';
import { useTasks } from './Tasks';


function App() {
  const editions = useEditions();
  const [edition, setEdition] = useState<Edition | null>(null);
  const tasks = useTasks(edition?.url);

  useEffect(() => {
    if (editions.data === undefined) {
      return;
    }

    if (edition === null || editions.data.indexOf(edition) === -1) {
      setEdition(editions.data[0]);
    }
  }, [editions.data, edition, setEdition]);

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
    renderedTasks = <ul>
      {tasks.data.map(task => <li key={task.id}><a href={task.file.toString()}>{task.name}</a> ({task.end.toLocaleDateString('pl-PL')})</li>)}
    </ul>;
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
