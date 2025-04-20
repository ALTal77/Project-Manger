import type React from "react";
import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import type { Task, TaskStatus } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "not-started", label: "Not Started" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

interface TaskFormProps {
  task?: Task;
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  task,
  projectId,
  isOpen,
  onClose
}) => {
  const { addTask, updateTask, getProjectTeamMembers } = useAppContext();
  const teamMembers = getProjectTeamMembers(projectId);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    status: "not-started" as TaskStatus,
    assignedToId: "unassigned", // default to unassigned
  });

  useEffect(() => {
    if (isOpen) {
      if (task) {
        setFormData({
          title: task.title,
          description: task.description,
          startDate: task.startDate.split("T")[0],
          dueDate: task.dueDate.split("T")[0],
          status: task.status,
          assignedToId: task.assignedToId || "unassigned",
        });
      } else {
        setFormData({
          title: "",
          description: "",
          startDate: new Date().toISOString().split("T")[0],
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          status: "not-started",
          assignedToId: "unassigned",
        });
      }
    }
  }, [isOpen, task]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.title.trim() === "") {
      alert("Task title is required");
      return;
    }

    const startDate = new Date(formData.startDate);
    const dueDate = new Date(formData.dueDate);

    if (dueDate < startDate) {
      alert("Due date cannot be before start date");
      return;
    }

    const taskData = {
      title: formData.title,
      description: formData.description,
      startDate: formData.startDate,
      dueDate: formData.dueDate,
      status: formData.status,
      assignedToId: formData.assignedToId === "unassigned" ? null : formData.assignedToId,
      projectId,
    };

    if (task) {
      updateTask({ ...task, ...taskData });
    } else {
      addTask(taskData);
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{task ? "Edit Task" : "Create Task"}</DialogTitle>
            <DialogDescription>
              {task
                ? "Update the task details below."
                : "Add a new task to your project."}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter task title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter task description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select task status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignedToId">Assigned To</Label>
              <Select
                value={formData.assignedToId}
                onValueChange={(value) => handleSelectChange("assignedToId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {teamMembers.map(member => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} ({member.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {task ? "Save Changes" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
