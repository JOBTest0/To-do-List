import React, { useState, useEffect } from "react";
import TaskForm from "../components/TaksForm";
import TaskItem from "../components/TaksItem";
import Header from '../components/Header'
import ToggleThemes from '../components/ToggleThemes'
import { fetchTodos, addTodo, updateTodo, deleteTodo } from "../utils/api";

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const token = localStorage.getItem("token"); // จำเป็นต้องมี token

  // โหลดรายการงานเมื่อ Component เริ่มต้น
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTodos(token);
        setTasks(data);
      } catch (error) {
        console.error(error.message);
      }
    };
    loadTasks();
  }, [token]);

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        // อัปเดตงาน
        const updatedTask = await updateTodo(editingTask._id, taskData, token);
        setTasks(tasks.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
        setEditingTask(null);
      } else {
        // เพิ่มงานใหม่
        const newTask = await addTodo(taskData, token);
        setTasks([...tasks, newTask]);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTodo(id, token);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <section className="todo-app h-screen p-8 mx-auto max-w-6xl">
    <Header />
    <ToggleThemes />
  
    <h2 className="text-3xl font-bold text-center mb-8">My To-Do List</h2>
  
    <div className="max-w-md mx-auto mb-8">
      <TaskForm onSaveTask={handleSaveTask} editingTask={editingTask} />
    </div>
  
    <ul className="task-list flex flex-col gap-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onEdit={handleEditTask} // เชื่อมกับฟังก์ชัน handleEditTask
          onDelete={handleDeleteTask} // เชื่อมกับฟังก์ชัน handleDeleteTask
        />
      ))}
    </ul>
  </section>
  

  );
};

export default Todo;
