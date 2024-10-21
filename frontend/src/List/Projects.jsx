import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';

function Projects() {
    const [projects, setProjects] = useState([]);
    const token = localStorage.getItem('userToken');
    const userRole = localStorage.getItem('userRole');
    const navigate = useNavigate(); 
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/projects/`, {
                    headers: {
                        "Authorization": `Token ${token}`
                    }
                });
                setProjects(response.data);
            } catch (error) {
                console.error('Error fetching project data:', error);
                console.log(token);
            }
        };

        fetchProjects();
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
                    await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/projects/${id}/`, {
                        headers: {
                            "Authorization": `Token ${token}`
                        }
                    });
    
                    setProjects(projects.filter(project => project.id !== id));
    
                    Swal.fire(
                        'Deleted!',
                        'The project has been deleted.',
                        'success'
                    );
                } catch (error) {
                    console.error('Error deleting project:', error);
                    Swal.fire(
                        'Error!',
                        'There was a problem deleting the project.',
                        'error'
                    );
                }
            }
        });
    };
    
   
    const handleEdit = (project) => {
        navigate(`/dashboard/add_project`, { state: { item: project } }); 
    };

    return (
       
            <div className="container">
                <Sidebar />
                <section className='main'>
                <Topbar/>
                <div className="list-main">
                {userRole === 'ADMIN' && (
                    <div className='add_btn'>
                        <Link to="/dashboard/add_project"><button>Add Projects</button></Link>
                    </div>
                )}
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Name</th> 
                                <th>Description</th>
                                <th>Clients</th>
                                <th>Entity</th>
                                {userRole === 'ADMIN' && (
                                <th>Action</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {projects.length > 0 ? (
                                projects.map(project => (
                                    <tr key={project.id}>
                                        <td>{project.project_name}</td>
                                        <td>{project.description}</td>
                                        <td>{project.client.client_name}</td>
                                        <td>{project.entity.entity_name}</td>
                                        {userRole === 'ADMIN' && (
                                        <td>
                                            <div className='action_btn'>
                                                <button onClick={() => handleEdit(project)}><i className="fas fa-edit"/></button>
                                                <button onClick={() => handleDelete(project.id)}><i className="fas fa-calendar"/></button>
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
                </section>
            </div>
    
    );
}

export default Projects;
