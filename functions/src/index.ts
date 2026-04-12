import { onRequest } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import Razorpay from "razorpay";
import * as crypto from "crypto";
import cors from "cors";
import * as functions from "firebase-functions";


// Load environment variables in emulator
if (process.env.FUNCTIONS_EMULATOR === 'true') {
  try {
    require('dotenv').config();
    console.log("[Firebase Function] dotenv loaded for emulator");
  } catch (e) {
    console.log("[Firebase Function] dotenv not available");
  }
}

// With this:
const razorpayKeyId = process.env.RAZORPAY_KEY_ID || functions.config().razorpay?.key_id;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || functions.config().razorpay?.key_secret;


// Initialize CORS handler
const corsHandler = cors({ origin: true });

// Initialize Firebase Admin
initializeApp();
const db = getFirestore();

// Helper to get secret value (supports both emulator and production)
function getSecretValue(secret: any, envVarName: string): string | undefined {
  // Try to get from secret (production)
  try {
    const value = secret.value();
    if (value) return value;
  } catch (e) {
    // Secret not available (likely in emulator)
  }
  
  // Fall back to environment variable (emulator)
  return process.env[envVarName];
}

/**
 * Create Razorpay Order
 */
export const createRazorpayOrder = onRequest(
  {
    timeoutSeconds: 60,
    memory: "256MiB",
  },
  async (req, res) => {
    return corsHandler(req, res, async () => {
      // Only allow POST requests
      if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
      }

      try {
        console.log("[Firebase Function] Create order endpoint called");

        const { amount, currency = "INR", userId, items, shippingAddress } = req.body;

        // Validate required fields
        if (!amount || !userId) {
          console.error("[Firebase Function] Missing required fields:", { amount, userId });
          res.status(400).json({ error: "Missing required fields" });
          return;
        }

        if (!items || items.length === 0) {
          console.error("[Firebase Function] Cart is empty");
          res.status(400).json({ error: "Cart is empty" });
          return;
        }

        // NEW: Validate stock availability for all items BEFORE creating order
        console.log("[Firebase Function] Validating stock for", items.length, "items");
        for (const item of items) {
          try {
            // Parse product ID and size from cart item ID
            // Format: productId-color-size
            const idParts = item.id.split("-");
            const productId = idParts[0];
            const size = idParts[idParts.length - 1];

            console.log(`[Firebase Function] Checking stock for ${item.name} (Product: ${productId}, Size: ${size})`);

            const productDoc = await db.collection("products").doc(productId).get();

            if (!productDoc.exists) {
              console.error(`[Firebase Function] Product ${productId} not found`);
              res.status(400).json({ error: `Product ${item.name} not found` });
              return;
            }

            const productData = productDoc.data();
            const sizeDetails = productData?.sizeDetails || [];
            const sizeDetail = sizeDetails.find((s: any) => s.size === size);

            if (!sizeDetail) {
              console.error(`[Firebase Function] Size ${size} not found for product ${productId}`);
              res.status(400).json({ error: `Size ${size} not available for ${item.name}` });
              return;
            }

            if (sizeDetail.quantity < item.quantity) {
              console.error(
                `[Firebase Function] Insufficient stock for ${item.name}. Available: ${sizeDetail.quantity}, Requested: ${item.quantity}`
              );
              res.status(400).json({
                error: `Insufficient stock for ${item.name} (Size: ${size}). Available: ${sizeDetail.quantity}, Requested: ${item.quantity}`,
              });
              return;
            }

            console.log(
              `[Firebase Function] Stock validated for ${item.name}: ${sizeDetail.quantity} available, ${item.quantity} requested`
            );
          } catch (itemError) {
            console.error(`[Firebase Function] Error validating item ${item.id}:`, itemError);
            res.status(500).json({ error: `Error validating ${item.name}` });
            return;
          }
        }

        console.log("[Firebase Function] All items validated successfully");

        // Get credentials (works in both emulator and production)
        const keyId = getSecretValue(razorpayKeyId, "RAZORPAY_KEY_ID");
        const keySecret = getSecretValue(razorpayKeySecret, "RAZORPAY_KEY_SECRET");

        console.log("[Firebase Function] Credentials check:", {
          hasKeyId: !!keyId,
          hasKeySecret: !!keySecret,
          keyIdPrefix: keyId ? keyId.substring(0, 8) : "missing"
        });

        if (!keyId || !keySecret) {
          console.error("[Firebase Function] Razorpay credentials not configured");
          res.status(500).json({
            error: "Payment gateway not configured. Please contact support.",
          });
          return;
        }

        console.log("[Firebase Function] Initializing Razorpay with key:", keyId.substring(0, 10) + "...");

        // Initialize Razorpay
        const razorpay = new Razorpay({
          key_id: keyId,
          key_secret: keySecret,
        });

        // Create Razorpay order
        console.log("[Firebase Function] Creating Razorpay order for amount:", amount);
        const razorpayOrder = await razorpay.orders.create({
          amount: Math.round(amount * 100), // Convert to paise
          currency,
          receipt: `rcpt_${Date.now()}`,
          notes: {
            userId,
            customerName: shippingAddress?.name || "N/A",
          },
        });

        console.log("[Firebase Function] Razorpay order created:", razorpayOrder.id);

        // Create order document in Firestore
        console.log("[Firebase Function] Creating order document in Firestore...");
        const orderRef = await db.collection("orders").add({
          userId,
          items,
          totalAmount: amount,
          currency,
          status: "created",
          payment: {
            razorpayOrderId: razorpayOrder.id,
            status: "created",
            createdAt: FieldValue.serverTimestamp(),
          },
          shippingAddress: shippingAddress || {},
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });

        console.log("[Firebase Function] Order document created:", orderRef.id);

        res.status(200).json({
          orderId: orderRef.id,
          razorpayOrderId: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          keyId: keyId,
        });
      } catch (error) {
        const err = error as Error;
        console.error("[Firebase Function] Error creating order:", err);
        console.error("[Firebase Function] Error stack:", err.stack);

        res.status(500).json({
          error: err.message || "Failed to create order",
          details: process.env.NODE_ENV === "development" ? err.stack : undefined,
        });
      }
    });
  }
);

/**
 * Verify Razorpay Payment
 * NEW: Now includes stock reduction logic
 */
export const verifyRazorpayPayment = onRequest(
  {
    timeoutSeconds: 60,
    memory: "256MiB",
  },
  async (req, res) => {
    return corsHandler(req, res, async () => {
      // Only allow POST requests
      if (req.method !== "POST") {
        console.log("❌ Invalid method:", req.method);
        res.status(405).json({ error: "Method not allowed" });
        return;
      }

      try {
        console.log("🔍 Starting payment verification...");
        const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

        console.log("📋 Verification data:", {
          orderId,
          razorpayOrderId,
          paymentId: razorpayPaymentId,
          hasSignature: !!razorpaySignature,
        });

        // Validate required fields
        if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
          console.error("[Firebase Function] Missing required fields for verification");
          res.status(400).json({ error: "Missing required fields" });
          return;
        }

        // Get secret (works in both emulator and production)
        const keySecret = getSecretValue(razorpayKeySecret, "RAZORPAY_KEY_SECRET");

        if (!keySecret) {
          console.error("[Firebase Function] Razorpay key secret not configured");
          res.status(500).json({
            error: "Payment gateway not configured. Please contact support.",
          });
          return;
        }

        // Verify signature
        const body = razorpayOrderId + "|" + razorpayPaymentId;
        const expectedSignature = crypto
          .createHmac("sha256", keySecret)
          .update(body.toString())
          .digest("hex");

        console.log("🔐 Signature verification:", {
          provided: razorpaySignature.substring(0, 10) + "...",
          expected: expectedSignature.substring(0, 10) + "...",
          matches: expectedSignature === razorpaySignature,
        });

        if (expectedSignature !== razorpaySignature) {
          console.error("[Firebase Function] Invalid signature");
          res.status(400).json({ error: "Invalid signature" });
          return;
        }

        console.log("✅ Signature verified successfully");

        // Get order data
        const orderDoc = await db.collection("orders").doc(orderId).get();
        if (!orderDoc.exists) {
          console.error("[Firebase Function] Order not found:", orderId);
          res.status(404).json({ error: "Order not found" });
          return;
        }

        const orderData = orderDoc.data();
        console.log(`[Firebase Function] Processing ${orderData?.items?.length || 0} items for stock reduction`);

        // NEW: Reduce stock for all items using Firestore batch
        const batch = db.batch();
        let stockUpdateErrors: string[] = [];

        for (const item of orderData?.items || []) {
          try {
            // Parse product ID and size from cart item ID
            const idParts = item.id.split("-");
            const productId = idParts[0];
            const size = idParts[idParts.length - 1];

            console.log(`[Firebase Function] Reducing stock for ${item.name} (Product: ${productId}, Size: ${size}, Qty: ${item.quantity})`);

            const productRef = db.collection("products").doc(productId);
            const productDoc = await productRef.get();

            if (!productDoc.exists) {
              const errorMsg = `Product ${productId} not found`;
              console.error(`[Firebase Function] ${errorMsg}`);
              stockUpdateErrors.push(errorMsg);
              continue;
            }

            const productData = productDoc.data();
            const sizeDetails = productData?.sizeDetails || [];
            const sizeIndex = sizeDetails.findIndex((s: any) => s.size === size);

            if (sizeIndex === -1) {
              const errorMsg = `Size ${size} not found for product ${productId}`;
              console.error(`[Firebase Function] ${errorMsg}`);
              stockUpdateErrors.push(errorMsg);
              continue;
            }

            // Check stock availability (shouldn't happen if validation worked, but just in case)
            if (sizeDetails[sizeIndex].quantity < item.quantity) {
              const errorMsg = `Insufficient stock for ${item.name} (Size: ${size}). Available: ${sizeDetails[sizeIndex].quantity}, Requested: ${item.quantity}`;
              console.error(`[Firebase Function] ${errorMsg}`);
              stockUpdateErrors.push(errorMsg);
              // Continue anyway to reduce what we can
            }

            // Reduce the quantity
            const oldQuantity = sizeDetails[sizeIndex].quantity;
            sizeDetails[sizeIndex].quantity = Math.max(0, oldQuantity - item.quantity);
            const newQuantity = sizeDetails[sizeIndex].quantity;

            // Calculate new total stock
            const totalStock = sizeDetails.reduce((sum: number, s: any) => sum + s.quantity, 0);

            // Add update to batch
            batch.update(productRef, {
              sizeDetails,
              stock: totalStock,
              updatedAt: FieldValue.serverTimestamp(),
            });

            console.log(
              `[Firebase Function] Stock updated for product ${productId}, size ${size}: ${oldQuantity} → ${newQuantity} (Total stock: ${totalStock})`
            );
          } catch (itemError) {
            const errorMsg = `Error processing item ${item.id}: ${itemError}`;
            console.error(`[Firebase Function] ${errorMsg}`);
            stockUpdateErrors.push(errorMsg);
            // Continue with other items
          }
        }

        // Update order status
        batch.update(db.collection("orders").doc(orderId), {
          status: "paid",
          "payment.razorpayPaymentId": razorpayPaymentId,
          "payment.signature": razorpaySignature,
          "payment.status": "paid",
          "payment.verifiedAt": FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });

        // Commit all updates atomically
        await batch.commit();

        console.log("[Firebase Function] Payment verified and stock reduced for order:", orderId);

        if (stockUpdateErrors.length > 0) {
          console.warn("[Firebase Function] Stock update warnings:", stockUpdateErrors);
        }

        res.status(200).json({ 
          success: true, 
          orderId,
          stockUpdateWarnings: stockUpdateErrors.length > 0 ? stockUpdateErrors : undefined
        });
      } catch (error) {
        const err = error as Error;
        console.error("[Firebase Function] Error verifying payment:", err);
        res.status(500).json({
          error: err.message || "Failed to verify payment",
        });
      }
    });
  }
);