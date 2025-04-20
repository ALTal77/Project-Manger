import { useState } from "react";
import { MoreHorizontal, Users, CheckSquare, Calendar, Pencil, Trash2 } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import type { Project } from "@/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProjectForm from "./ProjectForm";
import { toast } from "sonner";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const {
    getProjectProgress,
    getProjectTeamMembers,
    getProjectTasks,
    deleteProject
  } = useAppContext();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const progress = getProjectProgress(project.id);
  const teamMembers = getProjectTeamMembers(project.id);
  const tasks = getProjectTasks(project.id);

  // Format the date
  const createdDate = new Date(project.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${project.name}"? This will also delete all associated team members and tasks.`)) {
      deleteProject(project.id);
      toast.success(`Project "${project.name}" deleted successfully.`);
    }
  };

  return (
    <>
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-semibold line-clamp-1">{project.name}</CardTitle>
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
                <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4">
            {project.description || "No description provided."}
          </p>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />

            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-sm">{teamMembers.length}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckSquare className="h-4 w-4 text-green-500" />
                <span className="text-sm">{tasks.length}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-orange-500" />
                <span className="text-sm text-gray-500 truncate">{createdDate}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-sm"
            asChild
          >
            <a href={`/projects/${project.id}`}>View Details</a>
          </Button>
        </CardFooter>
      </Card>

      <ProjectForm
        project={project}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      />
    </>
  );
};

export default ProjectCard;
