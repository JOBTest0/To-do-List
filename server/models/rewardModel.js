import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true, // User ที่ได้รับรางวัล
        },
        todoID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Todo",
            required: true, // งานที่ได้รับรางวัล
        },
        coins: {
            type: Number,
            required: true, // จำนวน Coins ที่ได้รับ
        },
        createdAt: {
            type: Date,
            default: Date.now, // วันที่ได้รับรางวัล
        },
    },
    {
        timestamps: true, // เพิ่ม createdAt, updatedAt
    }
);

// สร้าง Model
const Reward = mongoose.model("Reward", rewardSchema);

export default Reward;
