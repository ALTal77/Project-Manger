import type React from "react";
import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import type { Project } from "@/types";
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

interface ProjectFormProps {
  project?: Project;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, isOpen, onClose }) => {
  const { addProject, updateProject } = useAppContext();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // Reset form data when dialog opens or project changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: project?.name || "",
        description: project?.description || "",
      });
    }
  }, [isOpen, project]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.name.trim() === "") {
      alert("Project name is required");
      return;
    }

    if (project) {
      // Update existing project
      updateProject({
        ...project,
        name: formData.name,
        description: formData.description,
      });
    } else {
      // Add new project
      addProject({
        name: formData.name,
        description: formData.description,
      });
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{project ? "Edit Project" : "Create Project"}</DialogTitle>
            <DialogDescription>
              {project
                ? "Update your project's information below."
                : "Add a new project to your workspace."
              }
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter project name"
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
                placeholder="Enter project description"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit">
              {project ? "Save Changes" : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectForm;
