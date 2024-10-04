import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Contracts() {
    const [Contracts, setContracts] = useState([]);
    const token = localStorage.getItem('userToken');
    const userRole = localStorage.getItem('userRole');
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchContracts = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/contracts/', {
                    headers: {
                        "Authorization": `Token ${token}`
                    }
                });
                setContracts(response.data);
            } catch (error) {
                console.error('Error fetching contract data:', error);
            }
        };
        fetchContracts();
    }, [token]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this contract?')) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/contracts/${id}/`, {
                    headers: {
                        "Authorization": `Token ${token}`
                    }
                });
                setContracts(Contracts.filter(contract => contract.id !== id));
            } catch (error) {
                console.error('Error deleting contract:', error);
            }
        }
    };

    const handleEdit = (contract) => {
        navigate(`/dashboard/add_contract`, { state: { contract } });
    };

    return (
        <section className="List">
            <div className="container">
                <Sidebar />
                <div className="list-main">
                {userRole === 'ADMIN' && (
                    <div className='add_btn'>
                        <Link to="/dashboard/add_contract"><button>Add Contract</button></Link>
                    </div>
                )}
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Contract Details</th>
                                <th>Projects</th>
                                {userRole === 'ADMIN' && (
                                <th>Action</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {Contracts.length > 0 ? (
                                Contracts.map(contract => (
                                    <tr key={contract.id}>
                                        <td>{contract.contract_details}</td>
                                        <td>{contract.project?.project_name}</td>
                                        {userRole === 'ADMIN' && (
                                        <td>
                                            <div className='action_btn'>
                                                <button onClick={() => handleEdit(contract)}>
                                                    <i className="fas fa-edit" />
                                                </button>
                                                <button onClick={() => handleDelete(contract.id)}>
                                                    <i className="fas fa-trash" />
                                                </button>
                                            </div>
                                        </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3">No contracts found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

export default Contracts;
