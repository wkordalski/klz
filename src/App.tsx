import { useEffect, useState } from 'react'
import './App.css'
import { EditionChooser } from './EditionChooser';
import { Edition, useEditions } from './edition';
import { useTasks, Task } from './Tasks';

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
    const taskList = [...tasks.data].reverse().map(task => <TaskDetails key={task.id} task={task} time={time} />);
    renderedTasks = <table style={{width: '100%'}}><tbody>{taskList}</tbody></table>;
  }

  return (
    <>
      <div className="page">
        <div>
          <h1 style={{float: 'left'}}>Kuźniowa Liga Zadaniowa</h1>
          <div style={{float: 'right', margin: '12px'}}>{renderedEditions}</div>
        </div>
        <hr style={{clear: 'both'}}/>
        {renderedTasks}
        <hr />
        <div className="copyright">Copyright © 2025 Wojciech Kordalski</div>
      </div>
    </>
  )
}


function TaskDetails({task, time}: {task: Task, time: Date}) {
  const isActive = time <= task.end;
  return <tr className={`task-details ${isActive ? 'active' : 'inactive'}`}>
    <td className="task-details-id">{task.id}.</td>
    <td className="task-details-name"><a href={task.file.toString()}>{task.name}</a></td>
    <td className="task-details-date">{task.end.toLocaleDateString('pl-PL')}</td>
    <td className="task-details-points"></td>
  </tr>;
}

export default App;
