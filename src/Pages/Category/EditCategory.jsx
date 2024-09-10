import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditCategory = () => {
    const { _id } = useParams();
    const navigate = useNavigate()
    const [btnLoading, setBtnLoading] = useState(false);
    const [data, setData] = useState({
        name: "",
        image: null,
    });

    useEffect(() => {
        // Fetch category data by ID to populate the form fields
        const fetchCategoryData = async () => {
            try {
                const res = await axios.get(`https://zens-bankend.onrender.com/api/category/${_id}`);
                console.log(res)
                setData(res.data.data);
            } catch (error) {
                console.log(error);
                toast.error('Failed to fetch category data');
            }
        };
        fetchCategoryData();
    }, [_id]);

    const getInputData = (e) => {
        const { name, value } = e.target
        setData({ ...data, [name]: value })
    }
    const getFileData = (e) => {
        const { name, files } = e.target
        setData({ ...data, [name]: files[0] })
    }

  

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", data.name);
        if (data.image) {
            formData.append("image", data.image);
        }
        setBtnLoading(true);
        try {
            const res = await axios.put(`https://zens-bankend.onrender.com/api/category/${_id}`, formData);
            if (res.status === 200) {
                setBtnLoading(false);
                toast.success('Category updated successfully');
                navigate("/all-category")
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to update category');
            setBtnLoading(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Edit Category</h4>
                </div>
                <div className="links">
                    <Link to="/all-category" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-6">
                        <label htmlFor="categoryName" className="form-label">Category Name</label>
                        <input 
                            type="text" 
                            name='name' 
                            className="form-control" 
                            id="categoryName" 
                            value={data.name}
                            onChange={getInputData} 
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="categoryImage" className="form-label">Category Image</label>
                        <input 
                            type="file" 
                            name='image' 
                            className="form-control" 
                            id="categoryImage" 
                            onChange={getFileData} 
                        />
                    </div>
                    <div className="col-12 text-center">
                        <button 
                            type="submit" 
                            className={`${btnLoading ? 'not-allowed' : 'allowed'}`} 
                            disabled={btnLoading}
                        >
                            {btnLoading ? "Please Wait..." : "Update Category"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditCategory;
