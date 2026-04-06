import Transaction from "../models/Transaction.js";
import crypto from "crypto";

export const createTransaction = async (req, res) => {
  try {
    const { amount, type, merchant, channel, date, timestamp, smsHash } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!amount || !type || !merchant || !timestamp) {
      return res.status(400).json({ 
        message: "Missing required fields: amount, type, merchant, timestamp" 
      });
    }

    // Check for duplicate using smsHash
    if (smsHash) {
      const existing = await Transaction.findOne({ smsHash, userId });
      if (existing) {
        return res.status(409).json({ 
          message: "Duplicate transaction detected (SMS Hash match)" 
        });
      }
    }

    // Check for duplicate using amount + merchant + timestamp (within 1 minute)
    const timeWindow = 60000; // 1 minute
    const duplicateCheck = await Transaction.findOne({
      userId,
      amount,
      merchant: merchant.toLowerCase(),
      timestamp: {
        $gte: timestamp - timeWindow,
        $lte: timestamp + timeWindow
      }
    });

    if (duplicateCheck) {
      return res.status(409).json({ 
        message: "Duplicate transaction detected (Similar transaction within 1 minute)" 
      });
    }

    // Create new transaction
    const transaction = new Transaction({
      userId,
      amount: parseFloat(amount),
      type: type.toLowerCase(),
      merchant: merchant.trim(),
      channel: channel || "SMS",
      date: new Date(date || timestamp),
      timestamp,
      smsHash,
      category: "SMS Transaction"
    });

    const saved = await transaction.save();

    // Emit real-time event
    if (global.io) {
      global.io.emit("new_transaction", {
        userId,
        transaction: saved
      });
    }

    res.status(201).json(saved);
  } catch (err) {
    console.error("Transaction creation error:", err);
    res.status(400).json({ message: err.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = req.query.limit ? parseInt(req.query.limit) : 50;
    const skip = req.query.skip ? parseInt(req.query.skip) : 0;

    const transactions = await Transaction.find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Transaction.countDocuments({ userId });

    res.json({
      data: transactions,
      total,
      limit,
      skip
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const checkDuplicate = async (req, res) => {
  try {
    const { smsHash } = req.params;
    const userId = req.user.id;

    const existing = await Transaction.findOne({ 
      smsHash, 
      userId 
    });

    res.json({ 
      isDuplicate: !!existing,
      transaction: existing || null 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const batchCreateTransactions = async (req, res) => {
  try {
    const { transactions } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(transactions) || transactions.length === 0) {
      return res.status(400).json({ message: "Invalid transactions array" });
    }

    const results = {
      successful: [],
      failed: [],
      duplicates: []
    };

    for (const tx of transactions) {
      try {
        // Check duplicate by smsHash
        if (tx.smsHash) {
          const existing = await Transaction.findOne({ 
            smsHash: tx.smsHash, 
            userId 
          });
          if (existing) {
            results.duplicates.push({
              transaction: tx,
              reason: "SMS Hash match"
            });
            continue;
          }
        }

        // Create transaction
        const transaction = new Transaction({
          ...tx,
          userId,
          amount: parseFloat(tx.amount),
          type: tx.type.toLowerCase(),
          merchant: tx.merchant.trim()
        });

        const saved = await transaction.save();
        results.successful.push(saved);

        // Emit real-time event
        if (global.io) {
          global.io.emit("new_transaction", {
            userId,
            transaction: saved
          });
        }
      } catch (error) {
        results.failed.push({
          transaction: tx,
          error: error.message
        });
      }
    }

    res.status(201).json(results);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const transaction = await Transaction.findOneAndDelete({ 
      _id: id, 
      userId 
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Transaction deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
