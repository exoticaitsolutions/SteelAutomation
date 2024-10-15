import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function Clients() {
    const [clients, setClients] = useState([]);
    const token = localStorage.getItem('userToken');
    const userRole = localStorage.getItem('userRole');

    const navigate = useNavigate();
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/clients/`, {
                    headers: {
                        "Authorization": `Token ${token}`
                    }
                });
                setClients(response.data);
            } catch (error) {
                console.error('Error fetching client data:', error);
                console.log(token);
            }
        };

        fetchClients();
    }, [token]);


    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/clients/${id}/`, {
                        headers: {
                            "Authorization": `Token ${token}`
                        }
                    });
    
                    setClients(clients.filter(client => client.id !== id));
    
                    Swal.fire(
                        'Deleted!',
                        'The client has been deleted.',
                        'success'
                    );
                } catch (error) {
                    console.error('Error deleting client:', error);
                    Swal.fire(
                        'Error!',
                        'There was a problem deleting the client.',
                        'error'
                    );
                }
            }
        });
    };
    

    const handleEdit = (client) => {
        navigate(`/dashboard/add_client`, { state: { item: client } }); 
    };
    

    return (
        <section className="List">
            <div className="container">
                <Sidebar />
                <div className="list-main">
                    {userRole === 'ADMIN' && (
                        <div className='add_btn'>
                            <Link to="/dashboard/add_client"><button>Add Client</button></Link>
                        </div>
                    )}

                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Address</th>
                                <th>Entity</th>
                                {userRole === "ADMIN" && (
                                <th>Action</th>
                            )}
                            </tr>
                        </thead>
                        <tbody>
                            {clients.length > 0 ? (
                                clients.map(client => (
                                    <tr key={client.id}>
                                        <td>{client.client_name}</td>
                                        <td>{client.email}</td>
                                        <td>{client.address}</td>
                                        <td>{client.entity.entity_name}</td>
                                        {userRole === 'ADMIN' && (
                                            <td>
                                                <div className='action_btn'>
                                                    <button onClick={() => handleEdit(client)}><i className="fas fa-edit" /></button>
                                                    <button onClick={() => handleDelete(client.id)}><i className="fas fa-calendar" /></button>
                                                </div>
                                            </td>
                                        )}

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">No clients found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

export default Clients;
