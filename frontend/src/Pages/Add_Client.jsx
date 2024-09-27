import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from "../components/Sidebar";
import { toast, ToastContainer } from "react-toastify";
import { useLocation, useNavigate } from 'react-router-dom';
import validator from 'validator'; 
function AddClient() {
  const [entities, setEntities] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState('');
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState({}); 
  const token = localStorage.getItem("userToken");
  const location = useLocation();
  const navigate = useNavigate();

  
  const clientToEdit = location.state ? location.state.client : null;

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/entities/', {
          headers: { 
            "Authorization": `Token ${token}`
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

    fetchEntities();

    if (clientToEdit) {
      setClientName(clientToEdit.client_name);
      setEmail(clientToEdit.email);
      setSelectedEntity(clientToEdit.entity.id);
      setAddress(clientToEdit.address);
    }
  }, [token, clientToEdit]);


  const validateForm = () => {
    const newErrors = {};

    if (validator.isEmpty(clientName.trim())) {
      newErrors.clientName = 'Client name is required';
    }

    if (!validator.isEmail(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!selectedEntity) {
      newErrors.selectedEntity = 'Please select an entity';
    }

    if (validator.isEmpty(address.trim())) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

 
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting.');
      return;
    }

    const clientData = {
      client_name: clientName,
      email: email,
      entity: parseInt(selectedEntity),
      address: address,
    };

    try {
      if (clientToEdit) {
        const response = await axios.put(`http://127.0.0.1:8000/api/clients/${clientToEdit.id}/`, clientData, {
          headers: { 
            "Authorization": `Token ${token}`
          }
        });
        toast.success("Client updated successfully!");
      } else {
        const response = await axios.post('http://127.0.0.1:8000/api/clients/', clientData, {
          headers: { 
            "Authorization": `Token ${token}`
          }
        });
        toast.success("Client added successfully!");
      }

      setClientName('');
      setEmail('');
      setSelectedEntity('');
      setAddress('');
      navigate('/dashboard/clients');
    } catch (error) {
      console.error('Error saving client:', error);
      toast.error('Error saving client. Please try again.');
    }
  };

  return (
    <div className="container">
      <Sidebar />
      <section className="main">
        <div className="main-top">
          <div className="heading">
            <h2>{clientToEdit ? 'Edit Client' : 'Add Client'}</h2>
          </div>
        </div>

        <div className="main-skills">
          <section className="add_client_page">
            <div className="containerr">
              <form className="form" onSubmit={handleSubmit}>
                <div className="fields_main">
                  <div className="sec_field">
                    <label>Client Name</label>
                    <input
                      type="text"
                      placeholder="Client Name"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      required
                    />
                  
                    {errors.clientName && <span className="error-text">{errors.clientName}</span>}
                  </div>

                  <div className="sec_field">
                    <label>Email</label>
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
       
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>

                  <div className="sec_field">
                    <label>Entity</label>
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
                
                    {errors.selectedEntity && <span className="error-text">{errors.selectedEntity}</span>}
                  </div>

                  <div className="sec_field">
                    <label>Address</label>
                    <textarea
                      name="description"
                      rows="4"
                      cols="50"
                      placeholder="Address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
          
                    {errors.address && <span className="error-text">{errors.address}</span>}
                  </div>
                </div>

                <div className="submit_btn">
                  <input className="form_submit" type="submit" value={clientToEdit ? 'Update' : 'Save'} />
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

export default AddClient;
