"use client";

import { FiArrowLeft } from "react-icons/fi";
import { FaRegHeart } from "react-icons/fa";
import { useCart } from "@/app/providers"; // 👈 IMPORTANT

export default function Cart() {
  const { items, removeItem, updateQuantity, total } = useCart();

  return (
    <div className="bg-white min-h-screen pt-10">
     <div className="max-w-md md:max-w-3xl lg:max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b">
          <FiArrowLeft className="text-xl" />
          <h3 className="font-semibold">CART</h3>
          <FaRegHeart className="text-xl" />
        </div>

        {/* ITEMS */}
        {items.map((item) => (
          <div key={item.id} className="flex p-4 gap-4 border-b">
            <img
              src={item.image || "https://via.placeholder.com/80"}
              className="w-20 h-24 object-cover"
            />

            <div className="flex-1">
              <h2 className="text-sm font-medium">{item.name}</h2>

              <p className="text-xs text-gray-500">
                {item.size} | {item.color}
              </p>

              {/* QTY */}
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() =>
                    updateQuantity(item.id, item.quantity - 1)
                  }
                  className="px-2 border"
                >
                  -
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() =>
                    updateQuantity(item.id, item.quantity + 1)
                  }
                  className="px-2 border"
                >
                  +
                </button>
              </div>

              {/* PRICE */}
              <p className="font-semibold mt-2">
                ₹{item.price * item.quantity}
              </p>

              {/* ACTIONS */}
              <div className="flex gap-4 mt-2 text-xs">
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500"
                >
                  REMOVE
                </button>

                <button className="text-gray-600">
                  MOVE TO WISHLIST
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* EMPTY */}
        {items.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            Your cart is empty
          </div>
        )}

        {/* LOGIN */}
        <div className="p-4 border-b text-sm text-gray-600">
          Login to view Coupons and Gift Cards
        </div>

        {/* PRICE */}
        <div className="p-4 border-b">
          <h2 className="font-semibold mb-3">PRICE DETAILS</h2>

          <div className="flex justify-between text-sm">
            <span>Total MRP</span>
            <span>₹{total}</span>
          </div>

          <div className="flex justify-between text-sm mt-1">
            <span>Coupon Discount</span>
            <span>- ₹0</span>
          </div>

          <div className="flex justify-between font-semibold mt-3">
            <span>Grand Total</span>
            <span>₹{total}</span>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="p-4 space-y-3">
          <button className="w-full border py-3 font-semibold">
            STEAL DEALS
          </button>

          <button className="w-full bg-black text-white py-3 font-semibold">
            PAY ₹{total}
          </button>
        </div>

      </div>
    </div>
  );
}