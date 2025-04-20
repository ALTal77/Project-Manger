import type React from "react";
import { useState } from "react";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Calendar,
  CircleCheck,
  Circle,
  CircleDashed,
  User
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import type { Task, TaskStatus } from "@/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TaskForm from "./TaskForm";

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { updateTask, deleteTask, getTeamMemberById } = useAppContext();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const assignedMember = task.assignedToId
    ? getTeamMemberById(task.assignedToId)
    : null;

  // Format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete task "${task.title}"?`)) {
      deleteTask(task.id);
    }
  };

  const handleStatusChange = (status: TaskStatus) => {
    updateTask({
      ...task,
      status,
    });
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Get status icon
  const getStatusIcon = () => {
    switch (task.status) {
      case "not-started":
        return <Circle className="h-4 w-4 text-gray-400" />;
      case "in-progress":
        return <CircleDashed className="h-4 w-4 text-blue-500" />;
      case "completed":
        return <CircleCheck className="h-4 w-4 text-green-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  // Get status text
  const getStatusText = () => {
    switch (task.status) {
      case "not-started": return "Not Started";
      case "in-progress": return "In Progress";
      case "completed": return "Completed";
      default: return "Unknown";
    }
  };

  // Check if task is overdue
  const isOverdue = () => {
    if (task.status === "completed") return false;
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    return today > dueDate;
  };

  return (
    <>
      <Card className={`
        ${task.status === "completed" ? "bg-gray-50 dark:bg-gray-900" : ""}
        ${isOverdue() ? "border-red-200 dark:border-red-900" : ""}
      `}>
        <CardHeader className="pb-2 flex flex-row justify-between items-start">
          <div className="flex items-start gap-2">
            <div className="mt-1">{getStatusIcon()}</div>
            <div>
              <h3 className={`text-lg font-medium ${task.status === "completed" ? "line-through text-gray-500" : ""}`}>
                {task.title}
              </h3>
              {isOverdue() && (
                <span className="text-xs text-red-500 font-medium">
                  Overdue
                </span>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={task.status === "not-started"}
                onClick={() => handleStatusChange("not-started")}
              >
                <Circle className="mr-2 h-4 w-4" />
                Mark as Not Started
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={task.status === "in-progress"}
                onClick={() => handleStatusChange("in-progress")}
              >
                <CircleDashed className="mr-2 h-4 w-4" />
                Mark as In Progress
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={task.status === "completed"}
                onClick={() => handleStatusChange("completed")}
              >
                <CircleCheck className="mr-2 h-4 w-4" />
                Mark as Completed
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {task.description || "No description provided."}
          </p>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>Due: {formatDate(task.dueDate)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
              <User className="h-4 w-4" />
              {assignedMember ? (
                <div className="flex items-center gap-1.5">
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="text-xs">
                      {getInitials(assignedMember.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{assignedMember.name}</span>
                </div>
              ) : (
                <span>Unassigned</span>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <span className={`
            text-xs px-2 py-1 rounded-full
            ${task.status === "not-started" ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200" : ""}
            ${task.status === "in-progress" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" : ""}
            ${task.status === "completed" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : ""}
          `}>
            {getStatusText()}
          </span>
        </CardFooter>
      </Card>

      <TaskForm
        task={task}
        projectId={task.projectId}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      />
    </>
  );
};

export default TaskCard;
