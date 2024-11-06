import "../App.css";
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useLocation, useNavigate } from 'react-router-dom';
import useFormHandler from '../hooks/useFormHandler';
import Topbar from "../components/Topbar";
import axios from "axios";

import DownloadIcon from '@mui/icons-material/Download';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

function PaymentProcessing() {
    const token = localStorage.getItem("userToken");
    const location = useLocation();
    const navigate = useNavigate();


    const initialValues = {
        entity: "",
        project: "",
        client: "",
        payment_category: "",
        payment_sent_date: "",
        paymentNoticeBackDate: "",
    };


    const apiUrls = {
        baseUrl: `${process.env.REACT_APP_API_BASE_URL}/api/payment/`,
        entityUrl: `${process.env.REACT_APP_API_BASE_URL}/api/entities/`,
        clientsUrl: `${process.env.REACT_APP_API_BASE_URL}/api/clients/`,
        projectsUrl: `${process.env.REACT_APP_API_BASE_URL}/api/projects/`,
        zonesUrl: `${process.env.REACT_APP_API_BASE_URL}/api/item-zones/`,
        typesUrl: `${process.env.REACT_APP_API_BASE_URL}/api/item-types/`,
        categoriesUrl: `${process.env.REACT_APP_API_BASE_URL}/api/item-categories/`,
        unitsUrl: `${process.env.REACT_APP_API_BASE_URL}/api/item-units/`,
        excelsheetUrl: `${process.env.REACT_APP_API_BASE_URL}/api/excel-data/`,
        redirectUrl: '/dashboard/payment_processing',
    };

    const [extraFields, setExtraFields] = useState([{
        ref: '',
        acw: '',
        pcs: '',
        qty: '',
        unit: '',
        rate: '',
        total: '',
        item: '',
        category: '',
        type: '',
        zone: '',
    }]);
    const { formValues, entities, projects, clients, zones, types, categories, units, handleInputChange, handleSubmitBoth } = useFormHandler(initialValues, apiUrls, token, navigate, location);

    const handleFileChange = (event) => {
        console.log("File change click success");
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        console.log("Sending file to server...");
        axios.post(apiUrls.excelsheetUrl, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                console.log("Upload Success:", response.data);
                const data = response.data.data;

                if (Array.isArray(data)) {

                    setExtraFields(data.map((item, index) => ({
                        ref: (index + 1).toString(),
                        acw: item.ACW || '',
                        pcs: item.Pcs || '',
                        qty: item.QTY || '',
                        item: item.Item || '',
                        rate: item["Rate "] || '',
                        total: item["Total "] || '',
                        unit: item.Unit || '',
                        category: item.Cat || '',
                        type: item.Type || '',
                        zone: item.Zone || '',
                    })));
                } else {
                    console.error("Expected 'data' to be an array, but got:", data);
                }
            })
            .catch(error => {
                console.error("Upload Error:", error);
            });
    };


    const addFields = () => {
        setExtraFields([...extraFields, { ref: '', acw: '', pcs: '', qty: '', unit: '', rate: '', total: '', item: '', category: '', type: '', zone: '' }]);
    };


    const removeFields = (index) => {
        const newFields = extraFields.filter((_, i) => i !== index);
        setExtraFields(newFields);
    };

    return (
        <div className="container">
            <Sidebar />
            <section className="main">
                <Topbar />
                <div className="main-skills">
                    <section className="add_client_page">
                        <div className="container">
                            <form onSubmit={(e) => handleSubmitBoth(e, extraFields)} className="form">
                                <div className="fields_main">
                                    <div className="table-heading">
                                        <h2>Payment Processing</h2>

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

                                    <div className="first_field">
                                        <label>Payment Category:</label>
                                        <input
                                            type="text"
                                            name="payment_category"
                                            value={formValues.payment_category}
                                            onChange={handleInputChange}
                                            placeholder="Payment Category"
                                        />
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
                                            name="paymentNoticeBackDate"
                                            value={formValues.paymentNoticeBackDate}
                                            onChange={handleInputChange}
                                            placeholder="Payment Notice Back Date"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="table-container">
                                    <div className="addmore_btn">
                                        <button className="btn"  onClick={() => document.getElementById("fileInput").click()}>Import File <DownloadIcon/></button>
                                       </div>
                                        <input
                                            type="file"
                                            id="fileInput"
                                            style={{ display: "none" }}
                                            onChange={handleFileChange}
                                        />
                                        <table >
                                            <thead>
                                                <tr>
                                                    <th>Ref</th>
                                                    <th>Item</th>
                                                    <th>Category</th>
                                                    <th>Type</th>
                                                    <th>Zone</th>
                                                    <th>Acw</th>
                                                    <th>Pcs</th>
                                                    <th>Quantity</th>
                                                    <th>Unit</th>
                                                    <th>Rate</th>
                                                    <th>Total</th>

                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {extraFields.map((field, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                value={field.ref}
                                                                name={`ref_${index}`}
                                                                onChange={(e) => {
                                                                    const newFields = [...extraFields];
                                                                    newFields[index].ref = e.target.value;
                                                                    setExtraFields(newFields);
                                                                }}
                                                                placeholder="Ref"
                                                            />
                                                        </td>

                                                        <td>
                                                            <input
                                                                type="text"
                                                                name={`item_${index}`}
                                                                value={field.item}
                                                                onChange={(e) => {
                                                                    const newFields = [...extraFields];
                                                                    newFields[index].item = e.target.value;
                                                                    setExtraFields(newFields);
                                                                }}
                                                                placeholder="item"
                                                            />
                                                        </td>


                                                        <td>
                                                            <select
                                                                name={`category_${index}`}
                                                                value={field.category}
                                                                onChange={(e) => {
                                                                    const newFields = [...extraFields];
                                                                    newFields[index].category = e.target.value;
                                                                    setExtraFields(newFields);
                                                                }}
                                                                required
                                                            >
                                                                <option value="">Select Category</option>
                                                                {categories.length > 0 ? (
                                                                    categories.map((category) => (
                                                                        <option key={category.id} value={category.id}>
                                                                            {category.name}
                                                                        </option>
                                                                    ))
                                                                ) : (
                                                                    <option disabled>No category available</option>
                                                                )}
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <select
                                                                name={`type_${index}`}
                                                                value={field.type}
                                                                onChange={(e) => {
                                                                    const newFields = [...extraFields];
                                                                    newFields[index].type = e.target.value;
                                                                    setExtraFields(newFields);
                                                                }}
                                                                required
                                                            >
                                                                <option value="">Select Type</option>
                                                                {types.length > 0 ? (
                                                                    types.map((type) => (
                                                                        <option key={type.id} value={type.id}>
                                                                            {type.name}
                                                                        </option>
                                                                    ))
                                                                ) : (
                                                                    <option disabled>No types available</option>
                                                                )}
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <select
                                                                name={`zone_${index}`}
                                                                value={field.zone}
                                                                onChange={(e) => {
                                                                    const newFields = [...extraFields];
                                                                    newFields[index].zone = e.target.value;
                                                                    setExtraFields(newFields);
                                                                }}
                                                                required
                                                            >
                                                                <option value="">Select Zone</option>
                                                                {zones.length > 0 ? (
                                                                    zones.map((zone) => (
                                                                        <option key={zone.id} value={zone.id}>
                                                                            {zone.name}
                                                                        </option>
                                                                    ))
                                                                ) : (
                                                                    <option disabled>No zones available</option>
                                                                )}
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                value={field.acw}
                                                                name={`acw_${index}`}
                                                                onChange={(e) => {
                                                                    const newFields = [...extraFields];
                                                                    newFields[index].acw = e.target.value;
                                                                    setExtraFields(newFields);
                                                                }}
                                                                placeholder="ACW"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                value={field.pcs}
                                                                name={`pcs_${index}`}
                                                                onChange={(e) => {
                                                                    const newFields = [...extraFields];
                                                                    newFields[index].pcs = e.target.value;
                                                                    setExtraFields(newFields);
                                                                }}
                                                                placeholder="PCS"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                name={`qty_${index}`}
                                                                value={field.qty}
                                                                onChange={(e) => {
                                                                    const newFields = [...extraFields];
                                                                    newFields[index].qty = e.target.value;
                                                                    setExtraFields(newFields);
                                                                }}
                                                                placeholder="Quantity"
                                                            />
                                                        </td>


                                                        <td>
                                                            <select
                                                                name={`unit_${index}`}
                                                                value={field.unit}
                                                                onChange={(e) => {
                                                                    const newFields = [...extraFields];
                                                                    newFields[index].unit = e.target.value;
                                                                    setExtraFields(newFields);
                                                                }}
                                                                required
                                                            >
                                                                <option value="">Select Item</option>
                                                                {units.length > 0 ? (
                                                                    units.map((unit) => (
                                                                        <option key={unit.id} value={unit.id}>
                                                                            {unit.name}
                                                                        </option>
                                                                    ))
                                                                ) : (
                                                                    <option disabled>No units available</option>
                                                                )}
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                name={`rate_${index}`}
                                                                value={field.rate}
                                                                onChange={(e) => {
                                                                    const newFields = [...extraFields];
                                                                    newFields[index].rate = e.target.value;
                                                                    setExtraFields(newFields);
                                                                }}
                                                                placeholder="Rate"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                name={`total_${index}`}
                                                                value={field.total}
                                                                onChange={(e) => {
                                                                    const newFields = [...extraFields];
                                                                    newFields[index].total = e.target.value;
                                                                    setExtraFields(newFields);
                                                                }}
                                                                placeholder="Total"
                                                            />
                                                        </td>

                                                        <td>
                                                            <button type="button" onClick={() => removeFields(index)}><RemoveIcon /></button>
                                                            <button type="button"  onClick={addFields}><AddIcon/></button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    
                                </div>
                                <div className="submit_btn">
                                    <input className="form_submit" type="submit" value="Send" />
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
