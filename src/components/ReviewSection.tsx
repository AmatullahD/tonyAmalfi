"use client";

import React, { useState } from "react";
import { Star, X } from "lucide-react";

export default function ReviewSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");

  const closeModal = () => {
    setIsOpen(false);
    setStep(1);
  };

  return (
    <div className="w-full bg-white mt-10 border-t pt-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">

        {/* TOP */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Customer Reviews</h2>

          <button
            onClick={() => setIsOpen(true)}
            className="bg-[#6b1d1d] text-white px-6 py-2 rounded-md hover:opacity-90"
          >
            Write a review
          </button>
        </div>

        {/* MODAL */}
        {isOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white w-full max-w-md rounded-lg shadow-xl p-6 relative animate-in fade-in zoom-in-95 duration-200">

              {/* CLOSE */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-black"
              >
                <X />
              </button>

              {/* STEP 1 - RATING */}
              {step === 1 && (
                <>
                  <h2 className="text-lg font-semibold text-center mb-6">
                    How would you rate this product?
                  </h2>

                  <div className="flex justify-center gap-2 mb-6">
                    {[1,2,3,4,5].map((star) => (
                      <Star
                        key={star}
                        size={28}
                        onClick={() => setRating(star)}
                        className={`cursor-pointer ${
                          star <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className="w-full bg-[#6b1d1d] text-white py-2 rounded-md"
                  >
                    Next
                  </button>
                </>
              )}

              {/* STEP 2 - UPLOAD */}
              {step === 2 && (
                <>
                  <h2 className="text-lg font-semibold text-center mb-4">
                    Upload a photo or video
                  </h2>

                  <button className="w-full border py-3 rounded-md mb-4 hover:bg-gray-100">
                    + Click to add photo
                  </button>

                  <div className="flex justify-between">
                    <button onClick={() => setStep(1)}>Back</button>
                    <button
                      onClick={() => setStep(3)}
                      className="text-[#6b1d1d] font-semibold"
                    >
                      Skip →
                    </button>
                  </div>
                </>
              )}

              {/* STEP 3 - EXPERIENCE */}
              {step === 3 && (
                <>
                  <h2 className="text-lg font-semibold mb-4">
                    Share your experience
                  </h2>

                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Write your review..."
                    className="w-full border rounded-md p-2 mb-4"
                  />

                  <div className="flex justify-between">
                    <button onClick={() => setStep(2)}>Back</button>
                    <button
                      onClick={() => setStep(4)}
                      className="bg-[#6b1d1d] text-white px-4 py-2 rounded-md"
                    >
                      Next
                    </button>
                  </div>
                </>
              )}

              {/* STEP 4 - SUMMARY */}
              {step === 4 && (
                <>
                  <h2 className="text-lg font-semibold text-center mb-4">
                    Review Summary
                  </h2>

                  <div className="text-center mb-4">
                    <div className="flex justify-center mb-2">
                      {[...Array(rating)].map((_, i) => (
                        <Star key={i} className="fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>

                    <p className="text-sm text-gray-600">{review || "No review text added."}</p>
                  </div>

                  <div className="flex justify-between">
                    <button onClick={() => setStep(3)}>Back</button>
                    <button
                      onClick={closeModal}
                      className="bg-[#6b1d1d] text-white px-4 py-2 rounded-md"
                    >
                      Submit Review
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}