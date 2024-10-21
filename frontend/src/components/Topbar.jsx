import { useState, useEffect } from "react";
import { toggleSidebar } from "../js/main";
function Topbar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleToggle = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        toggleSidebar(isSidebarOpen);
    }, [isSidebarOpen]);

    
    return (
        <section className="Topbar flex">
            <div className="Toggle-main">
            <button className="toggle-btn" onClick={handleToggle}>
                {isSidebarOpen ? (
                    <i className="fas fa-times"></i> 
                ) : (
                    <i className="fas fa-bars"></i> 
                )}
            </button>
            </div>
            <div className="dashboard-main-top">
                <h1>Wecome to the Steel Automation</h1>
            </div>
        </section>
    )
}
export default Topbar;