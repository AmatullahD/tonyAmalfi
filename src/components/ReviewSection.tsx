"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";

export default function ReviewSection() {
  const [rating, setRating] = useState(5);

  return (
    <div className="w-full bg-white mt-10 border-t pt-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">

        {/* TOP SUMMARY */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          {/* LEFT - AVG RATING */}
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold">5.0</div>
            <div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-gray-500">Based on 0 reviews</p>
            </div>
          </div>

          {/* WRITE REVIEW BUTTON */}
          <button className="bg-[#6b1d1d] text-white px-6 py-2 rounded-md hover:opacity-90 transition">
            Write a review
          </button>
        </div>

        {/* REVIEW STEPS */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-8">

          {/* STEP 1 - RATE */}
          <div className="border rounded-lg p-4 text-center shadow-sm">
            <p className="font-medium mb-3">How would you rate this product?</p>

            <div className="flex justify-center gap-1">
              {[1,2,3,4,5].map((star) => (
                <Star
                  key={star}
                  size={22}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer ${
                    star <= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* STEP 2 - UPLOAD */}
          <div className="border rounded-lg p-4 text-center shadow-sm">
            <p className="font-medium mb-3">Upload a photo or video</p>

            <button className="border px-4 py-2 rounded-md text-sm hover:bg-gray-100">
              Click to add photo
            </button>
          </div>

          {/* STEP 3 - REVIEW TEXT */}
          <div className="border rounded-lg p-4 shadow-sm">
            <p className="font-medium mb-2">Share your experience</p>

            <textarea
              placeholder="Write your review here..."
              className="w-full border rounded-md p-2 text-sm focus:outline-none"
              rows={3}
            />
          </div>

          {/* STEP 4 - LOCATION */}
          <div className="border rounded-lg p-4 shadow-sm">
            <p className="font-medium mb-2">Location</p>

            <input
              type="text"
              placeholder="Enter your location"
              className="w-full border rounded-md p-2 text-sm focus:outline-none"
            />

            <button className="mt-2 w-full bg-black text-white py-2 rounded-md text-sm">
              Next
            </button>
          </div>

          {/* STEP 5 - PREVIEW */}
          <div className="border rounded-lg p-4 shadow-sm text-center">
            <p className="font-medium mb-3">Preview</p>

            <div className="w-full h-24 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-sm">
              Image Preview
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}