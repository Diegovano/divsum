import { FormEvent, useEffect, useState } from 'react';
import './App.css';

interface Group {
  name: string
  id: number
}

const groupsAPIEndpoint = new URL('http://localhost:3000/groups');
const newGroupAPIEndpoint = new URL('http://localhost:3000/newGroup');
// const peopleAPIEndpoint = new URL('http://localhost:3000/people');

function App () {
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupUpdate, toggleGroupUpdate] = useState<number>(0);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // const name = event.target.name.value;

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get('name') as string;

    // POST request to the backend
    fetch(newGroupAPIEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    }).then(() => {
      toggleGroupUpdate(count => count + 1);
      form.reset();
    });
  };

  useEffect(() => {
    fetch(groupsAPIEndpoint).then(res => {
      res.json().then((json: string[]) => {
        const groups = json.map((groupName, index) => ({ name: groupName, id: index }));
        setGroups(groups);
      }, err => console.log(`Error parsing JSON: ${err.message}`));
    }).catch(err => console.log(`Error: ${err.message}`));
  }, [groupUpdate]);

  return (
    <>
      <h1 id='main-title'>DivSum Expense Splitter</h1>
      <div id="content">
        <div id="groups" className="content-elem">
          {groups.map(group => {
            return (
              <a onClick={() => selectedGroup?.id !== group.id ? setSelectedGroup(group) : setSelectedGroup(null)} className='group-elem' key={group.id}>{group.name}</a>
            );
          })
          }
        </div>
        <div id="expenses" className="content-elem">
          {selectedGroup?.name ?? 'No group selected'}
        </div>
        <form method='post' onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Enter Group Name: </label>
            <input type="text" name="name" required />
            <input type="submit" value="Add Group"/>
          </div>
        </form>
      </div>
    </>
  );
}

export default App;
