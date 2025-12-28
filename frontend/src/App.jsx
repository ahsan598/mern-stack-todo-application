import React, { useState, useEffect } from "react";
import { Paper, TextField, Checkbox, Button } from "@mui/material";
import "./App.css";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [currentTask, setCurrentTask] = useState("");

    // Load tasks on mount
    useEffect(() => {
        getTasks();
    }, []);

    const getTasks = async () => {
        try {
            const { data } = await axios.get(apiUrl);
            setTasks(data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {
        setCurrentTask(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(apiUrl, { task: currentTask });
            setTasks((prev) => [...prev, data]);
            setCurrentTask("");
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdate = async (currentTask) => {
        const originalTasks = [...tasks];
        try {
            const tasksCopy = [...tasks];
            const index = tasksCopy.findIndex((task) => task._id === currentTask);
            tasksCopy[index] = { ...tasksCopy[index] };
            tasksCopy[index].completed = !tasksCopy[index].completed;
            setTasks(tasksCopy);
            
            await axios.put(`${apiUrl}/${currentTask}`, {
                completed: tasksCopy[index].completed,
            });
        } catch (error) {
            setTasks(originalTasks);
            console.log(error);
        }
    };

    const handleDelete = async (currentTask) => {
        const originalTasks = [...tasks];
        try {
            const tasksCopy = tasks.filter((task) => task._id !== currentTask);
            setTasks(tasksCopy);
            await axios.delete(`${apiUrl}/${currentTask}`);
        } catch (error) {
            setTasks(originalTasks);
            console.log(error);
        }
    };

    return (
        <div className="App flex">
            <Paper elevation={3} className="container">
                <div className="heading">TO-DO</div>
                <form
                    onSubmit={handleSubmit}
                    className="flex"
                    style={{ margin: "15px 0" }}
                >
                    <TextField
                        variant="outlined"
                        size="small"
                        style={{ width: "80%" }}
                        value={currentTask}
                        required={true}
                        onChange={handleChange}
                        placeholder="Add New TO-DO"
                    />
                    <Button
                        className="add-task-btn"
                        color="primary"
                        variant="contained"
                        type="submit"
                    >
                        Add task
                    </Button>
                </form>
                <div>
                    {tasks.map((task) => (
                        <Paper
                            key={task._id}
                            className="flex task_container"
                        >
                            <Checkbox
                                checked={task.completed}
                                onClick={() => handleUpdate(task._id)}
                                color="primary"
                            />
                            <div
                                className={
                                    task.completed
                                        ? "task line_through"
                                        : "task"
                                }
                            >
                                {task.task}
                            </div>
                            <Button
                                onClick={() => handleDelete(task._id)}
                                color="secondary"
                            >
                                delete
                            </Button>
                        </Paper>
                    ))}
                </div>
            </Paper>
        </div>
    );
};

export default App;
