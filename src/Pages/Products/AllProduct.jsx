import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AllProduct = () => {
    const [data, setData] = useState([])

    const getApiData = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/products")
            if (res.status === 200) {
                setData(res.data.data.reverse())
            }
        } catch (error) {
            console.log(error)
        }
    }

    const deteleImage = async (id) => {
        try {
            const res = await axios.delete("http://localhost:8000/api/products/" + id)
             console.log(res)
            if(res.status===200){
                toast.success(res.data.message)
                getApiData()
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
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>All Product List </h4>
                </div>
                <div className="links">
                    <Link to="/add-product" className="add-new">Add New <i class="fa-solid fa-plus"></i></Link>
                </div>
            </div>

            <div className="filteration">
                <div className="selects">
                    {/* <select>
                        <option>Ascending Order </option>
                        <option>Descending Order </option>
                    </select> */}
                </div>
                <div className="search">
                    <label htmlFor="search">Search </label> &nbsp;
                    <input type="text" name="search" id="search" />
                </div>
            </div>

            <section className="d-table ">
                <table class="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Sr.No.</th>
                            <th scope="col">Product Type</th>
                            <th scope="col">Category</th>
                            <th scope="col">Product Name</th>
                            <th scope="col">Product Image</th>
                            <th scope="col">Price</th>
                            <th scope="col">Discount Price</th>
                            <th scope="col">Final Price</th>
                            <th scope="col">Edit</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((item, index) =>
                                <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{item.productType}</td>
                                    <td>{item.productCategory}</td>
                                    <td>{item.productName}</td>
                                    <td><img src={item.productImage[0]} alt="" /></td>
                                    <td>{item.productPrice} &#8377;</td>
                                    <td>{item.productDiscountPercentage}%</td>
                                    <td>{item.productFinalPrice} &#8377;</td>
                                    <td><Link className="bt edit" to={`/edit-product/${item._id}`}>Edit <i class="fa-solid fa-pen-to-square"></i></Link></td>
                                    <td><Link className="bt delete" onClick={() => deteleImage(item._id)} >Delete <i class="fa-solid fa-trash"></i></Link></td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </section>
        </>
    )
}

export default AllProduct