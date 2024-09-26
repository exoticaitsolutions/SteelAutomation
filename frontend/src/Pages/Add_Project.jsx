import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
function AddProject() {

    const Submit_Project = () => {
        alert("Your Project Submitted Succesfully");
    }

    return (

        <div class="container">
            <Sidebar />

            <section class="main">
                <div class="main-top">
                    <div className="heading">
                        <h2>Add Project</h2>
                    </div>

                </div>
                <div class="main-skills">
                    <section className="add_client_page">
                        <div className="container">


                            <form onSubmit={Submit_Project} className="form">
                                <div className="fields_main">
                                    <div className="sec_field">
                                        <label>Project Name :   </label>
                                        <input type="text" placeholder="Project Name"></input>
                                    </div>

                                    <div className="sec_field">
                                        <label>Description :</label>
                                        <input type="text" placeholder="Description"></input>
                                    </div>

                                    <div className="sec_field">
                                        <label>Client :</label>
                                        <select placeholder="">
                                            <option value="">Select Client </option>
                                            <option value="D Gibson Building ">D Gibson Building </option>
                                            <option value="Joinery Contractor">Joinery Contractor</option>
                                            <option value="Elliott Construction">Elliott Construction</option>
                                            <option value="D Gibson Building ">D Gibson Building </option>
                                        </select>
                                    </div>

                                </div>

                                <div className="submit_btn">
                                    <input className="form_submit" type="submit" value="Save" />
                                </div>
                            </form>
                        </div >
                    </section >
                </div>
                    
            </section>
        </div>

    );
}
export default AddProject;