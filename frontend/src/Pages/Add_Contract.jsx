import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
function AddContract() {
    return (
      
          <div class="container">
            <Sidebar/>
        
            <section class="main">
              <div class="main-top">
              <div className="heading">
                    <h2>Add Contract</h2>
                </div>
      
              </div>
              <div class="main-skills">
                   <section className="add_client_page">
            <div className="container">
                

                <form className="form">
                    <div className="fields_main_contract">
                        <div className="sec_field">
                            <label>Contract Details : </label>
                            <input type="text" placeholder="Contract Details"></input>
                        </div>

                        <div className="sec_field">
                            <label>Project :</label>
                            <select placeholder="">
                                <option value="">Select Project </option>
                                <option value="Radius Plastics ">Radius Plastics </option>
                                <option value="DUB 010">DUB 010</option>
                                <option value="Radius Plastics ">Radius Plastics </option>
                                <option value="DUB 010">DUB 010</option>
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
export default AddContract;