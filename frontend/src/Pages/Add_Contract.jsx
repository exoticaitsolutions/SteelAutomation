import React from 'react';
import Sidebar from "../components/Sidebar";
import { ToastContainer } from "react-toastify";
import { useLocation, useNavigate } from 'react-router-dom';
import useFormHandler from '../hooks/useFormHandler';

function AddContract() {
    const token = localStorage.getItem("userToken");
    const location = useLocation();
    const navigate = useNavigate();

    const initialValues = {
        contract_details: '',
        project: '',
    };

    const apiUrls = {
        baseUrl: `${process.env.REACT_APP_API_BASE_URL}/api/contracts/`,
        projectsUrl: `${process.env.REACT_APP_API_BASE_URL}/api/projects/`,
        redirectUrl: '/dashboard/contracts',
    };

    const { formValues, projects, isEditing, handleInputChange, handleSubmit } = useFormHandler(
        initialValues,
        apiUrls,
        token,
        navigate,
        location
    );

    console.log("Selected Project ID:", formValues.project);
    console.log("Current form values:", formValues);

    return (
        <div className="container">
            <Sidebar />
            <section className="main">
                <div className="main-top">
                    <div className="heading">
                        <h2>{isEditing ? 'Edit Contract' : 'Add Contract'}</h2>
                    </div>
                </div>
                <div className="main-skills">
                    <section className="add_contract_page">
                        <div className="container">
                            <form className="form" onSubmit={handleSubmit}>
                                <div className="fields_main_contract">
                                    <div className="sec_field">
                                        <label>Contract Details:</label>
                                        <input 
                                            type="text" 
                                            name="contract_details" 
                                            placeholder="Contract Details" 
                                            value={formValues.contract_details} 
                                            onChange={handleInputChange} 
                                            required
                                        />
                                    </div>
                                    <div className="sec_field">
                                        <label>Project:</label>
                                        <select
                                            name="project"
                                            value={formValues.project} 
                                            onChange={handleInputChange}
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
                                                <option disabled>No projects available</option>
                                            )}
                                        </select>
                                    </div>
                                </div>
                                <div className="submit_btn">
                                    <button className="form_submit" type="submit">
                                        {isEditing ? 'Update' : 'Save'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </section>
                </div>
            </section>
            <ToastContainer />
        </div>
    );
}

export default AddContract;
