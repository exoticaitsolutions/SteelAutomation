import "../App.css";
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useLocation, useNavigate } from 'react-router-dom';
import useFormHandler from '../hooks/useFormHandler';
import Topbar from "../components/Topbar";

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
        redirectUrl: '/dashboard/payment_processing',
    };


    const [extraFields, setExtraFields] = useState([{
        status: '',
        claimingValue: '',
        contractorValue: '',
        finalValue: '',
        interimPayment: '',
        comment: ''
    }]);


    const addFields = () => {
        setExtraFields([...extraFields, { status: "", claimingValue: "", contractorValue: "", finalValue: "", interimPayment: "", comment: "" }]);
    };


    const removeFields = (index) => {
        const newFields = extraFields.filter((_, i) => i !== index);
        setExtraFields(newFields);
    };

    const { formValues, entities, projects, clients, handleInputChange, handleSubmitBoth } = useFormHandler(initialValues, apiUrls, token, navigate, location);

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

                                {extraFields.map((field, index) => (
                                    <div className="fields_main" key={index}>
                                        <div className="add-heading">
                                            <h3>Payment Details</h3>
                                            <button type="button" className="btn" onClick={() => removeFields(index)}>Remove</button>
                                        </div>
                                        <div className="sec_field">
                                            <label>Category:</label>
                                            <input
                                                type="text"
                                                name={`status_${index}`}
                                                value={field.status}
                                                onChange={(e) => {
                                                    const newFields = [...extraFields];
                                                    newFields[index].status = e.target.value;
                                                    setExtraFields(newFields);
                                                }}
                                                placeholder="Status"
                                            />
                                        </div>
                                        <div className="sec_field">
                                            <label>Zone:</label>
                                            <input
                                                type="text"
                                                name={`claimingValue_${index}`}
                                                value={field.claimingValue}
                                                onChange={(e) => {
                                                    const newFields = [...extraFields];
                                                    newFields[index].claimingValue = e.target.value;
                                                    setExtraFields(newFields);
                                                }}
                                                placeholder="Claiming Value"
                                            />
                                        </div>
                                        <div className="sec_field">
                                            <label>Account Total:</label>
                                            <input
                                                type="text"
                                                name={`contractorValue_${index}`}
                                                value={field.contractorValue}
                                                onChange={(e) => {
                                                    const newFields = [...extraFields];
                                                    newFields[index].contractorValue = e.target.value;
                                                    setExtraFields(newFields);
                                                }}
                                                placeholder="Contractor Value"
                                            />
                                        </div>
                                        <div className="sec_field">
                                            <label>Progress:</label>
                                            <input
                                                type="text"
                                                name={`finalValue_${index}`}
                                                value={field.finalValue}
                                                onChange={(e) => {
                                                    const newFields = [...extraFields];
                                                    newFields[index].finalValue = e.target.value;
                                                    setExtraFields(newFields);
                                                }}
                                                placeholder="Final Value"
                                            />
                                        </div>
                                        <div className="sec_field">
                                            <label>Interim:</label>
                                            <input
                                                type="text"
                                                name={`interimPayment_${index}`}
                                                value={field.interimPayment}
                                                onChange={(e) => {
                                                    const newFields = [...extraFields];
                                                    newFields[index].interimPayment = e.target.value;
                                                    setExtraFields(newFields);
                                                }}
                                                placeholder="Interim Payment"
                                            />
                                        </div>
                                        <div className="sec_field">
                                            <label>Comment:</label>
                                            <textarea
                                                name={`comment_${index}`}
                                                value={field.comment}
                                                onChange={(e) => {
                                                    const newFields = [...extraFields];
                                                    newFields[index].comment = e.target.value;
                                                    setExtraFields(newFields);
                                                }}
                                                placeholder="Comment"
                                            />
                                        </div>
                                    </div>
                                ))}

                                <div className="addmore_btn">
                                    <button type="button" className="btn" onClick={addFields}>Add Fields</button>
                                </div>
                                <div className="submit_btn">
                                    <input className="form_submit" type="submit" value="Send" />
                                    <input className="form_submit" type="button" value="Prepare File" />
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
