import { useEffect, useState } from 'react'
import './App.css'
import { Edition, EditionChooser, useEditions } from './Edition';


function App() {
  const editions = useEditions();
  const [edition, setEdition] = useState<Edition | null>(null);

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

  return (
    <>
      <div>
        <h1 style={{float: 'left'}}>Kuźniowa Liga Zadaniowa</h1>
        <div style={{float: 'right', margin: '12px'}}>{renderedEditions}</div>
      </div>
      <hr style={{clear: 'both'}}/>
      
    </>
  )
}

export default App
