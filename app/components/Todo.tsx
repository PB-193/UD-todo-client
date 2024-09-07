import React, { useState } from "react";
import { TodoType } from "../types";
import { mutate } from "swr";
import useSWR from "swr";
import { useTodos } from "../hooks/useTodos";
import { API_URL } from "@/constants/url";

type TodoProps = {
    todo : TodoType;
}


const Todo = ({ todo }: TodoProps) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>(todo.title);
  const { todos, isLoading, error, mutate } = useTodos();


  const handleEdit = async () => {
    setEdit(!edit);
    if (edit) {
        const response =  await fetch(`${API_URL}editTodo/${todo.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: editTitle,
                isCompleted: todo.isCompleted,
            }),
        });

        if (response.ok) {
            const updatedTodo = await response.json();
            mutate([...todos, updatedTodo]);
            setEditTitle(updatedTodo.title);
        }
    }
  }

  const handleDelete = async () => {
    const response = await fetch(`${API_URL}deleteTodo/${todo.id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.ok) {
        const deletedTodo = await response.json();
        mutate(todos.filter((t: TodoType) => t.id !== deletedTodo.id), false);
    }
  }

  const togleTodoCompletion = async (id: number, isCompleted: boolean) => {
    const response =  await fetch(`${API_URL}editTodo/${todo.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            isCompleted: !todo.isCompleted, // ここでトグルしている。
        }),
    });

    if (response.ok) {
        const updatedTodo = await response.json();
        mutate([...todos, updatedTodo]);
        setEditTitle(updatedTodo.title);
    }
  }

  return (
    <div>   
      <li className="py-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center">
            <label className="flex items-center ml-3 block text-gray-900">
                <input
                    id="todo1"
                    name="todo1"
                    type="checkbox"
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500
                        border-gray-300 rounded"
                    onChange = {() => togleTodoCompletion(todo.id, todo.isCompleted)}
                />
                {edit ? (
                <input
                    type="text"
                    className="border rounded px-2 py-1"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    />
                ) : (
                <span className={`text-lg font-medium mr-2 ${
                    todo.isCompleted ? "line-through" : ""
                }`}>
                    {todo.title} 
                </span>
                )}
            </label>
            </div>
            <div className="flex items-center space-x-2">
            <button
                onClick={handleEdit}
                className="duration-150 bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-2 rounded"
            >
                {edit? "Save" : "✒"}
            </button>
            <button
                onClick = {handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-2 rounded"
            >
                ✖
            </button>
            </div>
        </div>
      </li>
    </div>
  );
};

export default Todo;