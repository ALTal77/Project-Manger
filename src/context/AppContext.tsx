import type React from "react";
import { createContext, useState, useContext, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

import { type AppData, type Project, type Task, TaskStatus, type TeamMember } from "@/types";
import { storageService } from "@/services/storageService";

interface AppContextType extends AppData {
  // Project Methods
  addProject: (project: Omit<Project, "id" | "createdAt">) => string;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;

  // Team Member Methods
  addTeamMember: (member: Omit<TeamMember, "id">) => string;
  updateTeamMember: (member: TeamMember) => void;
  deleteTeamMember: (id: string) => void;

  // Task Methods
  addTask: (task: Omit<Task, "id">) => string;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;

  // Helpers
  getProjectProgress: (projectId: string) => number;
  getProjectTeamMembers: (projectId: string) => TeamMember[];
  getProjectTasks: (projectId: string) => Task[];
  getTeamMemberById: (id: string) => TeamMember | undefined;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(storageService.getData());

  // Save data to localStorage whenever it changes
  useEffect(() => {
    storageService.saveData(data);
  }, [data]);

  // Project Methods
  const addProject = (project: Omit<Project, "id" | "createdAt">) => {
    const id = uuidv4();
    const newProject: Project = {
      id,
      ...project,
      createdAt: new Date().toISOString(),
    };

    setData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }));

    toast.success(`Project "${project.name}" created successfully!`);
    return id;
  };

  const updateProject = (project: Project) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === project.id ? project : p
      ),
    }));

    toast.success(`Project "${project.name}" updated!`);
  };

  const deleteProject = (id: string) => {
    const projectToDelete = data.projects.find(p => p.id === id);
    if (!projectToDelete) return;

    // Delete related team members and tasks as well
    setData(prev => ({
      projects: prev.projects.filter(p => p.id !== id),
      teamMembers: prev.teamMembers.filter(m => m.projectId !== id),
      tasks: prev.tasks.filter(t => t.projectId !== id),
    }));

    toast.success(`Project "${projectToDelete.name}" deleted!`);
  };

  // Team Member Methods
  const addTeamMember = (member: Omit<TeamMember, "id">) => {
    const id = uuidv4();
    const newMember: TeamMember = {
      id,
      ...member,
    };

    setData(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, newMember],
    }));

    toast.success(`Team member "${member.name}" added!`);
    return id;
  };

  const updateTeamMember = (member: TeamMember) => {
    setData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map(m =>
        m.id === member.id ? member : m
      ),
    }));

    toast.success(`Team member "${member.name}" updated!`);
  };

  const deleteTeamMember = (id: string) => {
    const memberToDelete = data.teamMembers.find(m => m.id === id);
    if (!memberToDelete) return;

    // Update assigned tasks
    setData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter(m => m.id !== id),
      tasks: prev.tasks.map(t =>
        t.assignedToId === id ? { ...t, assignedToId: null } : t
      ),
    }));

    toast.success(`Team member "${memberToDelete.name}" removed!`);
  };

  // Task Methods
  const addTask = (task: Omit<Task, "id">) => {
    const id = uuidv4();
    const newTask: Task = {
      id,
      ...task,
    };

    setData(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
    }));

    toast.success(`Task "${task.title}" created!`);
    return id;
  };

  const updateTask = (task: Task) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t =>
        t.id === task.id ? task : t
      ),
    }));

    toast.success(`Task "${task.title}" updated!`);
  };

  const deleteTask = (id: string) => {
    const taskToDelete = data.tasks.find(t => t.id === id);
    if (!taskToDelete) return;

    setData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id),
    }));

    toast.success(`Task "${taskToDelete.title}" deleted!`);
  };

  // Helper Functions
  const getProjectProgress = (projectId: string): number => {
    const projectTasks = data.tasks.filter(t => t.projectId === projectId);
    if (projectTasks.length === 0) return 0;

    const completedTasks = projectTasks.filter(t => t.status === "completed");
    return Math.round((completedTasks.length / projectTasks.length) * 100);
  };

  const getProjectTeamMembers = (projectId: string): TeamMember[] => {
    return data.teamMembers.filter(m => m.projectId === projectId);
  };

  const getProjectTasks = (projectId: string): Task[] => {
    return data.tasks.filter(t => t.projectId === projectId);
  };

  const getTeamMemberById = (id: string): TeamMember | undefined => {
    return data.teamMembers.find(m => m.id === id);
  };

  // Context value
  const value: AppContextType = {
    ...data,
    addProject,
    updateProject,
    deleteProject,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    addTask,
    updateTask,
    deleteTask,
    getProjectProgress,
    getProjectTeamMembers,
    getProjectTasks,
    getTeamMemberById,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
