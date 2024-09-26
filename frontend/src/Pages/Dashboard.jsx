import PaymentProcessing from "./Payment_Processing";
import { Link } from "react-router-dom";

function Dashboard() {
    return (
 
      
        <body>
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
                <h1>Payment Processing</h1>
      
              </div>
              <div class="main-skills">
                <PaymentProcessing/>
              </div>
        
            </section>
          </div>
        </body>
       
       
      
      
    )
}
export default Dashboard;