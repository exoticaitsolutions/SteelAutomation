import { Link, useNavigate } from "react-router-dom";
function Sidebar() {

    const navigate = useNavigate();
    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('userToken');
        navigate('/');
    };
    const Role = localStorage.getItem("userRole");
return (
    <div className="sidebar">
        <div className="sidebarmain">
            <nav>
                <ul>
                    <li><Link to="#" className="logo">
                        <img src="/profile.jpg" alt="admin" />
                        <span className="nav-item">{Role}</span>
                    </Link></li>
                    <hr className="line"/>
                    <li><Link to="/dashboard">
                        <i className="fas fa-home"></i>
                        <span className="nav-item">Home</span>
                    </Link></li>
                    <li><Link to="/dashboard/payments">
                    <i className="fas fa-compass"></i>
                        <span className="nav-item">Payments</span>
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
                    <li><Link to="/dashboard/item_categories">
                        <i className="fas fa-object-ungroup"></i>
                        <span className="nav-item">Categories</span>
                    </Link></li>
                    <li><Link to="/dashboard/item_types">
                        <i className="fas fa-podcast"></i>
                        <span className="nav-item">Types</span>
                    </Link></li>
                    <li><Link to="/dashboard/item_zones">
                        <i className="fas fa-bolt"></i>  
                        <span className="nav-item">Zones</span>
                    </Link></li>
                    <li><Link to="/dashboard/item_units">
                        <i className="fas fa-database"></i>  
                        <span className="nav-item">Units</span>
                    </Link></li>

                    {/* <li><Link to="">
                        <i className="fas fa-cog"></i>
                        <span className="nav-item">Settings</span>
                    </Link></li>  */}

                    {/* <li><Link to="">
                        <i className="fas fa-question-circle"></i>
                        <span className="nav-item">Help</span>
                    </Link></li> */}
                    <li><Link to=""  onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i>
                        <span className="nav-item">Log out</span>
                    </Link></li>
                </ul>
            </nav>
        </div>
        </div>

    );
}
export default Sidebar;