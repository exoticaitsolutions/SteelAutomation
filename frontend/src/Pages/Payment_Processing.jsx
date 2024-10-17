import "../App.css";
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

function PaymentProcessing() {
    const [formData, setFormData] = useState({
        entity: "",
        project: "",
        client: "",
        paymentCategory: "",
        paymentSentDate: "",
        paymentNoticeBackDate: "",
        status: "",
        claimingValue: "",
        contractorValue: "",
        finalValue: ""
    });

    const [extraFields, setExtraFields] = useState([]);

    useEffect(() => {
        const storedData = localStorage.getItem("paymentProcessingData");
        if (storedData) {
            setFormData(JSON.parse(storedData));
        }
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem("paymentProcessingData", JSON.stringify(formData));
        alert("Data submitted and saved to local storage");
    };

    const addFields = () => {
        setExtraFields([...extraFields, { status: "", claimingValue: "", contractorValue: "", finalValue: "", interimPayment: "", comment: "" }]);
    };

    const removeFields = (index) => {
        const newExtraFields = extraFields.filter((_, i) => i !== index);
        setExtraFields(newExtraFields);
    };

    return (
        <div className="container">
            <Sidebar />
            <section className="main">
                <div className="main-top">
                    <div className="heading">
                        <h2>Payment Processing</h2>
                    </div>
                </div>
                <div className="main-skills">
                    <section className="add_client_page">
                        <div className="container">
                            <form onSubmit={handleSubmit} className="form">
                                <div className="fields_main">
                                    <div className="sec_field">
                                        <label>Entity :</label>
                                        <select
                                            name="entity"
                                            value={formData.entity}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Client</option>
                                            <option value="CAVAM">CAVAM</option>
                                            <option value="ERN Steel">ERN Steel</option>
                                            <option value="Struct Steel">Struct Steel</option>
                                        </select>
                                    </div>
                                    <div className="sec_field">
                                        <label>Project :</label>
                                        <select
                                            name="project"
                                            value={formData.project}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Project</option>
                                            <option value="Radius Plastics">Radius Plastics</option>
                                            <option value="DUB 010">DUB 010</option>
                                        </select>
                                    </div>
                                    <div className="sec_field">
                                        <label>Client :</label>
                                        <select
                                            name="client"
                                            value={formData.client}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Client</option>
                                            <option value="D Gibson Building">D Gibson Building</option>
                                            <option value="Joinery Contractor">Joinery Contractor</option>
                                            <option value="Elliott Construction">Elliott Construction</option>
                                        </select>
                                    </div>

                                    <div className="first_field">
                                        <label>Payment Category:</label>
                                        <input
                                            type="text"
                                            name="paymentCategory"
                                            value={formData.paymentCategory}
                                            onChange={handleChange}
                                            placeholder="Payment Category"
                                        />
                                    </div>
                                    <div className="sec_field">
                                        <label>Payment Sent Date:</label>
                                        <input
                                            type="date"
                                            name="paymentSentDate"
                                            value={formData.paymentSentDate}
                                            onChange={handleChange}
                                            placeholder="Payment Sent Date"
                                        />
                                    </div>
                                    <div className="sec_field">
                                        <label>Payment Notice Back Date:</label>
                                        <input
                                            type="date"
                                            name="paymentNoticeBackDate"
                                            value={formData.paymentNoticeBackDate}
                                            onChange={handleChange}
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
                                                placeholder="Zone"
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
                                                placeholder="Account Total"
                                            />
                                        </div>
                                        <div className="sec_field">
                                            <label>% Progress:</label>
                                            <input
                                                type="text"
                                                name={`finalValue_${index}`}
                                                value={field.finalValue}
                                                onChange={(e) => {
                                                    const newFields = [...extraFields];
                                                    newFields[index].finalValue = e.target.value;
                                                    setExtraFields(newFields);
                                                }}
                                                placeholder="% Progress"
                                            />
                                        </div>
                                        <div className="sec_field">
                                            <label>Interim Payment:</label>
                                            <input
                                                type="text"
                                                name={`interimPayment_${index}`}
                                                value={field.interimPayment || ""}
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
                                            <input
                                                type="text"
                                                name={`comment_${index}`}
                                                value={field.comment || ""}
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
