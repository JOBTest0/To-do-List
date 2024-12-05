import Reward from "../models/rewardModel.js";
import Todo from "../models/todoModel.js";


export async function calculateTotalCoins(req, res, next) {
    const userId = req.user.id;

    try {
        // ดึง Tasks ที่ได้รับรางวัลแล้ว
        const rewardedTasks = await Todo.find({
            userID: userId,
            isCompleted: true,
            isRewarded: true,
        });

        // คำนวณ Coins รวม
        const totalCoins = rewardedTasks.reduce((sum, task) => sum + task.reward.coins, 0);

        res.status(200).json({
            message: "Total coins calculated successfully.",
            totalCoins,
        });
    } catch (error) {
        next(createError(500, "Failed to calculate total coins"));
    }
}
