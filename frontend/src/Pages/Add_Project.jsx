import React from 'react';
import Sidebar from "../components/Sidebar";
import { ToastContainer } from "react-toastify";
import { useLocation, useNavigate } from 'react-router-dom';
import useFormHandler from '../hooks/useFormHandler';

function AddProject() {
  const token = localStorage.getItem("userToken");
  const location = useLocation();
  const navigate = useNavigate();

  const initialValues = {
    project_name: '',
    description: '',
    client: '',
    entity: '',
  };

  const apiUrls = {
    baseUrl: `${process.env.REACT_APP_API_BASE_URL}/api/projects/`,
    entityUrl: `${process.env.REACT_APP_API_BASE_URL}/api/entities/`,
    clientsUrl: `${process.env.REACT_APP_API_BASE_URL}/api/clients/`,
    redirectUrl: '/dashboard/projects',
  };

  const { formValues, entities, clients, handleInputChange, handleSubmit, isEditing } = useFormHandler(initialValues, apiUrls, token, navigate, location);

  return (
    <div className="container">
      <Sidebar />
      <section className="main">
        <div className="main-top">
          <div className="heading">
            <h2>{isEditing ? 'Edit Project' : 'Add Project'}</h2>
          </div>
        </div>

        <div className="main-skills">
          <section className="add_project_page">
            <div className="container">
              <form onSubmit={handleSubmit} className="form">
                <div className="fields_main">
                  <div className="sec_field">
                    <label>Project Name :</label>
                    <input
                      type="text"
                      name="project_name"
                      placeholder="Project Name"
                      value={formValues.project_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="sec_field">
                    <label>Description :</label>
                    <input
                      name="description"
                      type="text"
                      placeholder="Description"
                      value={formValues.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="sec_field">
                    <label>Client :</label>
                    <select
                      name="client"
                      value={formValues.client}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Client</option>
                      {clients.length > 0 ? (
                        clients.map((client) => (
                          <option key={client.id} value={client.id}>
                            {client.client_name}
                          </option>
                        ))
                      ) : (
                        <option disabled>No clients available</option>
                      )}
                    </select>
                  </div>
                  <div className="sec_field">
                    <label>Entity :</label>
                    <select
                      name="entity"
                      value={formValues.entity} 
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Entity</option>
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
                  <button className="form_submit" type="submit">{isEditing ? 'Update' : 'Save'}</button>
                </div>
              </form>
            </div>
          </section>
        </div>
        <ToastContainer />
      </section>
    </div>
  );
}

export default AddProject;
