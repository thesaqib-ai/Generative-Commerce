import Link from "next/link";

export default function ProductCard({ product }) {
  const variant = product.variants?.[0];
  const image = variant?.images?.[0] || "/placeholder.png";

  return (
    <div className="bg-white border rounded-xl shadow hover:shadow-lg transition p-3 flex flex-col gap-3 text-sm">
      <img
        src={image}
        alt={product.name}
        className="w-full h-40 object-cover rounded-lg"
      />
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
        <p className="text-teal-700 font-bold">Rs. {product.price}</p> {/* "Rs." is added here */}
        <Link
          href={`/singleproduct/${product._id}`} // Navigates to the single product page using product's ID
          className="text-teal-600 hover:underline mt-1"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}
