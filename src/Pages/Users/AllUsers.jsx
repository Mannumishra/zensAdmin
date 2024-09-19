import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllUsers = () => {
    const [data, setData] = useState([])
    const getApiData = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/user")
            console.log(res)
            if (res.status === 200) {
                setData(res.data.data.reverse())
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getApiData()
    }, [data.length])
    return (
        <>
            <div className="bread">
                <div className="head">
                    <h4>All Users</h4>
                </div>
                <div className="links">
                    {/* Additional links or actions can be placed here */}
                </div>
            </div>

            <section className="d-table">
                <div className="table-responsive mt-4">
                    <table className="table table-bordered table-striped table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Sr.No.</th>
                                <th>Image</th>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Phone Number</th>
                                <th scope="col">Role</th>
                                <th scope="col">Created At</th>
                                {/* Add more columns as needed */}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.map((item, index) => {
                                    const date = new Date(item.createdAt);
                                    const formattedDateTime = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
                                    return (
                                        <tr key={index}>
                                            <th scope="row">{index + 1}</th>
                                            <td><img src={item.image} alt="" /></td>
                                            <td>{item.name}</td>
                                            <td>{item.email}</td>
                                            <td>{item.phone}</td>
                                            <td>{item.role}</td>
                                            <td>{formattedDateTime}</td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>

                    </table>
                </div>
            </section>
        </>
    );
};

export default AllUsers;
