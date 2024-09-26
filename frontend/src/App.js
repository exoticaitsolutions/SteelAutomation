
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '../src/css/main.css';
import '../src/css/logIn.css';


import AddClient from './Pages/Add_Client';
import AddProject from './Pages/Add_Project';
import AddContract from './Pages/Add_Contract';
import Dashboard from './Pages/Dashboard';
import Slip from './Pages/Slip';
import Slip2 from './Pages/Slip2';
import LogIn from './Pages/LogIn';
import SignUp from './Pages/SignUp';
import PrivateRouter from './PrivateRoute';

function App() {
 
  return (
    <Router>
      <Routes>
      <Route path="/" element={<LogIn />} />
      

      <Route element={<PrivateRouter />}> 
      <Route path="/signup" element={<SignUp/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add_client" element={<AddClient />} />
        <Route path="/add_project" element={<AddProject />} />
        <Route path="/add_contract" element={<AddContract />} />

        <Route path="/slip" element={<Slip />} />
        <Route path="/slip2" element={<Slip2 />} />

       </Route> 
      </Routes>
    </Router>

  );
}

export default App;
