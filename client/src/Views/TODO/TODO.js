import { useEffect, useState } from 'react';
import Styles from './TODO.module.css';
import { dummy } from './dummy';
import axios from 'axios';

export function TODO(props) {
    const [newTodo, setNewTodo] = useState('');
    const [todoData, setTodoData] = useState(dummy);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTodo = async () => {
            const apiData = await getTodo();
            setTodoData(apiData);
            setLoading(false);
        };
        fetchTodo();
    }, []);

    const getTodo = async () => {
        const options = {
            method: 'GET',
            url: `http://localhost:8000/api/todo`,
            headers: {
                accept: 'application/json',
            },
        };
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (err) {
            console.log(err);
            return []; // return an empty array in case of error
        }
    };

    const addTodo = () => {
        const options = {
            method: 'POST',
            url: `http://localhost:8000/api/todo`,
            headers: {
                accept: 'application/json',
            },
            data: {
                title: newTodo,
                description: 'description', // default description
            },
        };
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
                setTodoData((prevData) => [...prevData, response.data.newTodo]);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const deleteTodo = (id) => {
        const options = {
            method: 'DELETE',
            url: `http://localhost:8000/api/todo/${id}`,
            headers: {
                accept: 'application/json',
            },
        };
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
                setTodoData((prevData) => prevData.filter((todo) => todo._id !== id));
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const updateTodo = (id) => {
        const todoToUpdate = todoData.find((todo) => todo._id === id);
        const options = {
            method: 'PATCH',
            url: `http://localhost:8000/api/todo/${id}`,
            headers: {
                accept: 'application/json',
            },
            data: {
                ...todoToUpdate,
                done: !todoToUpdate.done,
            },
        };
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
                setTodoData((prevData) =>
                    prevData.map((todo) => (todo._id === id ? response.data : todo))
                );
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const editTodo = (id, newTitle, newDescription) => {
        const options = {
            method: 'PATCH',
            url: `http://localhost:8000/api/todo/${id}`,
            headers: {
                accept: 'application/json',
            },
            data: {
                title: newTitle,
                description: newDescription,
            },
        };
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
                setTodoData((prevData) =>
                    prevData.map((todo) => (todo._id === id ? response.data : todo))
                );
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div className={Styles.ancestorContainer}>
            <div className={Styles.headerContainer}>
                <h1>Tasks</h1>
                <span>
                    <input
                        className={Styles.todoInput}
                        type='text'
                        name='New Todo'
                        value={newTodo}
                        onChange={(event) => {
                            setNewTodo(event.target.value);
                        }}
                    />
                    <button
                        id='addButton'
                        name='add'
                        className={Styles.addButton}
                        onClick={() => {
                            addTodo();
                            setNewTodo('');
                        }}
                    >
                        + New Todo
                    </button>
                </span>
            </div>
            <div id='todoContainer' className={Styles.todoContainer}>
                {loading ? (
                    <p style={{ color: 'white' }}>Loading...</p>
                ) : todoData.length > 0 ? (
                    todoData.map((entry) => (
                        <div key={entry._id} className={Styles.todo}>
                            <span className={Styles.infoContainer}>
                                <input
                                    type='checkbox'
                                    checked={entry.done}
                                    onChange={() => updateTodo(entry._id)}
                                />
                                <span style={{display:'flex',justifyContent:'space-between'}}><p style={{fontWeight:'bold'}}>{entry.title}</p>
                                <p>{entry.description}</p></span>


                                <div className="title_container" style={{display:'flex',justifyContent:'space-between'}}>
                                    <input
                                        className='update'
                                        type='text'
                                        placeholder='New title'
                                        value={entry.newTitle || ''}
                                        onChange={(e) => {
                                            const updatedTodoData = todoData.map((todo) =>
                                                todo._id === entry._id ? { ...todo, newTitle: e.target.value } : todo
                                            );
                                            setTodoData(updatedTodoData);
                                        }}
                                    />
                                    <input
                                        className='update'
                                        type='text'
                                        placeholder='New description'
                                        value={entry.newDescription || ''}
                                        onChange={(e) => {
                                            const updatedTodoData = todoData.map((todo) =>
                                                todo._id === entry._id ? { ...todo, newDescription: e.target.value } : todo
                                            );
                                            setTodoData(updatedTodoData);
                                        }}
                                    />
                                    
                                </div>
                            </span>
                            <button     style={{
                                    cursor: 'pointer',
                                    color: 'white',
                                    background: 'blue',
                                    padding: '10px',
                                    borderRadius: '10px',
                                    width:'80px',
                                    border:'none'
                                }}
                                        className="title_edit"
                                        onClick={() => {
                                            editTodo(entry._id, entry.newTitle || entry.title, entry.newDescription || entry.description);
                                        }}
                                    >
                                        Edit
                                    </button>
                            <span
                                style={{
                                    cursor: 'pointer',
                                    color: 'white',
                                    background: 'red',
                                    padding: '10px',
                                    borderRadius: '10px',
                                    
                                }}
                                onClick={() => deleteTodo(entry._id)}
                            >
                                Delete
                            </span>
                        </div>
                    ))
                ) : (
                    <p className={Styles.noTodoMessage}>No tasks available. Please add a new task.</p>
                )}
            </div>
        </div>
    );
}
