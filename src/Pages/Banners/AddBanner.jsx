import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddBanner = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [name, setName] = useState("")
    const [active, setActive] = useState(false);
    const navigate = useNavigate()

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleInput = (e) => {
        setName(e.target.value)
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) {
            toast.error('Please upload an image');
            return;
        }

        const formData = new FormData();
        formData.append('image', image);
        formData.append('active', active);
        formData.append("name", name)

        setIsLoading(true);
        try {
            const res = await axios.post('http://localhost:8000/api/banner', formData);
            if (res.status === 200) {
                // navigate = ("/all-banners")
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error)
            toast.error('Failed to upload banner');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Add Banner</h4>
                </div>
                <div className="links">
                    <Link to="/all-banners" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-6">
                        <label htmlFor="bannerImage" className="form-label">Banner Name</label>
                        <input type="text" className="form-control" id="bannerImage" onChange={handleInput} />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="bannerImage" className="form-label">Banner Image</label>
                        <input type="file" className="form-control" id="bannerImage" onChange={handleFileChange} />
                    </div>
                    <div className="col-12">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" name="active" id="active" checked={active} onChange={() => setActive(!active)} />
                            <label className="form-check-label" htmlFor="active">
                                Active
                            </label>
                        </div>
                    </div>
                    <div className="col-12 text-center">
                        <button type="submit" disabled={isLoading} className={`${isLoading ? 'not-allowed' : 'allowed'}`}>
                            {isLoading ? "Please Wait..." : "Add Banner"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddBanner;
