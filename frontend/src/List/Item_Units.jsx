import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Topbar from '../components/Topbar';

function ItemUnits() {
    const [units, setUnits] = useState([]);
    const token = localStorage.getItem('userToken');
    const userRole = localStorage.getItem('userRole');

    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/item-units/`, {
                    headers: {
                        "Authorization": `Token ${token}`
                    }
                });
                setUnits(response.data);
            } catch (error) {
                console.error('Error fetching setUnits data:', error);
                console.log(token);
                
            }
        };

        fetchUnits();
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
                    await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/item-units/${id}/`, {
                        headers: {
                            "Authorization": `Token ${token}`
                        }
                    });

                    setUnits(units.filter(unit => unit.id !== id));

                    Swal.fire(
                        'Deleted!',
                        'The Item_units has been deleted.',
                        'success'
                    );
                } catch (error) {
                    console.error('Error deleting Item_units:', error);
                    Swal.fire(
                        'Error!',
                        'There was a problem deleting the Item_units.',
                        'error'
                    );
                }
            }
        });
    };

    const handleEdit = (unit) => {
        navigate(`/dashboard/add_item_unit`, { state: { item: unit } });
    };

    return (
            <div className="container">
                 <Sidebar />
                <section className='main'>
                    <Topbar />
                    <div className="list-main">
                        {userRole === 'ADMIN' && (
                            <div className='add_btn'>
                                <Link to="/dashboard/add_item_unit"><button>Add <AddIcon className='plus_icon'/></button></Link>
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
                                {units.length > 0 ? (
                                    units.map(unit => (
                                        <tr key={unit.id}>
                                            <td>{unit.name}</td>
                                            {userRole === 'ADMIN' && (
                                                <td>
                                                    <div className='action_btn'>
                                                        <button onClick={() => handleEdit(unit)}><EditIcon /></button>
                                                        <button onClick={() => handleDelete(unit.id)}><DeleteIcon/></button>
                                                    </div>
                                                </td>
                                            )}

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5">No unit found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
     
    );
}

export default ItemUnits;
