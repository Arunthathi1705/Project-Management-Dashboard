import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('employees');
    return saved ? JSON.parse(saved) : [];
  });

  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('projects');
    return saved ? JSON.parse(saved) : [];
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Employee operations
  const addEmployee = (emp) => setEmployees((prev) => [...prev, emp]);
  const updateEmployee = (id, updated) =>
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, ...updated } : e)));
  const deleteEmployee = (id) =>
    setEmployees((prev) => prev.filter((e) => e.id !== id));

  // Project operations
  const addProject = (proj) => setProjects((prev) => [...prev, proj]);
  const updateProject = (id, updated) =>
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
  const deleteProject = (id) =>
    setProjects((prev) => prev.filter((p) => p.id !== id));

  // Task operations
  const addTask = (task) => setTasks((prev) => [...prev, task]);
  const updateTask = (id, updated) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
  const deleteTask = (id) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));
  const moveTask = (taskId, newStatus) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

  return (
    <AppContext.Provider
      value={{
        employees, addEmployee, updateEmployee, deleteEmployee,
        projects, addProject, updateProject, deleteProject,
        tasks, addTask, updateTask, deleteTask, moveTask,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);