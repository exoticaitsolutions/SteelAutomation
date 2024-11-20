import "../App.css";
import React from "react";
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
        payment_notice_back_date: "",
        progress: "",
        nett_payment_due: "",
    };


    const apiUrls = {
        baseUrl: `${process.env.REACT_APP_API_BASE_URL}/api/payment/`,
        entityUrl: `${process.env.REACT_APP_API_BASE_URL}/api/entities/`,
        clientsUrl: `${process.env.REACT_APP_API_BASE_URL}/api/clients/`,
        projectsUrl: `${process.env.REACT_APP_API_BASE_URL}/api/projects/`,

        redirectUrl: '/dashboard/payments',
    };


    const { formValues, entities, projects, clients,  handleInputChange, handleSubmit } = useFormHandler(initialValues, apiUrls, token, navigate, location);


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
                                            name="payment_notice_back_date"
                                            value={formValues.payment_notice_back_date}
                                            onChange={handleInputChange}
                                            placeholder="Payment Notice Back Date"
                                        />
                                    </div>
                                    <div className="sec_field">
                                        <label>Progress:</label>
                                        <input
                                            type="text"
                                            name="progress"
                                            value={formValues.progress}
                                            onChange={handleInputChange}
                                            placeholder="Progress"
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
