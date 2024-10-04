import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const token = localStorage.getItem("userToken");

function AddProject() {
    const [clients, setClients] = useState([]);
    const [entities, setEntities] = useState([]);
    const [selectedClient, setSelectedClient] = useState('');
    const [selectedEntity, setSelectedEntity] = useState('');
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [projectId, setProjectId] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();

   
    useEffect(() => {
        if (location.state && location.state.project) {
            const { project } = location.state;
            setProjectId(project.id);
            setProjectName(project.project_name);
            setDescription(project.description);
            setSelectedClient(project.client.id);
            setSelectedEntity(project.entity.id);
        }
    }, [location.state]);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/clients/', {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                });

                if (Array.isArray(response.data)) {
                    setClients(response.data);
                } else {
                    console.error('Expected an array but got:', response.data);
                }
            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        };

        if (token) {
            fetchClients();
        }
    }, [token]);

    useEffect(() => {
        const fetchEntities = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/entities/', {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                });

                if (Array.isArray(response.data)) {
                    setEntities(response.data);
                } else {
                    console.error('Expected an array but got:', response.data);
                }
            } catch (error) {
                console.error('Error fetching entities:', error);
            }
        };

        if (token) {
            fetchEntities();
        }
    }, [token]);


    const submitProject = async (event) => {
        event.preventDefault();

        try {
            const projectData = {
                project_name: projectName,
                description,
                client: selectedClient,
                entity: selectedEntity
            };

            let response;

            if (projectId) {
          
                response = await axios.put(`http://127.0.0.1:8000/api/projects/${projectId}/`, projectData, {
                    headers: {
                        Authorization: `Token ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            } else {
                
                response = await axios.post('http://127.0.0.1:8000/api/projects/', projectData, {
                    headers: {
                        Authorization: `Token ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            }

            if (response.status === 201 || response.status === 200) {
                alert("Your Project Submitted Successfully");
                
              
                setProjectName('');
                setDescription('');
                setSelectedClient('');
                setSelectedEntity('');
                setProjectId(null);
                navigate('/dashboard/projects');
            } else {
                console.error('Unexpected response status:', response.status);
                alert("Failed to submit project. Please try again.");
            }
        } catch (error) {
            console.error('Error submitting project:', error);
            alert("Failed to submit project. Please check your inputs and try again.");
        }
    };

    return (
        <div className="container">
            <Sidebar />

            <section className="main">
                <div className="main-top">
                    <div className="heading">
                        <h2>{projectId ? 'Edit Project' : 'Add Project'}</h2>
                    </div>
                </div>
                <div className="main-skills">
                    <section className="add_client_page">
                        <div className="container">
                            <form onSubmit={submitProject} className="form">
                                <div className="fields_main">
                                    <div className="sec_field">
                                        <label>Project Name :</label>
                                        <input
                                            type="text"
                                            placeholder="Project Name"
                                            value={projectName}
                                            onChange={(e) => setProjectName(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="sec_field">
                                        <label>Description :</label>
                                        <input
                                            type="text"
                                            placeholder="Description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="sec_field">
                                        <label>Clients :</label>
                                        <select
                                            value={selectedClient}
                                            onChange={(e) => setSelectedClient(e.target.value)}
                                            required
                                        >
                                            <option value="" disabled>Select Client</option>
                                            {clients.length > 0 ? (
                                                clients.map((client) => (
                                                    <option key={client.id} value={client.id}>
                                                        {client.client_name}
                                                    </option>
                                                ))
                                            ) : (
                                                <option disabled>No client available</option>
                                            )}
                                        </select>
                                    </div>

                                    <div className="sec_field">
                                        <label>Entity :</label>
                                        <select
                                            value={selectedEntity}
                                            onChange={(e) => setSelectedEntity(e.target.value)}
                                            required
                                        >
                                            <option value="" disabled>Select Entity</option>
                                            {entities.length > 0 ? (
                                                entities.map((entity) => (
                                                    <option key={entity.id} value={entity.id}>
                                                        {entity.entity_name}
                                                    </option>
                                                ))
                                            ) : (
                                                <option disabled>No entities available</option>
                                            )}
                                        </select>
                                    </div>
                                </div>

                                <div className="submit_btn">
                                    <input className="form_submit" type="submit" value={projectId ? 'Update' : 'Save'} />
                                </div>
                            </form>
                        </div>
                    </section>
                </div>
            </section>
        </div>
    );
}

export default AddProject;
