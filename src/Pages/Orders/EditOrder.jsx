import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditOrder = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [orderStatus, setOrderStatus] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`https://zens-bankend.onrender.com/api/checkout/${id}`);
                setOrder(response.data);
                setOrderStatus(response.data.orderStatus);
                setPaymentStatus(response.data.paymentStatus);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch order details');
                setLoading(false);
                console.error(error);
            }
        };

        fetchOrder();
    }, [id]);

    const handleUpdate = async () => {
        try {
            await axios.put(`https://zens-bankend.onrender.com/api/checkout/${id}`, {
                orderStatus,
                paymentStatus
            });
            toast.success('Order updated successfully');
        } catch (error) {
            toast.error('Failed to update order');
            console.error(error);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Update Order</h4>
                </div>
                <div className="links">
                    <Link to="/all-orders" className="add-new">
                        Back <i className="fa-regular fa-circle-left"></i>
                    </Link>
                </div>
            </div>

            <div className="container mt-4">
                <div className="row">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title">Order Details</h5>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <th scope="row">Order ID</th>
                                            <td>{order._id}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">User Name</th>
                                            <td>{order.name}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Email</th>
                                            <td>{order.email}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Phone Number</th>
                                            <td>{order.phone}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Address</th>
                                            <td>{order.address}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Order Date</th>
                                            <td>{new Date(order.orderDate).toLocaleString()}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Final Price</th>
                                            <td>&#8377;{order.totalPrice}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Order Status</th>
                                            <td>
                                                <select
                                                    value={orderStatus}
                                                    onChange={(e) => setOrderStatus(e.target.value)}
                                                >
                                                    <option value="Order Is Placed">Order Is Placed</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Payment Mode</th>
                                            <td>{order.paymentMode}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Payment Status</th>
                                            <td>
                                                <select
                                                    value={paymentStatus}
                                                    onChange={(e) => setPaymentStatus(e.target.value)}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="failed">Failed</option>
                                                </select>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <button
                                    onClick={handleUpdate}
                                    className="btn btn-primary"
                                >
                                    Update Order
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title">Items</h5>
                            </div>
                            <div className="card-body">
                                {order.cartItems.map((item, index) => (
                                    <div key={index} className="mb-3">
                                        <img
                                            src={item.productimage}
                                            alt={item.productname}
                                            className="img-fluid"
                                            style={{ width: '100%', height: '200px' }}
                                        /> <br />
                                        <strong>{item.productname}</strong>
                                        <p className="mb-1">Item: {item.productitem}</p>
                                        <p className="mb-1">Quantity: {item.productquantity}</p>
                                        <p className="mb-0">Price: &#8377;{item.productprice * item.productquantity}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col">
                        <Link to="/all-orders" className="btn btn-secondary">Back</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditOrder;
