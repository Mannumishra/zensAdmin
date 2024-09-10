import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddTag = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [productCategoryname, setProductCategoryname] = useState("");
    const navigate = useNavigate();

    const postData = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        console.log(productCategoryname)
        try {
            const res = await axios.post("http://localhost:8000/api/product-category", { productCategoryname });
            if (res.status === 200) {
                toast.success(res.data.message);
                navigate("/all-productCategory");
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Something went wrong!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Add Product Category</h4>
                </div>
                <div className="links">
                    <Link to="/all-productCategory" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={postData}>
                    <div className="col-md-6">
                        <label htmlFor="title" className="form-label">Product Category Name<sup className='text-danger'>*</sup></label>
                        <input 
                            type="text" 
                            name='productCategoryname' 
                            value={productCategoryname}
                            onChange={(e) => setProductCategoryname(e.target.value)} 
                            className="form-control" 
                            id="title" 
                            placeholder='Product Category Name' 
                            required 
                        />
                    </div>
                    <div className="col-md-6 mt-5 text-center">
                        <button 
                            type="submit" 
                            disabled={isLoading} 
                            className={`btn ${isLoading ? 'not-allowed' : 'allowed'}`}
                        >
                            {isLoading ? "Please Wait..." : "Add Tag"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddTag;
