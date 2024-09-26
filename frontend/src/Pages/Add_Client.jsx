import { Link } from "react-router-dom";

function AddClient() {
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
                    <h2>Add Client</h2>
                </div>
      
              </div>
              <div class="main-skills">
                  <section className="add_client_page">
            <div className="containerr">
                

                <form className="form">
                    <div className="fields_main">
                        <div className="sec_field">
                            <label>Client Name   </label>
                            <input type="text" placeholder="Client Name"></input>
                        </div>

                        <div className="sec_field">
                            <label>Email </label>
                            <input type="text" placeholder="Email"></input>
                        </div>

                        <div className="sec_field">
                            <label>Address </label>
                            <textarea name="description" rows="4" cols="50" placeholder="Address"></textarea>

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
export default AddClient;