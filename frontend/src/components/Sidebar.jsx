import { Link, useNavigate } from "react-router-dom";
function Sidebar() {

    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('userToken');
        navigate('/');
    };
return (
        <div className="sidebarmain">
            <nav>
                <ul>
                    <li><Link to="#" className="logo">
                        <img src="six.png" alt="admin" />
                        <span className="nav-item">Admin</span>
                    </Link></li>

                    <li><Link to="/dashboard">
                        <i className="fas fa-home"></i>
                        <span className="nav-item">Home</span>
                    </Link></li>
                    {/* <li><Link to="/dashboard/entity">
                    <i className="fas fa-address-card"></i>
                        <span className="nav-item">Entity</span>
                    </Link></li> */}
                    <li><Link to="/dashboard/payment_processing">
                    <i className="fas fa-compass"></i>
                        <span className="nav-item">Processing_Payment</span>
                    </Link></li>
                    <li><Link to="/dashboard/clients">
                        <i className="fas fa-user"></i>
                        <span className="nav-item">Clients</span>
                    </Link></li>
                    <li><Link to="/dashboard/projects">
                        <i className="fas fa-wallet"></i>
                        <span className="nav-item">Projects</span>
                    </Link></li>
                    <li><Link to="/dashboard/contracts">
                        <i className="fas fa-chart-bar"></i>
                        <span className="nav-item">Contracts</span>
                    </Link></li>

                    <li><Link to="">
                        <i className="fas fa-cog"></i>
                        <span className="nav-item">Settings</span>
                    </Link></li>

                    <li><Link to="">
                        <i className="fas fa-question-circle"></i>
                        <span className="nav-item">Help</span>
                    </Link></li>

                    <li><Link to="" className="logout" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i>
                        <span className="nav-item">Log out</span>
                    </Link></li>
                </ul>
            </nav>
        </div>
    );
}
export default Sidebar;