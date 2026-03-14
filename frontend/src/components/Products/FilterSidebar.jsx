import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const FilterSidebar = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [filters, setFilters] = useState({
        category: "",
        gender: "",
        color: "",
        size: [],
        material: [],
        brand: [],
        minPrice: 0,
        maxPrice: 100,
    });

    const [priceRange, setPriceRange] = useState([0, 100]);

    const categories = ["Top Wear", "Bottom Wear"];

    const colors = [
        "Red", "Blue", "Black", "Green", "Yellow", "Gray", "White", "Pink", "Beige", "Navy"
    ];

    const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

    const materials = [
        "Cotton", "Wool", "Denim", "Polyester", "Silk", "Linen", "Viscose", "Fleece"
    ];

    const brands = [
        "Urban Threads", "Modern Fit", "Street Style", "Beach Breeze", "Fashionista", "ChickStyle"
    ];

    const genders = ["Men", "Women"];

    useEffect(() => {
        const params =  Object.fromEntries([...searchParams]);
        
    })

  return (
    <div>FilterSidebar</div>
  )
}

export default FilterSidebar