import { useState } from 'react';
import './App.css';

interface Group {
  name: string
  id: number
}

function App () {
  const groups = useState<Group[]>([{ name: 'a', id: 1 }, { name: 'b', id: 2 }])[0];
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  return (
    <>
      <h1 id='main-title'>DivSum Expense Splitter</h1>
      <div id="content">
        <div id="groups" className="content-elem">
          {groups.map(group => {
            return (
              <a onClick={() => selectedGroup !== group ? setSelectedGroup(group) : setSelectedGroup(null)} className='group-elem' key={group.id}>{group.name}</a>
            );
          })
          }
        </div>
        <div id="expenses" className="content-elem">
          {selectedGroup?.name ?? 'No group selected'}
        </div>
      </div>
    </>
  );
}

export default App;
