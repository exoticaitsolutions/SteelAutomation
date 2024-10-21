import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Topbar from '../components/Topbar';

function Payments() {
    const [payments, setPayments] = useState([]);
    const token = localStorage.getItem('userToken');
    const userRole = localStorage.getItem('userRole');

    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/payment/`, {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                });
                setPayments(response.data);
            } catch (error) {
                console.error('Error fetching payment data:', error);
            }
        };

        fetchPayments();
    }, [token]);

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/payment/${id}/`, {
                        headers: {
                            Authorization: `Token ${token}`
                        }
                    });

                    setPayments(payments.filter(payment => payment.id !== id));

                    Swal.fire('Deleted!', 'The payment has been deleted.', 'success');
                } catch (error) {
                    console.error('Error deleting payment:', error);
                    Swal.fire('Error!', 'There was a problem deleting the payment.', 'error');
                }
            }
        });
    };
        
    const handlePdf = async (id) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/generate_invoice_pdf/${id}/`, {
                headers: {
                    Authorization: `Token ${token}`
                }
            });
    
            const pdfUrl = response.data.pdf_url;
            window.open(pdfUrl, '_blank');
        } catch (error) {
            console.error('Error generating PDF:', error);
            Swal.fire('Error!', 'There was a problem generating the PDF.', 'error');
        }
    };
    

    const handleEdit = (payment) => {
        navigate(`/dashboard/payment_processing`, { state: { item: payment } });
    };

    return (
        <div className="container">
            <Sidebar />
            <section className="main">
                <Topbar />
                <div className="list-main">
                    {userRole === 'ADMIN' && (
                        <div className="add_btn">
                            <Link to="/dashboard/payment_processing"><button>Add Payment</button></Link>
                        </div>
                    )}
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Entity</th>
                                <th>Project</th>
                                <th>Client</th>
                                <th>Category</th>
                                <th>Sent date</th>
                                <th>Back date</th>
                                {userRole === "ADMIN" &&
                                 <th>Action</th> }
                                 <th>Slip</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.length > 0 ? (
                                payments.map((payment) => (
                                    <tr key={payment.id}>
                                        <td>{payment.entity}</td> 
                                        <td>{payment.project}</td> 
                                        <td>{payment.client}</td>
                                        <td>{payment.payment_category}</td>
                                        <td>{payment.payment_sent_date}</td>
                                        <td>{payment.payment_notice_back_date}</td>
                                        {userRole === 'ADMIN' && (
                                            <td>
                                                <div className="action_btn">
                                                    <button onClick={() => handleEdit(payment)}><i className="fas fa-edit" /></button>
                                                    <button onClick={() => handleDelete(payment.id)}><i className="fas fa-calendar" /></button>
                                                </div>
                                            </td>
                                        )}
                                        <td>
                                        
                                             <button onClick={() => handlePdf(payment.id)}><i className="fas fa-paperclip" /></button>
                                            
                                             </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7">No payments found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

export default Payments;
