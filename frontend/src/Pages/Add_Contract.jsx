import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const token = localStorage.getItem("userToken");

function AddContract() {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [contractDetails, setContractDetails] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const contract = location.state?.contract || null;

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/projects/', {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                });

                if (Array.isArray(response.data)) {
                    setProjects(response.data);
                } else {
                    console.error('Expected an array but got:', response.data);
                }
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        if (token) {
            fetchProjects();
        }
    }, [token]);

    useEffect(() => {
        if (contract) {
            setContractDetails(contract.contract_details || '');
            setSelectedProject(contract.project?.id || '');
        }
    }, [contract]);

    const handleSave = async (e) => {
        e.preventDefault();

        const payload = {
            contract_details: contractDetails,
            project: selectedProject,
        };

        try {
            if (contract) {
                // Update existing contract
                await axios.put(`http://127.0.0.1:8000/api/contracts/${contract.id}/`, payload, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
            } else {
                // Create new contract
                await axios.post('http://127.0.0.1:8000/api/contracts/', payload, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
            }
            navigate('/dashboard/contracts');
        } catch (error) {
            console.error('Error saving contract:', error);
        }
    };

    return (
        <div className="container">
            <Sidebar />
            <section className="main">
                <div className="main-top">
                    <div className="heading">
                        <h2>{contract ? 'Edit Contract' : 'Add Contract'}</h2>
                    </div>
                </div>
                <div className="main-skills">
                    <section className="add_client_page">
                        <div className="container">
                            <form className="form" onSubmit={handleSave}>
                                <div className="fields_main_contract">
                                    <div className="sec_field">
                                        <label>Contract Details : </label>
                                        <input 
                                            type="text" 
                                            placeholder="Contract Details" 
                                            value={contractDetails} 
                                            onChange={(e) => setContractDetails(e.target.value)} 
                                            required
                                        />
                                    </div>
                                    <div className="sec_field">
                                        <label>Project :</label>
                                        <select
                                            value={selectedProject}
                                            onChange={(e) => setSelectedProject(e.target.value)}
                                            required
                                        >
                                            <option value="" disabled>Select Project</option>
                                            {projects.length > 0 ? (
                                                projects.map((project) => (
                                                    <option key={project.id} value={project.id}>
                                                        {project.project_name}
                                                    </option>
                                                ))
                                            ) : (
                                                <option disabled>No project available</option>
                                            )}
                                        </select>
                                    </div>
                                </div>
                                <div className="submit_btn">
                                    <input className="form_submit" type="submit" value={contract ? "Update" : "Save"} />
                                </div>
                            </form>
                        </div>
                    </section>
                </div>
            </section>
        </div>
    );
}

export default AddContract;
