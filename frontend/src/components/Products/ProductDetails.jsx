import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import ProductGrid from './ProductGrid';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchProductDetails,
    fetchSimilarProducts
} from "../../redux/slices/productsSlice";
import { addToCart } from '../../redux/slices/cartSlice';
import { addReview } from "../../redux/slices/productsSlice";


const ProductDetails = ({ productId }) => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { selectedProduct, loading, error, similarProducts } = useSelector((state) => state.products);
    const { user, guestId } = useSelector((state) => state.auth);
    const [mainImage, setMainImage] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0);

    console.log("Selected Product:", selectedProduct);

    const productFetchId = productId || id;
    console.log(productId)

    useEffect(() => {
        if (productFetchId) {
            dispatch(fetchProductDetails(productFetchId));
            dispatch(fetchSimilarProducts({ id: productFetchId }))
        }
    }, [dispatch, productFetchId]);

    useEffect(() => {
        if (selectedProduct?.images?.length > 0) {
            setMainImage(selectedProduct.images[0].url);
        }
    }, [selectedProduct]);

    const handleReviewSubmit = () => {
        if (!comment || !rating) {
            toast.error("Please add rating and comment");
            return;
        }

        dispatch(addReview({
            id: productFetchId,
            rating,
            comment
        }))
            .then(() => {
                toast.success("Review added");
                setComment("");
                setRating(0);
            });
    };

    const handleQuantityChange = (action) => {
        if (action === "plus") setQuantity((prev) => prev + 1);
        if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
    }

    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor) {
            toast.error("Please select a size and color before adding to cart.", {
                duration: 1000
            });
            return;
        }
        setIsButtonDisabled(true);

        dispatch(
            addToCart({
                productId: productFetchId,
                quantity,
                size: selectedSize,
                color: selectedColor,
                guestId,
                userId: user?._id
            })
        )
            .then(() => {
                toast.success("Product added to cart!", {
                    duration: 1000,
                })
            })
            .finally(() => {
                setIsButtonDisabled(false)
            })
    };

    if (loading) {
        return <p>Loading...</p>
    }

    if (error) {
        return <p>Error: {error}</p>
    }

    return (
        <div className='p-6'>
            {selectedProduct && (
                <div className='mx-w-6xl mx-auto bg-white p-8 rounded-lg '>
                    <div className='flex flex-col md:flex-row '>
                        <div className='hidden md:flex flex-col space-y-4 mr-6'>
                            {selectedProduct.images.map((images, index) => (
                                <img
                                    key={index}
                                    src={images.url}
                                    alt={images.altText || `Thumbnail ${index}`}
                                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${mainImage === images.url ? "border-black" : "border-gray-300"}`}
                                    onClick={() => setMainImage(images.url)}
                                />
                            ))}
                        </div>
                        <div className='md:w-1/2'>
                            <div className='mb-4'>
                                <img src={mainImage} alt="Main Product" className='w-full h-auto object-cover rounded-lg' />
                            </div>
                        </div>
                        <div className='md:hidden flex overflow-x-scroll space-x-4 mb-4'>
                            {selectedProduct.images.map((images, index) => (
                                <img
                                    key={index}
                                    src={images.url}
                                    alt={images.altText || `Thumbnail ${index}`}
                                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${mainImage === images.url ? "border-black" : "border-gray-300"}`}
                                    onClick={() => setMainImage(images.url)}
                                />
                            ))}
                        </div>
                        <div className='md:w-1/2 md:ml-10'>
                            <h1 className='text-2xl md:text-3xl font-semibold md-2'>
                                {selectedProduct.name}
                            </h1>
                            <p className='text-lg text-gray-600 mb-1 line-through'>
                                {selectedProduct.originalPrice && `${selectedProduct.originalPrice}`}
                            </p>
                            <p className='text-xl text-gray-500 mb-2'>
                                $ {selectedProduct.price}
                            </p>
                            <p className='text-gray-600 mb-4'>{selectedProduct.description}</p>
                            <div className='mb-4'>
                                <p className='text-gray-700'>Color :</p>
                                <div className='flex gap-2 mt-2'>
                                    {selectedProduct.colors.map((color) => (
                                        <button key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-8 h-8 rounded-full border ${selectedColor === color ? "border-4 border-black" : "border-gray-300"}`}
                                            style={{
                                                backgroundColor: color.toLocaleLowerCase(),
                                                filter: "brightness(0.5)"
                                            }}></button>
                                    ))}
                                </div>
                            </div>
                            <div className='mb-4'>
                                <p className='text-gray-700'>Size :</p>
                                <div className='flex gap-2 mt-2'>
                                    {selectedProduct.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-4 py-2 rounded border ${selectedSize === size ? "bg-black text-white" : ""}`}>
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className='mb-6'>
                                <p className='text-gray-700'>Quantity :</p>
                                <div className='flex items-center space-x-4 mt-2'>
                                    <button onClick={() => handleQuantityChange("minus")} className='px-2 py-1 bg-gray-200 rounded text-lg'>-</button>
                                    <span className='text-lg'>{quantity}</span>
                                    <button onClick={() => handleQuantityChange("plus")} className='px-2 py-1 bg-gray-200 rounded text-lg'>+</button>
                                </div>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                disabled={isButtonDisabled}
                                className={`bg-black text-white  py-2 px-6 rounded w-full mb-4 ${isButtonDisabled ? "cursor-not-allowed opacity-50" : "hover:bg-gray-900"}`}
                            >
                                {isButtonDisabled ? "Adding..." : "ADD TO CART"}
                            </button>
                            <div className='mt-10 text-gray-700'>
                                <h3 className='text-xl font-bold mb-4'>Characteristics :</h3>
                                <table className='w-full text-left text-sm text-gray-600'>
                                    <tbody>
                                        <tr>
                                            <td className='py-1'>Brand</td>
                                            <td className='py-1'>{selectedProduct.brand}</td>
                                        </tr>
                                        <tr>
                                            <td className='py-1'>Material</td>
                                            <td className='py-1'>{selectedProduct.material}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>


                    <div className="mt-10">
  {/* Heading */}
  <h2 className="text-2xl font-bold mb-6">
    Reviews ({selectedProduct.reviews?.length || 0})
  </h2>

  {/* Add Review */}
  <div className="mb-8 bg-gray-50 p-5 rounded-lg shadow-sm">
    <h3 className="text-lg font-semibold mb-3">Write a Review</h3>
    <textarea
      value={comment}
      onChange={(e) => setComment(e.target.value)}
      placeholder="Write your review..."
      className="w-full border border-gray-300 p-3 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-black resize-none h-24"
    />

    <div className="flex items-center gap-2 mb-3">
      <label className="font-medium">Rating:</label>
      <select
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
      >
        <option value="">Select Rating</option>
        <option value="1">⭐ 1</option>
        <option value="2">⭐⭐ 2</option>
        <option value="3">⭐⭐⭐ 3</option>
        <option value="4">⭐⭐⭐⭐ 4</option>
        <option value="5">⭐⭐⭐⭐⭐ 5</option>
      </select>
    </div>

    <button
      onClick={handleReviewSubmit}
      className="bg-black text-white px-5 py-2 rounded-md hover:bg-gray-900 transition-colors"
    >
      Submit Review
    </button>
  </div>

  {/* Show Reviews */}
  <div className="flex flex-col gap-4">
    {selectedProduct?.reviews?.length === 0 && (
      <p className="text-gray-500">No reviews yet. Be the first to review!</p>
    )}

    {selectedProduct?.reviews?.map((rev, i) => (
      <div key={i} className="border rounded-md p-4 bg-white shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <p className="font-semibold">{rev.name}</p>
          <p className="text-yellow-500 font-bold">{"⭐".repeat(rev.rating)}</p>
        </div>
        <p className="text-gray-700">{rev.comment}</p>
        <p className="text-gray-400 text-sm mt-2">
          {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : ""}
        </p>
      </div>
    ))}
  </div>
</div>

                    <div className='mt-20'>
                        <h2 className='text-2xl text-center font-medium mb-4'>
                            You May Also Like
                        </h2>
                        <ProductGrid products={similarProducts} loading={loading} error={error} />
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductDetails