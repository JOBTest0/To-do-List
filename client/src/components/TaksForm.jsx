import React, { useState, useEffect } from "react";

const TaskForm = ({ onSaveTask, editingTask }) => {
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
  });

  // เติมข้อมูลเดิมลงในฟอร์มเมื่อแก้ไขงาน
  useEffect(() => {
    if (editingTask) {
      setTaskData(editingTask);
    }
  }, [editingTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveTask(taskData); // ส่งข้อมูลกลับไปยัง Parent Component
    setTaskData({ title: "", description: "", priority: "Low" }); // รีเซ็ตฟอร์ม
  };

  return (
    <form onSubmit={handleSubmit} className="form space-y-4">
      {/* Input Title */}
      <input
        type="text"
        name="title"
        value={taskData.title}
        onChange={handleChange}
        placeholder="Task Title"
        className="input input-bordered w-full"
        required
      />


      <select
        name="priority"
        value={taskData.priority}
        onChange={handleChange}
        className="select select-bordered w-full"
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      {/* Submit Button */}
      <button type="submit" className="btn btn-primary w-full">
        {editingTask ? "Update Task" : "Add Task"}
      </button>
    </form>
  );
};

export default TaskForm;
