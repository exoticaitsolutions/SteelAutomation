import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Topbar from '../components/Topbar';

function ItemCategories() {
    const [categories, setCategories] = useState([]);
    const token = localStorage.getItem('userToken');
    const userRole = localStorage.getItem('userRole');

    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/item-categories/`, {
                    headers: {
                        "Authorization": `Token ${token}`
                    }
                });
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching Categories data:', error);
                console.log(token);
            }
        };

        fetchCategories();
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
                    await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/item-categories/${id}/`, {
                        headers: {
                            "Authorization": `Token ${token}`
                        }
                    });

                    setCategories(categories.filter(category => category.id !== id));

                    Swal.fire(
                        'Deleted!',
                        'The category has been deleted.',
                        'success'
                    );
                } catch (error) {
                    console.error('Error deleting client:', error);
                    Swal.fire(
                        'Error!',
                        'There was a problem deleting the category.',
                        'error'
                    );
                }
            }
        });
    };

    const handleEdit = (category) => {
        navigate(`/dashboard/add_item_category`, { state: { item: category } });
    };

    return (
            <div className="container">
                 <Sidebar />
                <section className='main'>
                    <Topbar />
                    <div className="list-main">
                        {userRole === 'ADMIN' && (
                            <div className='add_btn'>
                                <Link to="/dashboard/add_item_category"><button>Add <AddIcon className='plus_icon'/></button></Link>
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
                                {categories.length > 0 ? (
                                    categories.map(category => (
                                        <tr key={category.id}>
                                            <td>{category.name}</td>
                                            {userRole === 'ADMIN' && (
                                                <td>
                                                    <div className='action_btn'>
                                                        <button onClick={() => handleEdit(category)}><EditIcon/></button>
                                                        <button onClick={() => handleDelete(category.id)}><DeleteIcon /></button>
                                                    </div>
                                                </td>
                                            )}

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5">No category found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
     
    );
}

export default ItemCategories;
