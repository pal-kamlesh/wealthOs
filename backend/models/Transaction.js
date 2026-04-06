import mongoose from "mongoose";
import crypto from "crypto";

const transactionSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    amount: { 
      type: Number, 
      required: true,
      min: 0 
    },
    type: { 
      type: String, 
      enum: ["credit", "debit"],
      required: true 
    },
    merchant: { 
      type: String, 
      required: true,
      trim: true 
    },
    channel: { 
      type: String, 
      default: "UPI",
      enum: ["UPI", "SMS", "NEFT", "IMPS", "RTGS", "OTHER"]
    },
    date: { 
      type: Date, 
      required: true 
    },
    timestamp: { 
      type: Number, 
      required: true 
    },
    smsHash: { 
      type: String,
      unique: true,
      sparse: true,
      index: true
    },
    category: {
      type: String,
      default: "SMS Transaction"
    },
    duplicateCheckHash: {
      type: String,
      index: true
    }
  },
  { timestamps: true }
);

// Generate duplicate check hash (amount + merchant + date)
transactionSchema.pre('save', function(next) {
  if (this.isNew) {
    const stringToHash = `${this.amount}-${this.merchant}-${Math.floor(this.timestamp / 60000)}`;
    this.duplicateCheckHash = crypto
      .createHash('sha256')
      .update(stringToHash)
      .digest('hex');
  }
  next();
});

// Index for faster queries
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ duplicateCheckHash: 1, userId: 1 });

export default mongoose.model("Transaction", transactionSchema);
