const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      firstName: { type: String, required: true, default: "John" },
      lastName: { type: String, required: true, default: "Doe" },
      email: { type: String, required: true, default: "john@example.com" },
      phone: { type: String, required: true, default: "1234567890" },
      shippingAddress: {
        country: { type: String, required: true, default: "United States" },
        streetAddress: {
          type: String,
          required: true,
          default: "1234 Main St",
        },
        apartment: { type: String, default: "" },
        city: { type: String, required: true, default: "New York" },
        postcode: { type: String, required: true, default: "10001" },
      },
    },
    orderDetails: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    paymentMethod: { type: String, required: true }, // e.g., "Cash on Delivery"
    paymentStatus: { type: String, default: "Pending" }, // Pending, Paid, etc.
    delivery: {
      deliveryTime: { type: Date },
      deliveryStatus: { type: String, default: "Pending" }, // Pending, Shipped, Delivered
    },
    approvalStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    }, // For Admin Approval
    subscriptionPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
      required: false, // Optional, only required if this is a package order
    }, // Reference to subscription plan
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
