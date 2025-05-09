"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import HeroCarousel from "../components/HeroCarousel"; // Import carousel

export default function Home() {
  const [collections, setCollections] = useState([]);
  const [latestTrends, setLatestTrends] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const collectionsRes = await fetch("http://localhost:5000/collections");
        const collectionsData = await collectionsRes.json();
        setCollections(collectionsData);

        const latestTrendsRes = await fetch("http://localhost:5000/products?latest=true");
        const latestTrendsData = await latestTrendsRes.json();
        setLatestTrends(latestTrendsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const handleCollectionClick = (collection) => {
    router.push(`/products?category=${collection.toLowerCase()}`); // Apply filter by category
  };

  const handleProductClick = (productId) => {
    router.push(`/singleproduct/${productId}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow bg-gradient-to-b from-[#e9f3f4] to-white">
        {/* Hero Section with Shoe-Themed Customization */}
        <div className="relative w-full h-screen">
          <HeroCarousel />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-white text-5xl md:text-6xl font-bold tracking-wider leading-snug drop-shadow-lg">
              WELCOME TO OUR SHOE STORE
            </h1>
            <p className="mt-4 text-lg md:text-xl text-white max-w-xl drop-shadow-md">
              Discover the latest shoe trends and style in our collection. From sleek heels to comfort flats.
            </p>
          </div>
        </div>

        {/* OUR COLLECTION */}
        <section className="text-center py-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-10">OUR COLLECTION</h2>
          <div className="flex justify-center gap-10 flex-wrap px-4">
            {collections.length > 0 ? (
              collections.map((item) => (
                <div
                  key={item.name}
                  className="text-center cursor-pointer hover:scale-105 transition"
                  onClick={() => handleCollectionClick(item.name)}
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={140}
                    height={140}
                    className="rounded-full mx-auto"
                  />
                  <p className="mt-2 text-sm text-gray-700 font-medium">{item.name}</p>
                </div>
              ))
            ) : (
              <p>Loading collections...</p>
            )}
          </div>
        </section>

        {/* LATEST TRENDS */}
        <section className="py-16 px-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">OUR LATEST TRENDS</h2>
          <div className="flex overflow-x-auto gap-6 px-10 scroll-smooth no-scrollbar">
            {latestTrends.length > 0 ? (
              latestTrends.map((product) => (
                <div
                  key={product.id}
                  className="min-w-[220px] bg-white border rounded-lg shadow-md p-4 hover:shadow-xl transition cursor-pointer"
                  onClick={() => handleProductClick(product.id)}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={220}
                    height={220}
                    className="rounded"
                  />
                  <p className="mt-3 text-base font-medium text-gray-800">{product.name}</p>
                  <p className="text-sm text-gray-500">Rs. {product.price}</p>
                </div>
              ))
            ) : (
              <p>Loading latest trends...</p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
