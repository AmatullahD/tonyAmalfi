import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="w-full bg-[#f5f5f5] text-gray-700 px-6 py-10">
      <div className="max-w-7xl mx-auto">

        {/* SOCIAL */}
        <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#f5f5f5" }}>

          {/* FOLLOW US */}
          <div style={{ marginBottom: "20px" }}>
            <p style={{ fontSize: "18px", marginBottom: "10px", color: "#0f0d0d", fontWeight: "bolder" }}>
              Follow Us:
            </p>

            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "15px"
            }}>

              {/* Facebook */}
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <div style={{
                  backgroundColor: "#1877F2",
                  color: "white",
                  borderRadius: "50%",
                  width: "42px",
                  height: "42px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <FaFacebook />
                </div>
              </a>

              {/* Instagram */}
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <div style={{
                  backgroundColor: "#E1306C",
                  color: "white",
                  borderRadius: "50%",
                  width: "42px",
                  height: "42px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <FaInstagram />
                </div>
              </a>

              {/* Youtube */}
              <div style={{
                backgroundColor: "#fc5b10",
                color: "white",
                borderRadius: "50%",
                width: "42px",
                height: "42px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold"
              }}>
                <FaYoutube />
              </div>

              {/* X */}
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <div style={{
                  backgroundColor: "black",
                  color: "white",
                  borderRadius: "50%",
                  width: "42px",
                  height: "42px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <FaXTwitter />
                </div>
              </a>

            </div>
          </div>

          {/* EMAIL SUBSCRIBE */}
          <div style={{ marginBottom: "25px" }}>
            <p style={{
              fontSize: "18px",
              marginBottom: "10px",
              color: "#0f0d0d",
              fontWeight: "bolder"
            }}>
              Subscribe to our emails
            </p>

            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap"
            }}>

              <input
                type="email"
                placeholder="Enter your email"
                style={{
                  padding: "10px 14px",
                  width: "260px",
                  maxWidth: "100%",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  outline: "none",
                  fontSize: "14px"
                }}
              />

              <button
                style={{
                  padding: "10px 18px",
                  backgroundColor: "black",
                  color: "white",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                Subscribe
              </button>

            </div>
          </div>

          {/* PAYMENTS */}
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <p
              style={{
                fontSize: "18px",
                marginBottom: "12px",
                color: "#0f0d0d",
                fontWeight: "600",
                letterSpacing: "0.5px"
              }}
            >
              100% Secure Payment
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "nowrap",
                gap: "18px",
                alignItems: "center"
              }}
            >
              <img src="/razorpay-logo.png" style={{ height: "26px" }} />
              <img src="/phonepe-logo.png" style={{ height: "26px" }} />
              <img src="/gpay-logo.png" style={{ height: "26px" }} />
              <img src="/mastercard-logo.jpg" style={{ height: "26px" }} />
              <img src="/paytm-logo.jpg" style={{ height: "26px" }} />
              <img src="/cred-logo.png" style={{ height: "26px" }} />
            </div>
          </div>

          {/* SHIPPING PARTNERS */}
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <p
              style={{
                fontSize: "18px",
                marginBottom: "12px",
                color: "#0f0d0d",
                fontWeight: "600",
                letterSpacing: "0.5px"
              }}
            >
              Shipping Partners
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: "20px",
                alignItems: "center"
              }}
            >
              <img src="/dtdc-logo.jpg" style={{ height: "30px" }} />
              <img src="/delhivery-logo.png" style={{ height: "30px" }} />
              <img src="/fedex-logo.png" style={{ height: "30px" }} />
              <img src="/bluedart-logo.png" style={{ height: "30px" }} />
            </div>
          </div>

        </div>

      </div>


      {/* BLACK FOOTER SECTION */}
      <div className="bg-black text-white mt-10">
        <div className="max-w-7xl mx-auto px-6 py-12">

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">

            {/* CUSTOMER CARE */}
            <div>
              <h3 className="text-sm font-semibold tracking-widest mb-4 uppercase text-gray-300">
                Customer Care
              </h3>

              <ul className="space-y-2 text-sm text-gray-400">
                <li>FAQ</li>
                <li>Shipping</li>
                <li>Returns</li>
                <li>Contact Us</li>
              </ul>
            </div>

            {/* OUR COMPANY */}
            <div>
              <h3 className="text-sm font-semibold tracking-widest mb-4 uppercase text-gray-300">
                Our Company
              </h3>

              <ul className="space-y-2 text-sm text-gray-400">
                <li>About Tony Amalfi</li>
                <li>Brand</li>
              </ul>
            </div>

            {/* LEGAL */}
            <div>
              <h3 className="text-sm font-semibold tracking-widest mb-4 uppercase text-gray-300">
                Legal
              </h3>

              <ul className="space-y-2 text-sm text-gray-400">
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
              </ul>
            </div>

          </div>

          {/* FINAL COPYRIGHT */}
          <div className="border-t border-gray-800 mt-10 pt-5 text-center text-xs text-gray-500">
            © 2026 Tony Amalfi. All rights reserved.
          </div>

        </div>
      </div>


    </footer>
  );
}