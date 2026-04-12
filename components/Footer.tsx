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

          {/* PAYMENTS */}
          <div style={{ marginBottom: "20px" }}>
            <p style={{ fontSize: "18px", marginBottom: "10px", color: "#0f0d0d", fontWeight: "bolder" }}>
              100% Secure Payment:
            </p>

            <div style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "12px",
              fontSize: "15px",
              color: "#333",
              fontWeight: "500",
              fontStyle: "italic"
            }}>
              <span>RazorPay</span>
              <span>PhonePay</span>
              <span>Google Pay</span>
              <span>Master Card</span>
              <span>Paytm</span>
              <span>CRED</span>
            </div>
          </div>

          {/* SHIPPING PARTNERS */}
          <div style={{ marginBottom: "15px" }}>
            <p style={{ fontSize: "18px", marginBottom: "10px", color: "#0f0d0d", fontWeight: "bolder" }}>
              Shipping Partners:
            </p>

            <div style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "15px",
              fontSize: "13px",
              fontWeight: "500"
            }}>
              <span>DTDC</span>
              <span>Delhivery</span>
              <span>Ecom Express</span>
              <span>XpressBees</span>
            </div>
          </div>

          {/* FOOTER */}
          <p style={{ fontSize: "13px", color: "#555" }}>
            © TONY AMALFI
          </p>

        </div>

      </div>


      {/* BOTTOM */}
      <div className="mt-10 border-t pt-5 text-center text-sm">
        © 2026 Tony Amalfi. All rights reserved.
      </div>


    </footer>
  );
}