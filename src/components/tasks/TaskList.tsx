import type React from "react";
import { useState } from "react";
import { Search } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import type { TaskStatus } from "@/types";
import { Input } from "@/components/ui/input";
import TaskCard from "./TaskCard";

interface TaskListProps {
  projectId: string;
}

const TaskList: React.FC<TaskListProps> = ({ projectId }) => {
  const { getProjectTasks } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");

  const tasks = getProjectTasks(projectId);

  const filteredTasks = tasks
    .filter(task => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());

      return statusFilter === "all"
        ? matchesSearch
        : matchesSearch && task.status === statusFilter;
    })
    .sort((a, b) => {
      // Sort by due date (closest first)
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

  if (tasks.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-slate-50 dark:bg-slate-900">
        <h3 className="text-lg font-medium">No tasks yet</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Add tasks to track progress in this project
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            placeholder="Search tasks..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="px-3 py-2 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as TaskStatus | "all")}
        >
          <option value="all">All Tasks</option>
          <option value="not-started">Not Started</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {filteredTasks.length > 0 ? (
        <div className="grid gap-4">
          {filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border rounded-lg bg-slate-50 dark:bg-slate-900">
          <h3 className="text-lg font-medium">No matching tasks</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Try adjusting your search or filter
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskList;
