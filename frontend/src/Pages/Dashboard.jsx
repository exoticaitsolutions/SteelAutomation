import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

function Dashboard() {
  return (
    <div className="container">
        <Sidebar />
        <div className="main">
      <Topbar />
      </div>
      </div>
  
  )
}
export default Dashboard;