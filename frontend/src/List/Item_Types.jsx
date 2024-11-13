import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Topbar from '../components/Topbar';

function ItemTypes() {
    const [types, setTypes] = useState([]);
    const token = localStorage.getItem('userToken');
    const userRole = localStorage.getItem('userRole');

    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/item-types/`, {
                    headers: {
                        "Authorization": `Token ${token}`
                    }
                });
                setTypes(response.data);
            } catch (error) {
                console.error('Error fetching Item_Types data:', error);
                console.log(token);
            }
        };

        fetchTypes();
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
                    await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/item-types/${id}/`, {
                        headers: {
                            "Authorization": `Token ${token}`
                        }
                    });

                    setTypes(types.filter(type => type.id !== id));

                    Swal.fire(
                        'Deleted!',
                        'The Item_Types has been deleted.',
                        'success'
                    );
                } catch (error) {
                    console.error('Error deleting Item_Types:', error);
                    Swal.fire(
                        'Error!',
                        'There was a problem deleting the Item_Types.',
                        'error'
                    );
                }
            }
        });
    };

    const handleEdit = (type) => {
        navigate(`/dashboard/add_item_type`, { state: { item: type } });
    };

    return (
            <div className="container">
                 <Sidebar />
                <section className='main'>
                    <Topbar />
                    <div className="list-main">
                        {userRole === 'ADMIN' && (
                            <div className='add_btn'>
                                <Link to="/dashboard/add_item_type"><button>Add <AddIcon className='plus_icon'/></button></Link>
                            </div>
                        )}
                        <table className='table'>
                            <thead>
            
                                <tr>
                                    <th>Name</th>
                                    {userRole === "ADMIN" && (
                                        <th>Action</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {types.length > 0 ? (
                                    types.map(type => (
                                        <tr key={type.id}>
                                            <td>{type.name}</td>
                                            {userRole === 'ADMIN' && (
                                                <td>
                                                    <div className='action_btn'>
                                                        <button onClick={() => handleEdit(type)}><EditIcon /></button>
                                                        <button onClick={() => handleDelete(type.id)}><DeleteIcon/></button>
                                                    </div>
                                                </td>
                                            )}

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5">No types found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
     
    );
}

export default ItemTypes;
