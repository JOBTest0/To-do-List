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
    const id = req.params.id;
    const { title, isCompleted, priority } = req.body;

    if (!title && isCompleted === undefined && !priority) {
        return next(createError(400, "Missing fields!"));
    }

    try {
        await connectToDB();
        const todo = await Todo.findById(id);

        if (!todo) return next(createError(404, "Todo not found!"));
        if (todo.userID.toString() !== req.user.id)
            return next(createError(403, "Not authorized!"));

        todo.title = title || todo.title;
        if (isCompleted !== undefined) {
            todo.isCompleted = isCompleted;
        }
        todo.priority = priority || todo.priority;

        await todo.save();
        res.status(200).json({ message: "Todo updated!", todo });
    } catch (error) {
        next(createError(500, "Failed to update todo."));
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
    console.log("Incoming Data:", req.body); // Debug: ตรวจสอบข้อมูลที่ส่งมา
    const { title, priority } = req.body;

    if (!title) {
        return next(createError(400, "Title is required"));
    }

    try {
        const newTodo = new Todo({
            title,
            priority: priority || "Low", // ตั้งค่าค่าเริ่มต้นหากไม่ได้ส่งมา
            userID: req.user.id, // ตรวจสอบว่า req.user.id มีค่า
        });
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        console.error("Error in addTodo:", error.message); // Debug: Log Error
        next(createError(500, "Failed to create the Todo"));
    }
}


