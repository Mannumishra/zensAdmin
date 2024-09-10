import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AllBanner = () => {
    const [banners, setBanners] = useState([]);
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await axios.get('https://zens-bankend.onrender.com/api/banner');
                if (res.status === 200) {
                    setBanners(res.data.data);
                }
            } catch (error) {
                console.error('Error fetching banners:', error);
                toast.error('Failed to fetch banners');
            }
        };
        fetchBanners(); 
    }, []); 

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this banner?')) {
            axios.delete(`https://zens-bankend.onrender.com/api/banner/${id}`)
                .then(() => {
                    setBanners(banners.filter(banner => banner._id !== id)); // Remove banner from UI
                    toast.success('Banner deleted successfully');
                })
                .catch(error => {
                    toast.error('Error deleting banner');
                    console.error('Delete error:', error);
                });
        }
    };

    // Function to toggle banner active status
    const toggleActive = async (id, currentStatus) => {
        try {
            await axios.patch(`https://zens-bankend.onrender.com/api/banner/${id}`, { active: !currentStatus });
            setBanners(banners.map(banner =>
                banner._id === id ? { ...banner, active: !currentStatus } : banner
            ));
            toast.success('Banner status updated');
        } catch (error) {
            toast.error('Error updating status: ' + (error.response?.data?.message || error.message));
            console.error('Status update error:', error);
        }
    };
    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>All Banners</h4>
                </div>
                <div className="links">
                    <Link to="/add-banner" className="add-new">Add New <i className="fa-solid fa-plus"></i></Link>
                </div>
            </div>

            <section className="d-table">
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Sr. No.</th>
                            <th>Image</th>
                            <th>Show in Home Page</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {banners.map((banner, index) => (
                            <tr key={banner._id}>
                                <td>{index + 1}</td>
                                <td>
                                    <img src={banner.image} alt="Banner" width="100" height="50" />
                                </td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={banner.active}
                                        onChange={() => toggleActive(banner._id, banner.active)}
                                    />
                                </td>
                                <td>
                                    <Link to={`/edit-banner/${banner._id}`} className="bt edit">
                                        Edit <i className="fa-solid fa-pen-to-square"></i>
                                    </Link>
                                </td>
                                <td>
                                    <button onClick={() => handleDelete(banner._id)} className="bt delete">
                                        Delete <i className="fa-solid fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </>
    );
};

export default AllBanner;
