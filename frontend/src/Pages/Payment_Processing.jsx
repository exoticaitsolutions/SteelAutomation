import "../App.css"
import React, { useState, useEffect } from "react";

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


    return (
        <>
            <section className="Payment_Processing">
                <div className="container">
                    {/* <div className="heading">
                        <h2>Payment Processing</h2>
                    </div> */}

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
                                    placeholder="PaymentCategory"
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

                            <div className="sec_field">
                                <label>Status:</label>
                                <input
                                    type="text"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    placeholder="Status"
                                />
                            </div>

                            <div className="sec_field">
                                <label>Claiming Value:</label>
                                <input
                                    type="text"
                                    name="claimingValue"
                                    value={formData.claimingValue}
                                    onChange={handleChange}
                                    placeholder="ClaimingValue"
                                />
                            </div>

                            <div className="sec_field">
                                <label>Contractor Value:</label>
                                <input
                                    type="text"
                                    name="contractorValue"
                                    value={formData.contractorValue}
                                    onChange={handleChange}
                                    placeholder="ContractorValue"
                                />
                            </div>

                            <div className="sec_field">
                                <label>Final Value:</label>
                                <input
                                    type="text"
                                    name="finalValue"
                                    value={formData.finalValue}
                                    onChange={handleChange}
                                    placeholder="FinalValue"
                                />
                            </div>



                        </div>
                        <div className="submit_btn">
                            <input className="form_submit" type="submit" value="Send" />

                            <input className="form_submit" type="submit" value="Prepare File" />
                        </div>

                    </form>
                </div>
            </section>

        </>
    );
};
export default PaymentProcessing;