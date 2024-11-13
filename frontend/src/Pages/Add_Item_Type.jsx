import React from 'react';
import Sidebar from "../components/Sidebar";
import { ToastContainer } from "react-toastify";
import { useLocation, useNavigate } from 'react-router-dom';
import useFormHandler from '../hooks/useFormHandler';
import Topbar from '../components/Topbar';

function AddItemType() {
    const token = localStorage.getItem("userToken");
    const location = useLocation();
    const navigate = useNavigate();

    const initialValues = {
        name: '',
    };

    const apiUrls = {
        baseUrl: `${process.env.REACT_APP_API_BASE_URL}/api/item-types/`,
        redirectUrl: '/dashboard/item_types',
    };

    const { formValues, isEditing, handleInputChange, handleSubmit } = useFormHandler(
        initialValues,
        apiUrls,
        token,
        navigate,
        location
    );

    // console.log("Selected Project ID:", formValues.project);
    // console.log("Current form values:", formValues);

    return (
        <div className="container">
            <Sidebar />
            <section className="main">
                <Topbar/>
                <div className="main-skills">
                    <section className="add_contract_page">
                        <div className="container">
                            <form className="form" onSubmit={handleSubmit}>
                                <div className="fields_main">
                                <div className="table-heading">
                                <h2>{isEditing ? 'Edit Item_Type' : 'Add Item_Type'}</h2>
                                    </div>
                                    <div className="sec_field">
                                        <label>Item_Type name:</label>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Item Type"
                                            value={formValues.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="submit_btn">
                                    <button className="form_submit" type="submit">
                                        {isEditing ? 'Update' : 'Save'}
                                    </button>
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

export default AddItemType;
