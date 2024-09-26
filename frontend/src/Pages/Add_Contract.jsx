import { Link } from "react-router-dom";
function AddContract() {
    return (
      
          <div class="container">
          <nav>
              <ul>
                <li><Link href="#" class="logo">
                  <img src="six.png" alt="admin"/>
                  <span class="nav-item">Admin</span>
                </Link></li>
                <li><Link to="/">
                  <i class="fas fa-home"></i>
                  <span class="nav-item">Home</span>
                </Link></li>
                <li><Link to="/add_client">
                  <i class="fas fa-user"></i>
                  <span class="nav-item">Add Client</span>
                </Link></li>
                <li><Link to="/add_project">
                  <i class="fas fa-wallet"></i>
                  <span class="nav-item">Add Project</span>
                  </Link></li>
                <li><Link to ="/add_contract">
                  <i class="fas fa-chart-bar"></i>
                  <span class="nav-item">Add Contract</span>
                </Link></li>
                
                <li><Link to="">
                  <i class="fas fa-cog"></i>
                  <span class="nav-item">Settings</span>
                </Link></li>
                <li><Link to="/signup">
                  <i class="fas fa-question-circle"></i>
                  <span class="nav-item">SignUp</span>
                </Link></li>
                <li><Link to="/" class="logout">
                  <i class="fas fa-sign-out-alt"></i>
                  <span class="nav-item">Log out</span>
                </Link></li>
              </ul>
            </nav>
        
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