import React from 'react';
import Sidebar from "../components/Sidebar";
import { ToastContainer } from "react-toastify";
import { useLocation, useNavigate } from 'react-router-dom';
import useFormHandler from '../hooks/useFormHandler';

function AddClient() {

  const token = localStorage.getItem("userToken");
  const location = useLocation();
  const navigate = useNavigate();
  const initialValues = { client_name: '', email: '', entity: '', address: '' };

  const apiUrls = {
   baseUrl: `${process.env.REACT_APP_API_BASE_URL}/api/clients/`,
   entityUrl: `${process.env.REACT_APP_API_BASE_URL}/api/entities/`,
   redirectUrl: '/dashboard/clients',
  };

  const { formValues, entities, handleInputChange, handleSubmit } = useFormHandler(initialValues, apiUrls, token, navigate, location);

  return (
    <div className="container">
      <Sidebar />
      <section className="main">
        <div className="main-top">
          <div className="heading">
            <h2>{formValues.id ? 'Edit Client' : 'Add Client'}</h2>
          </div>
        </div>

        <div className="main-skills">
          <section className="add_client_page">
            <div className="container">
              <form onSubmit={handleSubmit} className="form">
                <div className="fields_main">
                  <div className="sec_field">
                    <label>Client Name :</label>
                    <input
                      type="text"
                      name="client_name"
                      placeholder="Client Name"
                      value={formValues.client_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="sec_field">
                    <label> E-mail :</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formValues.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="sec_field">
                    <label> Entity :</label>
                    <select
                      name="entity"
                      value={formValues.entity} 
                      onChange={handleInputChange} 
                      required
                    >
                      <option value="">Select Entity</option>
                      {entities.map((entity) => (
                        <option key={entity.id} value={entity.id}>
                          {entity.entity_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sec_field">
                    <label> Address :</label>
                    <textarea
                      name="address"
                      rows="4"
                      placeholder="Address"
                      value={formValues.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="submit_btn">
                  <button className="form_submit" type="submit">{formValues.id ? 'Update' : 'Save'}</button>
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

export default AddClient;
