import React from 'react';
import { useEffect, useState } from 'react';
import { Button, EditableText, InputGroup } from '@blueprintjs/core';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const CrudApp = () => {
    const [users, setUsers] = useState([]);
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newWebsite, setNewWebsite] = useState("");
    const [toastMessage, setToastMessage] = useState(null);

    useEffect(() => {
        axios.get('https://jsonplaceholder.typicode.com/users')
            .then((response) => setUsers(response.data))
            .catch((error) => {
                showToast("Failed to fetch users", "danger");
                console.error(error);
            });
    }, []);

    function showToast(message, type) {
        setToastMessage({ message, type });
        setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    }

    function addUser() {
        const name = newName.trim();
        const email = newEmail.trim();
        const website = newWebsite.trim();

        if (name && email && website) {
            axios.post("https://jsonplaceholder.typicode.com/users", {
                name,
                email,
                website
            })
            .then((response) => {
                setUsers([...users, response.data]);
                showToast("User added successfully", "success");
                setNewName("");
                setNewEmail("");
                setNewWebsite("");
            })
            .catch((error) => {
                showToast("Failed to add user", "danger");
                console.error(error);
            });
        }
    }

    function onChangeHandler(id, key, value) {
        setUsers((users) => {
            return users.map(user => {
                return user.id === id ? { ...user, [key]: value } : user;
            });
        });
    }

    function updateUser(id) {
        const user = users.find((user) => user.id === id);
        axios.put(`https://jsonplaceholder.typicode.com/users/${id}`, user)
            .then(() => {
                showToast("User updated successfully", "primary");
            })
            .catch((error) => {
                showToast("Failed to update user", "danger");
                console.error(error);
            });
    }

    function deleteUser(id) {
        axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`)
            .then(() => {
                setUsers((users) => users.filter(user => user.id !== id));
                showToast("User deleted successfully", "danger");
            })
            .catch((error) => {
                showToast("Failed to delete user", "danger");
                console.error(error);
            });
    }

    return (
        <div className="App container mt-5 flex flex-wrap">
            <h1 className="text-center mb-4">CRUD App Using axios</h1>

            {toastMessage && (
                <div className={`alert alert-${toastMessage.type} alert-dismissible fade show text-center`} role="alert">
                    {toastMessage.message}
                </div>
            )}

            <div className="table-responsive">
                <table className="table table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Website</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user =>
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>
                                    <EditableText
                                        onChange={value => onChangeHandler(user.id, 'name', value)}
                                        value={user.name}
                                    />
                                </td>
                                <td>
                                    <EditableText
                                        onChange={value => onChangeHandler(user.id, 'email', value)}
                                        value={user.email}
                                    />
                                </td>
                                <td>
                                    <EditableText
                                        onChange={value => onChangeHandler(user.id, 'website', value)}
                                        value={user.website}
                                    />
                                </td>
                                <td>
                                    <Button intent='primary' onClick={() => updateUser(user.id)} className="btn btn-primary btn-sm">Update</Button>
                                    &nbsp;
                                    <Button intent='danger' onClick={() => deleteUser(user.id)} className="btn btn-danger btn-sm">Delete</Button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td></td>
                            <td>
                                <InputGroup
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder='Enter Name...'
                                    className="form-control"
                                />
                            </td>
                            <td>
                                <InputGroup
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder='Enter Email...'
                                    className="form-control"
                                />
                            </td>
                            <td>
                                <InputGroup
                                    value={newWebsite}
                                    onChange={(e) => setNewWebsite(e.target.value)}
                                    placeholder='Enter Website...'
                                    className="form-control"
                                />
                            </td>
                            <td>
                                <Button intent='success' onClick={addUser} className="btn btn-success btn-sm">Add User</Button>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}

export default CrudApp;
