"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Import useSearchParams to get query params
import { FunnelIcon } from "@heroicons/react/24/outline"; // Filter icon
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/ProductCard"; // Reuse for "You May Also Like" section

export default function Products() {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [priceRange, setPriceRange] = useState(500);
  const [showFilters, setShowFilters] = useState(false); // Controls visibility of filter sidebar
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [availability, setAvailability] = useState("");
  const [sort, setSort] = useState(""); // Sort functionality
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category"); // Get category from URL

  useEffect(() => {
    // Fetch products and filter options from the backend
    const fetchProductsData = async () => {
      try {
        // Fetch all products
        const productsRes = await fetch(`/api/products`);
        const productsData = await productsRes.json();
        setAllProducts(productsData);
        setProducts(productsData);

        // Fetch categories, colors, sizes from the backend
        const filterRes = await fetch(`/api/products/filters`);
        const filterData = await filterRes.json();

        setCategories(filterData.categories);
        setColors(filterData.colors);
        setSizes(filterData.sizes);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error("Error fetching data:", err);
      }
    };

    fetchProductsData();
  }, []);

  useEffect(() => {
    let filtered = allProducts.filter((product) => {
      const matchesCategory = category ? product.category === category : true;
      const matchesAvailability = availability
        ? availability === "in"
          ? product.variants.some((v) => v.sizes?.some((s) => s.stock > 0))
          : product.variants.every((v) => v.sizes?.every((s) => s.stock === 0))
        : true;
      const matchesColor = selectedColor
        ? product.variants.some((variant) => variant.colorName === selectedColor)
        : true;
      const matchesSize = selectedSize
        ? product.variants.some((variant) =>
            variant.sizes?.some((s) => String(s.size) === selectedSize)
          )
        : true;
      const matchesPrice = product.price <= priceRange;

      return matchesCategory && matchesColor && matchesSize && matchesPrice && matchesAvailability;
    });

    // Sorting logic
    if (sort === "new")
      filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (sort === "old")
      filtered = filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    else if (sort === "high") filtered = filtered.sort((a, b) => b.price - a.price);
    else if (sort === "low") filtered = filtered.sort((a, b) => a.price - b.price);
    else if (sort === "az") filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "za") filtered = filtered.sort((a, b) => b.name.localeCompare(a.name));

    setProducts(filtered);
  }, [
    selectedCategory,
    selectedColor,
    selectedSize,
    availability,
    priceRange,
    sort,
    allProducts,
    category, // Category dependency to re-filter when category changes
  ]);

  const handleProductClick = (productId) => {
    router.push(`/singleproduct/${productId}`); // Navigate to the single product page
  };

  const handleCollectionClick = (categoryName) => {
    router.push(`/products?category=${categoryName}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* OUR COLLECTION */}
      <section className="text-center py-16 bg-gray-50">
        <h2 className="text-4xl font-bold text-gray-800 mb-10">OUR COLLECTION</h2>
        <div className="flex justify-center gap-10 flex-wrap px-4">
          {categories.length > 0 ? (
            categories.map((category, index) => (
              <div
                key={index} // Use index to avoid key duplication issues
                className="relative group cursor-pointer transition-transform transform hover:scale-105"
                onClick={() => handleCollectionClick(category)} // Navigate to products by collection
              >
                {/* Image Container with Hover Effect */}
                <div className="w-32 h-32 mb-4 overflow-hidden rounded-full mx-auto border-4 border-transparent group-hover:border-teal-500 transition-all duration-300">
                  <img
                    src={`/images/${category}.jpg`} // Assuming each collection has an image URL
                    alt={category}
                    className="w-full h-full object-cover transition-all duration-500 ease-in-out transform group-hover:scale-110"
                  />
                </div>

                {/* Collection Name with Hover Effect on Text */}
                <p className="mt-2 text-lg text-gray-800 font-semibold group-hover:text-teal-600 transition-all duration-300">
                  {category}
                </p>
              </div>
            ))
          ) : (
            <p>Loading collections...</p>
          )}
        </div>
      </section>

      <main className={`flex-grow bg-gradient-to-b from-[#f4f9f9] to-white px-6 py-12 relative ${showFilters ? "opacity-70" : ""}`}>
        <div className="flex items-center justify-between mb-6">
          {/* Filter Icon (Desktop) */}
          <div className="lg:block hidden">
            <button
              className="flex items-center gap-2 px-4 py-2 border rounded-full shadow bg-white hover:bg-gray-50 transition"
              onClick={() => setShowFilters(!showFilters)} // Toggle visibility of filter sidebar
            >
              <FunnelIcon className="h-5 w-5 text-teal-600" />
              <span className="text-sm font-medium text-gray-700">Filter</span>
            </button>
          </div>

          {/* Sort Bar */}
          <select
            className="border rounded-lg px-3 py-2 text-sm text-gray-700"
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Sort</option>
            <option value="new">Newest</option>
            <option value="old">Oldest</option>
            <option value="high">Price: High to Low</option>
            <option value="low">Price: Low to High</option>
            <option value="az">Name: A to Z</option>
            <option value="za">Name: Z to A</option>
          </select>
        </div>

        {/* Filter Sidebar */}
        <aside className={`transition-all duration-300 ease-in-out ${showFilters ? "block" : "hidden"} w-full lg:w-1/4 space-y-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-6 sticky top-28 z-10`}>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Filter By</h3>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All</option>
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Size Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Size</label>
            <select
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              <option value="">All</option>
              {sizes.map((size) => (
                <option key={size}>{size}</option>
              ))}
            </select>
          </div>

          {/* Color Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Color</label>
            <select
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
            >
              <option value="">All</option>
              {colors.map((color) => (
                <option key={color}>{color}</option>
              ))}
            </select>
          </div>

          {/* Availability Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Availability</label>
            <select
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
            >
              <option value="">All</option>
              <option value="in">In Stock</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>

          {/* Price Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Price: <span className="font-semibold">Up to Rs. {priceRange}</span>
            </label>
            <input
              type="range"
              min="0"
              max="500"
              step="10"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-teal-500"
            />
          </div>
        </aside>

        {/* Product Section */}
        <section className="w-full lg:w-3/4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl shadow hover:shadow-xl transition p-4 group cursor-pointer"
                  onClick={() => handleProductClick(product._id)} // Navigate to the single product page
                >
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-12">No products found.</p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
