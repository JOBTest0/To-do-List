import { connectToDB } from "../utils/connect.js";
import { createError } from "../utils/error.js";
import Todo from "../models/todoModel.js";

export async function getAllTodos(req, res, next) {
    await connectToDB();
    try {
        const todos = await Todo.find({ userID: req.user.id });
        res.status(200).send(todos);
    } catch (error) {
        next(createError(500, "Failed to fetch todos."));
    }
}


export async function getTodo(req, res, next) {
    try {
        await connectToDB();
        const todo = await Todo.findById(req.params.id);
        if (!todo) return next(createError(404, "Todo not found!"))
        if (todo.userID.toString() !== req.user.id) return next(createError(404, "Not athorized!"))
        res.status(200).send(todo);

    } catch (error) {
        next(createError(404, "Todo not found!"))
    }

}

export async function updateTodo(req, res, next) {
    const { title, isCompleted, priority } = req.body;
    const id = req.params.id;

    try {
        await connectToDB();

        // ค้นหา Todo ก่อนอัปเดต
        const todo = await Todo.findById(id);

        if (!todo) {
            return res.status(404).json({ error: "Todo not found" });
        }

        // ตรวจสอบว่า User มีสิทธิ์ใน Todo นี้หรือไม่
        if (todo.userID.toString() !== req.user.id) {
            return res.status(403).json({ error: "Not authorized" });
        }

        // อัปเดตฟิลด์ Title, isCompleted และ Priority
        todo.title = title || todo.title;
        todo.isCompleted = isCompleted !== undefined ? isCompleted : todo.isCompleted;

        // อัปเดต isRewarded อัตโนมัติเมื่อ isCompleted เป็น true
        if (todo.isCompleted && !todo.isRewarded) {
            todo.isRewarded = true;

            // คำนวณ Coin ใหม่ตาม Priority
            switch (priority || todo.priority) {
                case "Low":
                    todo.reward.coins = 3;
                    break;
                case "Medium":
                    todo.reward.coins = 5;
                    break;
                case "High":
                    todo.reward.coins = 10;
                    break;
                default:
                    todo.reward.coins = 0;
            }
        }

        // หาก Priority เปลี่ยน ให้ปรับ Coins
        if (priority && priority !== todo.priority) {
            todo.priority = priority;

            // อัปเดต Coins ตาม Priority ใหม่
            switch (priority) {
                case "Low":
                    todo.reward.coins = 3;
                    break;
                case "Medium":
                    todo.reward.coins = 5;
                    break;
                case "High":
                    todo.reward.coins = 10;
                    break;
                default:
                    todo.reward.coins = 0;
            }
        }

        // บันทึกข้อมูลหลังจากอัปเดต
        const updatedTodo = await todo.save();

        res.status(200).json(updatedTodo);
    } catch (error) {
        next(error);
    }
}





export async function deleteTodo(req, res, next) {
    try {
        await connectToDB()
        const todo = await Todo.deleteOne({
            _id: req.params.id,
            userID: req.user.id,
        });
        if (!todo.deletedCount) return next(createError(404, "Title is required"))
        res.status(200).json({ message: "Todo deleted!" });
    } catch (error) {
        return next(createError(404, "Todo not found!"))
    }
}

export async function addTodo(req, res, next) {
    const { title, priority } = req.body;

    if (!title) {
        return next(createError(400, "Title is required"));
    }

    try {
        await connectToDB()
        let coins = 0;

        // คำนวณจำนวน Coin ตาม Priority
        switch (priority) {
            case "Low":
                coins = 3;
                break;
            case "Medium":
                coins = 5;
                break;
            case "High":
                coins = 10;
                break;
        }

        const newTodo = new Todo({
            title,
            priority: priority || "Low", // ตั้งค่าค่าเริ่มต้นหากไม่ได้ส่งมา
            userID: req.user.id, // ตรวจสอบว่า req.user.id มีค่า
            reward: { coins }, // เพิ่ม Coin ให้ Task
        });

        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        console.error("Error in addTodo:", error.message); // Debug: Log Error
        next(createError(500, "Failed to create the Todo"));
    }
}


export async function rewardUser(req, res, next) {
    const userId = req.user.id;

    try {
        // ค้นหางานที่เสร็จสมบูรณ์แต่ยังไม่ได้รับรางวัล
        const completedTasks = await Todo.find({
            userID: userId,
            isCompleted: true,
            isRewarded: false,
        });

        if (completedTasks.length === 0) {
            return res.status(200).json({ message: "No rewards to give" });
        }

        let totalCoins = 0;

        // อัปเดตสถานะงานที่ได้รับรางวัล และคำนวณ Coin
        for (const task of completedTasks) {
            let coins = 0;

            // คำนวณจำนวน Coin ตาม Priority
            switch (task.priority) {
                case "Low":
                    coins = 3;
                    break;
                case "Medium":
                    coins = 5;
                    break;
                case "High":
                    coins = 10;
                    break;
            }

            // เพิ่ม Coin ให้กับ Task
            task.isRewarded = true;
            task.reward.coins = coins;
            totalCoins += coins;
            await task.save();
        }

        // ส่งข้อความแจ้งผล
        res.status(200).json({
            message: `You have received ${totalCoins} coins for ${completedTasks.length} tasks!`,
            totalCoins,
        });
    } catch (error) {
        next(createError(500, "Failed to reward user"));
    }
}


export async function getCompletedTasks(req, res, next) {
  
    await connectToDB();
    try {
        const completedTasks = await Todo.find({ 
            userID: req.user.id,
            isCompleted: true
        });

        res.status(200).json(completedTasks);
    } catch (error) {
        next(createError(500, "Failed to fetch completed tasks"));
    }
}


