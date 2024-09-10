import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditBanner = () => {
    const { id } = useParams();
    const [banner, setBanner] = useState(null);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [active, setActive] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);

    // Fetch the banner data
    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/banner/${id}`);
                console.log(res)
                if (res.status === 200) {
                    const bannerData = res.data.data;
                    setBanner(bannerData);
                    setImagePreview(bannerData.image);
                    setActive(bannerData.active);
                }
            } catch (error) {
                console.error('Error fetching banner:', error);
                toast.error('Error fetching banner data');
            }
        };
        fetchBanner();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setBtnLoading(true);

        const formData = new FormData();
        if (image) {
            formData.append('image', image); // Ensure this key matches backend
        }
        formData.append('active', active);

        try {
            const res = await axios.patch(`http://localhost:8000/api/banner/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (res.status === 200) {
                toast.success('Banner updated successfully');
            } else {
                toast.error('Failed to update banner');
            }
        } catch (error) {
            console.error('Error updating banner:', error);
            toast.error('Error updating banner');
        } finally {
            setBtnLoading(false);
        }
    };

    useEffect(() => {
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };


    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Edit Banner</h4>
                </div>
                <div className="links">
                    <Link to="/all-banners" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-4">
                        <label htmlFor="bannerImage" className="form-label">Banner Image</label>
                        <input
                            type="file"
                            name='bannerImage'
                            className="form-control"
                            id="bannerImage"
                            onChange={handleImageChange}
                        />
                    </div>
                    <div className="col-4">
                        <img
                            src={imagePreview || 'default-image-url'}
                            alt="Category Preview"
                            style={{ width: '100%', height: 'auto' }}
                        />

                    </div>
                    <div className="col-12">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                name="active"
                                id="active"
                                checked={active}
                                onChange={() => setActive(!active)}
                            />
                            <label className="form-check-label" htmlFor="active">
                                Active
                            </label>
                        </div>
                    </div>
                    <div className="col-12 text-center">
                        <button
                            type="submit"
                            className={`btn ${btnLoading ? 'btn-secondary' : 'btn-primary'}`}
                            disabled={btnLoading}
                        >
                            {btnLoading ? "Please Wait.." : "Update Banner"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditBanner;
