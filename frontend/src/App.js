import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import '../src/css/main.css';
import '../src/css/logIn.css';

import AddClient from './Pages/Add_Client';
import AddProject from './Pages/Add_Project';
import AddContract from './Pages/Add_Contract';
import Dashboard from './Pages/Dashboard';
import PaymentProcessing from './Pages/Payment_Processing'

import Slip from './Pages/Slip';
import Slip2 from './Pages/Slip2';
import LogIn from './Pages/LogIn';
import SignUp from './Pages/SignUp';
import Entity from './Pages/Entity';
import PrivateRouter from './PrivateRoute';
import Clients from './List/Clients';
import Projects from './List/Projects';
import Contracts from './List/Contracts';
import Payments from './List/Payments';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<LogIn />} />
        
        <Route element={<PrivateRouter />}>
        <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/entity" element={<Entity/>} />
          <Route path="/dashboard/add_client" element={<AddClient />} />
          <Route path="/dashboard/add_project" element={<AddProject />} />
          <Route path="/dashboard/add_contract" element={<AddContract />} />
          <Route path="/dashboard/payment_processing" element={<PaymentProcessing />} />

          <Route path="/dashboard/clients" element={<Clients />} />
          <Route path="/dashboard/projects" element={<Projects />} />
          <Route path='/dashboard/contracts' element={<Contracts/>} />
          <Route path='/dashboard/payments' element={<Payments/>} />

          <Route path="/slip" element={<Slip />} />
          <Route path="/slip2" element={<Slip2 />} />
        </Route>
      </Routes>
    </Router>

  );
}

export default App;
