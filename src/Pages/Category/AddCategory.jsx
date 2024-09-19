import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddCategory = () => {
    const navigate = useNavigate()
    const [isLoading, setIsloding] = useState(false)
    const [data, setData] = useState({
        name: "",
        image: ""
    })
    const getInputData = (e) => {
        const { name, value } = e.target
        setData({ ...data, [name]: value })
    }
    const getFileData = (e) => {
        const { name, files } = e.target
        setData({ ...data, [name]: files[0] })
    }

    const postData = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append("name", data.name)
        formData.append("image", data.image)
        setIsloding(true)
        try {
            const res = await axios.post("http://localhost:8000/api/category", formData)
            if (res.status === 200) {
                setIsloding(false)
                navigate("/all-category")
            }
        } catch (error) {
            console.log(error)
            setIsloding(false)
        }
    }
    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Add Category</h4>
                </div>
                <div className="links">
                    <Link to="/all-category" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={postData}>
                    <div className="col-md-6">
                        <label htmlFor="categoryName" className="form-label">Category Name</label>
                        <input type="text" name='name' className="form-control" id="categoryName" onChange={getInputData} />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="categoryImage" className="form-label">Category Image</label>
                        <input type="file" name='image' className="form-control" id="categoryImage" onChange={getFileData} />
                    </div>
                    <div className="col-12 text-center">
                        <button type="submit" disabled={isLoading} className={`${isLoading ? 'not-allowed' : 'allowed'}`}>{isLoading ? "Please Wait..." : "Add Category"}</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default AddCategory;
