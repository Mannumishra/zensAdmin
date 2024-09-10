import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AllVoucher = () => {
    const [data, setData] = useState([]);

    // Fetch all contacts data from API
    const getApiData = async () => {
        try {
            const res = await axios.get("https://zens-bankend.onrender.com/api/contacts");
            console.log(res)
            if (res.status === 200) {
                setData(res.data.contacts.reverse());
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Delete a contact by id
    const deleteContact = async (id) => {
        try {
            const res = await axios.delete(`https://zens-bankend.onrender.com/api/contacts/${id}`);
            if (res.status === 200) {
                alert("Contact deleted successfully!");
                // Refresh data after deletion
                getApiData();
            }
        } catch (error) {
            console.log(error);
            alert("Failed to delete the contact.");
        }
    };

    useEffect(() => {
        getApiData();
    }, []); // useEffect depends only on mount, not on data change

    return (
        <>
            <div className="bread">
                <div className="head">
                    <h4>All Contacts</h4>
                </div>
                {/* <div className="links">
                    <Link to="/add-voucher" className="add-new">Add New <i className="fa-solid fa-plus"></i></Link>
                </div> */}
            </div>
            <section className="mt-2 d-table table-responsive">
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">S no.</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Phone</th>
                            <th scope="col">Subject</th>
                            <th scope="col">Message</th>
                            {/* <th scope="col">Confirm</th> */}
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data && data.length > 0 ? (
                            data.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>
                                    <td>{item.phone}</td>
                                    <td>{item.subject}</td>

                                    <td>{item.message}</td>
                                    {/* <td><Link>Confirm</Link></td> */}
                                    <td>
                                        <button
                                            className="btn delete btn-danger"
                                            onClick={() => deleteContact(item._id)}
                                        >
                                            Delete <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No contacts found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>
        </>
    );
}

export default AllVoucher;
