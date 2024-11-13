import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2'

function useFormHandler(initialValues, apiUrls, token, navigate, location) {
  const [formValues, setFormValues] = useState(initialValues);
  const [entities, setEntities] = useState([]);
  const [clients, setClients] = useState([]); 
  const [projects, setProjects] = useState([]); 

  const [zones, setZones] = useState([]); 
  const [types, setTypes] = useState([]); 
  const [categories, setCategories] = useState([]); 
  const [units, setUnits] = useState([]); 

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
    const fetchZones = async () => {
      if (!apiUrls.zonesUrl) return; 

      try {
        const response = await axios.get(apiUrls.zonesUrl, {
          headers: { Authorization: `Token ${token}` },
        });
        setZones(response.data);
      } catch (error) {
        console.error('Error fetching zoness:', error);
        toast.error('Error fetching zones');
      }
    };

    fetchZones();
  }, [token, apiUrls.zonesUrl]);

  useEffect(() => {
    const fetchTypes = async () => {
      if (!apiUrls.typesUrl) return; 

      try {
        const response = await axios.get(apiUrls.typesUrl, {
          headers: { Authorization: `Token ${token}` },
        });
        setTypes(response.data);
      } catch (error) {
        console.error('Error fetching types:', error);
        toast.error('Error fetching types');
      }
    };

    fetchTypes();
  }, [token, apiUrls.typesUrl]);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!apiUrls.categoriesUrl) return; 

      try {
        const response = await axios.get(apiUrls.categoriesUrl, {
          headers: { Authorization: `Token ${token}` },
        });
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching category:', error);
        toast.error('Error fetching category');
      }
    };

    fetchCategories();
  }, [token, apiUrls.categoryUrl]);

  useEffect(() => {
    const fetchUnits = async () => {
      if (!apiUrls.unitsUrl) return; 

      try {
        const response = await axios.get(apiUrls.unitsUrl, {
          headers: { Authorization: `Token ${token}` },
        });
        setUnits(response.data);
      } catch (error) {
        console.error('Error fetching Units:', error);
        toast.error('Error fetching Units');
      }
    };

    fetchUnits();
  }, [token, apiUrls.unitsUrl]);

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

  

  const handleSubmitBoth = async (e, extraFields) => {
    e.preventDefault();

    const dataToSubmit = {
      ...formValues,
      payment_notice_back_date: formValues.paymentNoticeBackDate, 
      Payment_BoQDetailed: extraFields.map((field, index) => ({
        ref: field.ref,  
        acw: field.acw,           
        pcs: field.pcs,
        qty: field.qty,
        unit: field.unit,
        rate: field.rate,
        total: field.total,
        payment: field.payment,    
        item: field.item,          
        category: field.category,
        type: field.type,
        zone: field.zone,
    })),
  };

    try {
      const apiUrl = isEditing ? `${apiUrls.baseUrl}${formValues.id}/` : apiUrls.baseUrl;
      const method = isEditing ? 'put' : 'post';
      await axios[method](apiUrl, dataToSubmit, {
        headers: { Authorization: `Token ${token}` },
      });
      toast.success(isEditing ? 'Item updated successfully!' : 'Item added successfully!');
      Swal.fire({
        title: "Successfully Create",
        text: "You clicked the button!",
        icon: "success"
      });
      navigate(apiUrls.redirectUrl);
    } catch (error) {
      console.error('Error saving item:', error.response ? error.response.data : error.message);
      toast.error(error.response?.data?.detail || 'Error saving item. Please try again.');
    }
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
    zones,
    types,
    categories,
    units,
    isEditing,
    handleInputChange,
    handleSubmitBoth,
    handleSubmit,
    setIsEditing,
  };
}

export default useFormHandler;
