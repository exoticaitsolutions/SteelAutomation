import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Projects() {
    const [projects, setProjects] = useState([]);
    const token = localStorage.getItem('userToken');
    const userRole = localStorage.getItem('userRole');
    const navigate = useNavigate(); 
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/projects/', {
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
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/projects/${id}/`, {
                    headers: {
                        "Authorization": `Token ${token}`
                    }
                });
        
                setProjects(projects.filter(project => project.id !== id));
               
            } catch (error) {
                console.error('Error deleting client:', error);
            }
        }
    };

   
    const handleEdit = (project) => {
        navigate(`/dashboard/add_project`, { state: { project } }); 
    };

    return (
        <section className="List">
            <div className="container">
                <Sidebar />
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
                                                <button onClick={() => handleEdit(project)}><i class="fas fa-edit"/></button>
                                                <button onClick={() => handleDelete(project.id)}><i class="fas fa-calendar"/></button>
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

export default Projects;
