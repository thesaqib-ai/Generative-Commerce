"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HeroCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  // Slides data
  const slides = [
    {
      title: "WELCOME TO OUR SHOE STORE",
      subtitle:
        "Discover the latest shoe trends and style in our collection. From sleek heels to comfort flats.",
      image: "/hero1.jpg",
      link: "/products",
      textPosition: "left", // Text on the left side for first slide
    },
    {
      title: "Shop the Latest Trends",
      subtitle: "Step into style with our newest arrivals.",
      image: "/hero3.jpg",
      link: "/products?filter=latest",
      textPosition: "left", // Text on the right side for second slide
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveSlide((prev) => (prev + 1) % slides.length);
        setIsTransitioning(false);
      }, 500);
    }, 5000); // Auto change slide every 5 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveSlide(index);
      setIsTransitioning(false);
    }, 100);
  };

  const currentSlide = slides[activeSlide];

  return (
    <div className="relative w-full h-[80vh] md:h-screen overflow-hidden">
      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === activeSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          aria-hidden={index !== activeSlide}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            style={{ objectFit: "cover" }}
            priority={index === 0} // prioritize first image loading
            quality={75}
            sizes="(max-width: 600px) 100vw, 100vw"
            draggable={false}
          />
        </div>
      ))}

      {/* Content Container */}
      <div
        className={`relative z-20 flex items-center w-full h-full px-6 md:px-12 transition-opacity duration-700 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        <div
          className={`max-w-lg ${
            currentSlide.textPosition === "left" ? "text-left mr-auto" : "text-right ml-auto"
          }`}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-black drop-shadow-lg">
            {currentSlide.title}
          </h1>
          <p className="text-lg md:text-xl mb-8 text-black drop-shadow-md">
            {currentSlide.subtitle}
          </p>
          <button
            onClick={() => router.push(currentSlide.link)}
            className="px-8 py-3 bg-teal-600 text-black font-semibold rounded-full hover:bg-teal-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            Shop Now
          </button>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-30">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`w-4 h-4 rounded-full transition-colors duration-300 ${
              idx === activeSlide
                ? "bg-white shadow-lg"
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
