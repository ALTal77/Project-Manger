import type { AppData } from "@/types";

const STORAGE_KEY = "project-team-manager-data";

const defaultData: AppData = {
  projects: [],
  teamMembers: [],
  tasks: [],
};

export const storageService = {
  getData: (): AppData => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (!storedData) return defaultData;
      return JSON.parse(storedData) as AppData;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return defaultData;
    }
  },

  saveData: (data: AppData): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  },

  clearData: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  },
};
