"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; // Fetching product ID from URL
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

export default function SingleProductPage() {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");

  const params = useParams();
  const productId = params.id;  // Get the product ID from the URL
  const router = useRouter();

  useEffect(() => {
    if (!productId) {
      setError("Product ID not found");
      setLoading(false);
      return;
    }

    // Fetch product details based on product ID
    const fetchProductData = async () => {
      try {
        const productRes = await fetch(`/api/products/${productId}`);  // Get specific product data
        const productData = await productRes.json();
        setProduct(productData);

        // Fetch related products (optional)
        const relatedRes = await fetch(`/api/products/related?category=${productData.category}`);
        const relatedData = await relatedRes.json();
        setRelatedProducts(relatedData);
      } catch (err) {
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError("Please select a size");
      return;
    }
    // Add to cart logic here
    alert(`Added ${product.name} (Size: ${selectedSize}) to cart`);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <main className="flex-grow bg-gradient-to-b from-[#f4f9f9] to-white px-6 py-12">
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading product details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <main className="flex-grow bg-gradient-to-b from-[#f4f9f9] to-white px-6 py-12">
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => router.push("/products")}
              className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition"
            >
              Browse Products
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <main className="flex-grow bg-gradient-to-b from-[#f4f9f9] to-white px-6 py-12">
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Product not found</p>
            <button
              onClick={() => router.push("/products")}
              className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition"
            >
              Continue Shopping
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow bg-gradient-to-b from-[#f4f9f9] to-white px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden shadow-lg">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {product.images.slice(1).map((image, index) => (
                  <div key={index} className="rounded-lg overflow-hidden shadow-md">
                    <img
                      src={image}
                      alt={`${product.name} - View ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-2xl text-teal-600">Rs. {product.price.toLocaleString()}</p>

              <div className="space-y-2">
                <p className="text-gray-600">{product.description}</p>
                <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                <p className="text-sm text-gray-500">Category: {product.category}</p>
                <p className="text-sm text-gray-500">Color: {product.color}</p>
              </div>

              {/* Size Selector */}
              <div className="pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-md text-sm ${
                        selectedSize === size
                          ? "bg-teal-600 text-white border-teal-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-md font-semibold transition duration-300"
              >
                Add to Cart
              </button>

              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          </div>

          {/* Related Products */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct._id}
                  onClick={() => router.push(`/singleproduct/${relatedProduct._id}`)}
                  className="bg-white p-4 rounded-lg shadow hover:shadow-md transition cursor-pointer"
                >
                  <div className="aspect-square overflow-hidden rounded-lg mb-3">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium text-gray-800">{relatedProduct.name}</h3>
                  <p className="text-teal-600">Rs. {relatedProduct.price.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
