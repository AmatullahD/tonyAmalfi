type Product = {
  id: number;
  name: string;
  price: string;
  image: string;
};

const categoryData: Record<string, Product[]> = {
  "denim-jackets": [
    { id: 1, name: "Blue Denim Jacket", price: "₹1,999", image: "/denim1.jpg" },
    { id: 2, name: "Black Denim Jacket", price: "₹2,199", image: "/denim2.jpg" },
    { id: 3, name: "Oversized Denim Jacket", price: "₹1,999", image: "/denim3.jpg" },
    { id: 4, name: "Soft wash Denim Jacket", price: "₹2,199", image: "/denim4.jpg" },
    { id: 5, name: "Blue Denim Jacket", price: "₹1,999", image: "/denim1.jpg" },
    { id: 6, name: "Black Denim Jacket", price: "₹2,199", image: "/denim2.jpg" },
    { id: 7, name: "Oversized Denim Jacket", price: "₹1,999", image: "/denim3.jpg" },
    { id: 8, name: "Soft wash Denim Jacket", price: "₹2,199", image: "/denim4.jpg" },
    { id: 9, name: "Blue Denim Jacket", price: "₹1,999", image: "/denim1.jpg" },
    { id: 10, name: "Black Denim Jacket", price: "₹2,199", image: "/denim2.jpg" },
  ],
  "pullovers": [
    { id: 11, name: "Black Pullover", price: "₹2,199", image: "/denim4.jpg" },
    { id: 12, name: "White Pullover", price: "₹1,999", image: "/denim1.jpg" },
    { id: 13, name: " Oversized Pullover", price: "₹2,199", image: "/denim2.jpg" },
    { id: 14, name: " Pullover", price: "₹1,999", image: "/denim3.jpg" },
    { id: 15, name: "Soft wash Pullover", price: "₹2,199", image: "/denim4.jpg" },
    { id: 16, name: "Blue Pullover", price: "₹1,999", image: "/denim1.jpg" },
  ],
  "jeans": [
    { id: 17, name: "Black Jeans", price: "₹2,199", image: "/denim4.jpg" },
    { id: 18, name: "White Jeans", price: "₹1,999", image: "/denim1.jpg" },
    { id: 19, name: " Oversized Jeans", price: "₹2,199", image: "/denim2.jpg" },
    { id: 20, name: " Jeans", price: "₹1,999", image: "/denim3.jpg" },
    { id: 21, name: "Soft wash Jeans", price: "₹2,199", image: "/denim4.jpg" },
    { id: 22, name: "Blue Pullover", price: "₹1,999", image: "/denim1.jpg" },
  ],
  "t-shirts": [
    { id: 23, name: "Black T-Shirt", price: "₹2,199", image: "/denim4.jpg" },
    { id: 24, name: "White T-Shirt", price: "₹1,999", image: "/denim1.jpg" },
  ],
  "shirts": [
    { id: 25, name: "Black Shirt", price: "₹2,199", image: "/denim4.jpg" },
    { id: 26, name: "White Shirt", price: "₹1,999", image: "/denim1.jpg" },
  ],
};

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  const formattedCategory = category.toLowerCase();
  const products = categoryData[formattedCategory] || [];

  return (
    <div className="px-4 md:px-10 py-10">
      <h1 className="text-lg md:text-xl font-medium mb-6 uppercase text-center tracking-wide">
        {category.replace("-", " ")}
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <div key={product.id} className="group cursor-pointer">
            <div className="overflow-hidden rounded-lg bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[250px] object-cover group-hover:scale-105 transition duration-300"
              />
            </div>

            <div className="mt-2 text-center">
              <h2 className="text-sm font-medium">{product.name}</h2>
              <p className="text-sm text-gray-600">{product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}