import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import JoditEditor from 'jodit-react';

const EditProduct = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [productCategory, setProductCategory] = useState([]);
    const [productType, setProductType] = useState([]);
    const [productData, setProductData] = useState(null);
    const editor = useRef(null);
    const navigate = useNavigate();
    const { id } = useParams();

    const getProductCategory = async () => {
        try {
            const res = await axios.get("https://zens-bankend.onrender.com/api/category");
            if (res.status === 200) {
                setProductCategory(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getProductType = async () => {
        try {
            const res = await axios.get("https://zens-bankend.onrender.com/api/product-category");
            if (res.status === 200) {
                setProductType(res.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getProductData = async () => {
        try {
            const res = await axios.get(`https://zens-bankend.onrender.com/api/products/${id}`);
            console.log(res)
            if (res.status === 200) {
                setProductData(res.data.data);
                setFormData(res.data.data); // Set form data for editing
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getProductCategory();
        getProductType();
        getProductData();
    }, [id]);

    const [formData, setFormData] = useState({
        productType: '',
        productCategory: '',
        productName: '',
        productBrand: '',
        productItem: '',
        productItemNumberOf: '',
        productQuantity: '',
        productPrice: '',
        productDiscountPercentage: '',
        productFinalPrice: '',
        productDetails: '',
        productImage: []
    });

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'productImage') {
            setFormData({ ...formData, [name]: files });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // Update formData when editor content changes
    const handleEditorChange = (newContent) => {
        setFormData({ ...formData, productDetails: newContent });
    };

    // Automatically calculate the final price when price or discount percentage changes
    useEffect(() => {
        const { productPrice, productDiscountPercentage } = formData;
        if (productPrice && productDiscountPercentage) {
            const discountAmount = (productPrice * productDiscountPercentage) / 100;
            const finalPrice = productPrice - discountAmount;
            setFormData((prevData) => ({
                ...prevData,
                productFinalPrice: finalPrice > 0 ? finalPrice : 0
            }));
        }
    }, [formData.productPrice, formData.productDiscountPercentage]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const form = new FormData();
            for (const key in formData) {
                if (key === 'productImage') {
                    for (let i = 0; i < formData.productImage.length; i++) {
                        form.append('productImage', formData.productImage[i]);
                    }
                } else {
                    form.append(key, formData[key]);
                }
            }

            const response = await axios.put(`https://zens-bankend.onrender.com/api/products/${id}`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.data.success) {
                toast.success('Product updated successfully');
                navigate('/all-products');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('An error occurred while updating the product');
            console.error('Error updating product:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!productData) return <p>Loading...</p>;

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Edit Product</h4>
                </div>
                <div className="links">
                    <Link to="/all-products" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-4">
                        <label htmlFor="productType" className="form-label">Product Type<sup className='text-danger'>*</sup></label>
                        <select
                            name='productType'
                            className="form-select"
                            id="productType"
                            value={formData.productType}
                            onChange={handleChange}
                        >
                            <option value="" disabled>Select Product Type</option>
                            {
                                productType.map((item, index) =>
                                    <option key={index} value={item.productCategoryname}>{item.productCategoryname}</option>
                                )
                            }
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label htmlFor="productCategory" className="form-label">Category<sup className='text-danger'>*</sup></label>
                        <select
                            name='productCategory'
                            className="form-select"
                            id="productCategory"
                            value={formData.productCategory}
                            onChange={handleChange}
                        >
                            <option value="" disabled>Select Category</option>
                            {
                                productCategory.map((item, index) =>
                                    <option key={index} value={item.name}>{item.name}</option>
                                )
                            }
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label htmlFor="productName" className="form-label">Product Name<sup className='text-danger'>*</sup></label>
                        <input
                            type="text"
                            name='productName'
                            className="form-control"
                            id="productName"
                            value={formData.productName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className='col-md-12'>
                        <label>Product Details: <sup className='text-danger'>*</sup></label>
                        <JoditEditor
                            ref={editor}
                            value={formData.productDetails}
                            onChange={handleEditorChange}
                            placeholder="Enter product details here..."
                        />
                    </div>

                    <div className="col-md-3">
                        <label htmlFor="productBrand" className="form-label">Product Brand<sup className='text-danger'>*</sup></label>
                        <input
                            type="text"
                            name='productBrand'
                            className="form-control"
                            id="productBrand"
                            value={formData.productBrand}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-3">
                        <label htmlFor="productItem" className="form-label">Product Item<sup className='text-danger'>*</sup></label>
                        <input
                            type="text"
                            name='productItem'
                            className="form-control"
                            id="productItem"
                            value={formData.productItem}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-3">
                        <label htmlFor="productItemNumberOf" className="form-label">Number Of Item<sup className='text-danger'>*</sup></label>
                        <input
                            type="text"
                            name='productItemNumberOf'
                            className="form-control"
                            id="productItemNumberOf"
                            value={formData.productItemNumberOf}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-3">
                        <label htmlFor="productQuantity" className="form-label">Quantity<sup className='text-danger'>*</sup></label>
                        <input
                            type="text"
                            name='productQuantity'
                            className="form-control"
                            id="productQuantity"
                            value={formData.productQuantity}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-4">
                        <label htmlFor="productPrice" className="form-label">Price<sup className='text-danger'>*</sup></label>
                        <input
                            type="number"
                            name='productPrice'
                            className="form-control"
                            id="productPrice"
                            value={formData.productPrice}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-4">
                        <label htmlFor="productDiscountPercentage" className="form-label">Discount Percentage<sup className='text-danger'>*</sup></label>
                        <input
                            type="number"
                            name='productDiscountPercentage'
                            className="form-control"
                            id="productDiscountPercentage"
                            value={formData.productDiscountPercentage}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-4">
                        <label htmlFor="productFinalPrice" className="form-label">Final Price</label>
                        <input
                            type="number"
                            name='productFinalPrice'
                            className="form-control"
                            id="productFinalPrice"
                            value={formData.productFinalPrice}
                            readOnly
                        />
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="productImage" className="form-label">Product Image</label>
                        <input
                            type="file"
                            name='productImage'
                            className="form-control"
                            id="productImage"
                            onChange={handleChange}
                            multiple
                        />
                    </div>

                    <div className="col-md-12">
                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? 'Updating...' : 'Update Product'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditProduct;
