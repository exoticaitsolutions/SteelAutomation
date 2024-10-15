import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function useFormHandler(initialValues, apiUrls, token, navigate, location) {
  const [formValues, setFormValues] = useState(initialValues);
  const [entities, setEntities] = useState([]);
  const [clients, setClients] = useState([]); 
  const [projects, setProjects] = useState([]); 
  const [isEditing, setIsEditing] = useState(false);


  useEffect(() => {
    const fetchEntities = async () => {
      if (!apiUrls.entityUrl) return; 

      try {
        const response = await axios.get(apiUrls.entityUrl, {
          headers: { Authorization: `Token ${token}` },
        });
        setEntities(response.data);
      } catch (error) {
        console.error('Error fetching entities:', error);
        toast.error('Error fetching entities');
      }
    };

    fetchEntities();
  }, [token, apiUrls.entityUrl]);

  
  useEffect(() => {
    const fetchClients = async () => {
      if (!apiUrls.clientsUrl) return; 

      try {
        const response = await axios.get(apiUrls.clientsUrl, {
          headers: { Authorization: `Token ${token}` },
        });
        setClients(response.data);
      } catch (error) {
        console.error('Error fetching clients:', error);
        toast.error('Error fetching clients');
      }
    };

    fetchClients();
  }, [token, apiUrls.clientsUrl]);


  useEffect(() => {
    const fetchProjects = async () => {
      if (!apiUrls.projectsUrl) return; 

      try {
        const response = await axios.get(apiUrls.projectsUrl, {
          headers: { Authorization: `Token ${token}` },
        });
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error('Error fetching projects');
      }
    };

    fetchProjects();
  }, [token, apiUrls.projectsUrl]);


  useEffect(() => {
    if (location.state && location.state.item) {
      const updatedFormValues = {
        ...location.state.item,
        entity: location.state.item.entity?.id || '', 
        client: location.state.item.client?.id || '', 
        project: location.state.item.project?.id || '', 
      };
      setFormValues(updatedFormValues);
      setIsEditing(true);
    } else {
      console.log('No item found in location.state');
    }
  }, [location.state]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = isEditing ? `${apiUrls.baseUrl}${formValues.id}/` : apiUrls.baseUrl;
      const method = isEditing ? 'put' : 'post';
      await axios[method](apiUrl, formValues, {
        headers: { Authorization: `Token ${token}` },
      });
      toast.success(isEditing ? 'Item updated successfully!' : 'Item added successfully!');
      navigate(apiUrls.redirectUrl);
    } catch (error) {
      console.error('Error saving item:', error.response ? error.response.data : error.message);
      toast.error(error.response?.data?.detail || 'Error saving item. Please try again.');
    }
  };

  return {
    formValues,
    entities,
    clients,
    projects,
    isEditing,
    handleInputChange,
    handleSubmit,
  };
}

export default useFormHandler;
