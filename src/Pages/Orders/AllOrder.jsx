import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AllOrder = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/checkouts');
                // Adjust the URL as needed
                console.log(response)
                setOrders(response.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch orders');
                setLoading(false);
                console.log(error)
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>All Orders</h4>
                </div>
                <div className="links">
                    {/* Additional links or actions can be placed here */}
                </div>
            </div>

            <div className="filteration">
                <div className="selects">
                    <select>
                        <option value="">All Orders</option>
                        <option value="today">Today's Orders</option>
                        <option value="yesterday">Yesterday's Orders</option>
                        <option value="thisWeek">This Week's Orders</option>
                        <option value="thisMonth">This Month's Orders</option>
                        <option value="thisYear">This Year's Orders</option>
                    </select>
                </div>
                <div className="search">
                    <label htmlFor="search">Search </label>&nbsp;
                    <input
                        type="text"
                        name="search"
                        id="search"
                    />
                </div>
            </div>

            <section className="d-table">
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Sr.No.</th>
                            <th scope="col">Order ID</th>
                            <th scope="col">Final Price</th>
                            <th scope="col">Order Status</th>
                            <th scope="col">Payment Mode</th>
                            <th scope="col">Payment Status</th>
                            <th scope="col">Order Date</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            orders.map((item,index) => 
                                <tr key={index}>
                                    <th scope="row">{index+1}</th>
                                    <td><Link to={`/edit-order/${item._id}`}>{item._id}</Link></td>
                                    <td>&#8377;{item.totalPrice}</td>
                                    <td>{item.orderStatus}</td>
                                    <td>{item.paymentMode}</td>
                                    <td>{item.paymentStatus}</td>
                                    <td>{new Date(item.orderDate).toLocaleString()}</td>
                                    <td>
                                        <Link className="bt delete">
                                            Delete <i className="fa-solid fa-trash"></i>
                                        </Link>
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </section>
        </>
    );
};

export default AllOrder;
