import { Link } from "react-router-dom";
function AddProject() {

    const Submit_Project =()=>{
        alert("Your Project Submitted Succesfully");
    }

    return (
       
          <div class="container">
            <nav>
              <ul>
                <li><a href="#" class="logo">
                  <img src="six.png" alt="admin"/>
                  <span class="nav-item">Admin</span>
                </a></li>
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
                
                <li><a href="">
                  <i class="fas fa-cog"></i>
                  <span class="nav-item">Settings</span>
                </a></li>
                <li><a href="">
                  <i class="fas fa-question-circle"></i>
                  <span class="nav-item">Help</span>
                </a></li>
                <li><a href="" class="logout">
                  <i class="fas fa-sign-out-alt"></i>
                  <span class="nav-item">Log out</span>
                </a></li>
              </ul>
            </nav>
        
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