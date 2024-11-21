import "../App.css";
import { React, useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useLocation, useNavigate } from 'react-router-dom';
import useFormHandler from '../hooks/useFormHandler';
import Topbar from "../components/Topbar";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { toast } from 'react-toastify';

function PaymentProcessing() {
    const token = localStorage.getItem("userToken");
    const location = useLocation();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);

    const initialValues = {
        entity: "",
        project: "",
        client: "",
        payment_category: [],
        payment_sent_date: "",
        payment_notice_back_date: "",
        progress: [],
        nett_payment_due: "",
    };

    const apiUrls = {
        baseUrl: `${process.env.REACT_APP_API_BASE_URL}/api/payment/`,
        entityUrl: `${process.env.REACT_APP_API_BASE_URL}/api/entities/`,
        clientsUrl: `${process.env.REACT_APP_API_BASE_URL}/api/clients/`,
        projectsUrl: `${process.env.REACT_APP_API_BASE_URL}/api/projects/`,
        categoriesUrl: `${process.env.REACT_APP_API_BASE_URL}/api/categories/`,
        redirectUrl: '/dashboard/payments',
    };

    const { formValues, entities, projects, clients, handleInputChange } = useFormHandler(initialValues, apiUrls, token, navigate, location);

    const [categories, setCategories] = useState([]);
    const [extraFields, setExtraFields] = useState([{ progress: '', categories: [] }]);

    useEffect(() => {
        if (formValues.project) {
            const fetchCategories = async () => {
                try {
                    const response = await fetch(`${apiUrls.categoriesUrl}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({ project_id: formValues.project })
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch categories');
                    }

                    const data = await response.json();
                    setCategories(data.payment_category || []);
                } catch (error) {
                    console.error('Error fetching categories:', error);
                }
            };

            fetchCategories();
        }
    }, [formValues.project, apiUrls.categoriesUrl, token]);

    const addFields = () => {
        setExtraFields([...extraFields, { progress: '', categories: [] }]);
    };

    const removeFields = (index) => {
        const newFields = extraFields.filter((_, i) => i !== index);
        setExtraFields(newFields);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const categoryProgress = extraFields.map((field, index) => {
            return field.categories.map((category, idx) => ({
                category_id: category, 
                progress: field.progress  
            }));
        }).flat(); 

        const formData = {
            entity: formValues.entity,
            project: formValues.project,
            client: formValues.client,
            payment_sent_date: formValues.payment_sent_date,
            payment_notice_back_date: formValues.payment_notice_back_date,
            nett_payment_due: formValues.nett_payment_due,
            category_progress: categoryProgress,  
        };

        console.log("Submitting form data:", formData);

        try {
            const apiUrl = isEditing ? `${apiUrls.baseUrl}${formData.id}/` : apiUrls.baseUrl;
            const method = isEditing ? 'put' : 'post';
            await axios[method](apiUrl, formData, {
                headers: { Authorization: `Token ${token}` },
            });
            navigate(apiUrls.redirectUrl);
        } catch (error) {
            console.error('Error saving item:', error.response ? error.response.data : error.message);
            toast.error(error.response?.data?.detail || 'Error saving item. Please try again.');
        }
    };


    return (
        <div className="container">
            <Sidebar />
            <section className="main">
                <Topbar />
                <div className="main-skills">
                    <section className="add_client_page">
                        <div className="container">
                            <form className="form" onSubmit={handleSubmit}>
                                <div className="fields_main">
                                    <div className="table-heading">
                                        <h2>Application of Payment</h2>
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
                                            {entities.map((entity) => (
                                                <option key={entity.id} value={entity.id}>
                                                    {entity.entity_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="sec_field">
                                        <label>Project :</label>
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
                                        <label>Payment Sent Date:</label>
                                        <input
                                            type="date"
                                            name="payment_sent_date"
                                            value={formValues.payment_sent_date}
                                            onChange={handleInputChange}
                                            placeholder="Payment Sent Date"
                                        />
                                    </div>
                                    <div className="sec_field">
                                        <label>Payment Notice Back Date:</label>
                                        <input
                                            type="date"
                                            name="payment_notice_back_date"
                                            value={formValues.payment_notice_back_date}
                                            onChange={handleInputChange}
                                            placeholder="Payment Notice Back Date"
                                        />
                                    </div>
                                    <div className="sec_field">
                                        <label>Nett Payment Due:</label>
                                        <input
                                            type="text"
                                            name="nett_payment_due"
                                            value={formValues.nett_payment_due}
                                            onChange={handleInputChange}
                                            placeholder="Nett Payment Due"
                                        />
                                    </div>
                                </div>

                                <div className="table-container">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Category</th>
                                                <th>Progress</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {extraFields.map((field, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <select
                                                            name={`category_${index}`}
                                                            value={field.categories} 
                                                            onChange={(e) => {
                                                                const newFields = [...extraFields];
                                                                const selectedCategory = e.target.value; 
                                            
                                                                const newCategories = field.categories.includes(selectedCategory)
                                                                    ? field.categories.filter((category) => category !== selectedCategory) 
                                                                    : [...field.categories, selectedCategory]; 

                                                                newFields[index].categories = newCategories; 
                                                                setExtraFields(newFields); 
                                                            }}
                                                            required
                                                        >
                                                            <option value="">Select Category</option>
                                                            {categories.length > 0 ? (
                                                                categories.map((category) => (
                                                                    <option key={category.category_id} value={category.category_id}> {/* Use category.id  */}
                                                                        {category.category_name}
                                                                    </option>
                                                                ))
                                                            ) : (
                                                                <option disabled>No categories available</option>
                                                            )}
                                                        </select>


                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            name={`progress_${index}`}
                                                            value={field.progress}
                                                            onChange={(e) => {
                                                                const newFields = [...extraFields];
                                                                newFields[index].progress = e.target.value;
                                                                setExtraFields(newFields);
                                                            }}
                                                            placeholder="Progress"
                                                        />
                                                    </td>
                                                    <td>
                                                        <button className="btn_color" type="button" onClick={() => removeFields(index)}>
                                                            <RemoveIcon />
                                                        </button>
                                                        <button className="btn_color" type="button" onClick={addFields}>
                                                            <AddIcon />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="submit_btn">
                                    <button className="form_submit" type="submit">Submit</button>
                                </div>
                            </form>
                        </div>
                    </section>
                </div>
            </section>
        </div>
    );
}

export default PaymentProcessing;
