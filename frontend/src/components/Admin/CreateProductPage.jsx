import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createProduct } from "../../redux/slices/adminProductSlice";
import axios from 'axios';

const CreateProductPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [productData, setProductData] = useState({
        name: "",
        description: "",
        price: 0,
        countInStock: 0,
        sku: "",
        category: "",
        brand: "",
        sizes: [],
        colors: [],
        collections: "",
        material: "",
        gender: "",
        images: []
    });

    const [uploading, setUploading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("image", file);

        try {
            setUploading(true);
            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" }
                }
            );

            setProductData((prev) => ({
                ...prev,
                images: [...prev.images, { url: data.imageUrl, altText: "" }]
            }));

            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(createProduct(productData));
        navigate("/admin/products");
    };

    return (
        <div className='max-w-5xl mx-auto p-6 shadow-md rounded-md'>
            <h2 className='text-3xl font-bold mb-6'>Add Product</h2>

            <form onSubmit={handleSubmit}>
                
                <div className='mb-6'>
                    <label className='block font-semibold mb-2'>Product Name</label>
                    <input
                        type="text"
                        name='name'
                        value={productData.name}
                        onChange={handleChange}
                        className='w-full border p-2'
                        required
                    />
                </div>

                <div className='mb-6'>
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={productData.description}
                        onChange={handleChange}
                        className='w-full border p-2'
                        required
                    />
                </div>

                <div className='mb-6'>
                    <label>Price</label>
                    <input
                        type="number"
                        name="price"
                        value={productData.price}
                        onChange={handleChange}
                        className='w-full border p-2'
                    />
                </div>

                <div className='mb-6'>
                    <label>Stock</label>
                    <input
                        type="number"
                        name="countInStock"
                        value={productData.countInStock}
                        onChange={handleChange}
                        className='w-full border p-2'
                    />
                </div>

                <div className='mb-6'>
                    <label>SKU</label>
                    <input
                        type="text"
                        name="sku"
                        value={productData.sku}
                        onChange={handleChange}
                        className='w-full border p-2'
                    />
                </div>

                <div className='mb-6'>
                    <label>Category</label>
                    <input
                        type="text"
                        name="category"
                        value={productData.category}
                        onChange={handleChange}
                        className='w-full border p-2'
                    />
                </div>
                <div className='mb-6'>
                    <label>Brand</label>
                    <input
                        type="text"
                        name="brand"
                        value={productData.brand}
                        onChange={handleChange}
                        className='w-full border p-2'
                    />
                </div>
                <div className='mb-6'>
                    <label>Material</label>
                    <input
                        type="text"
                        name="material"
                        value={productData.material}
                        onChange={handleChange}
                        className='w-full border p-2'
                    />
                </div>
                <div className='mb-6'>
    <label>Collection</label>
    <input
        type="text"
        name="collections"
        value={productData.collections}
        onChange={handleChange}
        className='w-full border p-2'
        placeholder="e.g. Summer, Winter"
        required
    />
</div>
                <div className='mb-6'>
                    <label>Gender</label>
                    <input
                        type="text"
                        name="gender"
                        value={productData.gender}
                        onChange={handleChange}
                        className='w-full border p-2'
                    />
                </div>

                <div className='mb-6'>
                    <label>Sizes (comma separated)</label>
                    <input
                        type="text"
                        value={productData.sizes.join(", ")}
                        onChange={(e) =>
                            setProductData({
                                ...productData,
                                sizes: e.target.value.split(",").map(s => s.trim())
                            })
                        }
                        className='w-full border p-2'
                    />
                </div>

                <div className='mb-6'>
                    <label>Colors (comma separated)</label>
                    <input
                        type="text"
                        value={productData.colors.join(", ")}
                        onChange={(e) =>
                            setProductData({
                                ...productData,
                                colors: e.target.value.split(",").map(c => c.trim())
                            })
                        }
                        className='w-full border p-2'
                    />
                </div>

                <div className='mb-6'>
                    <label>Upload Image</label>
                    <input type="file" onChange={handleImageUpload} />
                    {uploading && <p>Uploading...</p>}

                    <div className='flex gap-4 mt-4'>
                        {productData.images.map((img, i) => (
                            <img key={i} src={img.url} className='w-20 h-20' />
                        ))}
                    </div>
                </div>

                <button className='bg-green-500 text-white px-4 py-2 rounded'>
                    Create Product
                </button>

            </form>
        </div>
    );
};

export default CreateProductPage;