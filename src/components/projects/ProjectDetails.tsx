import type React from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Users, CheckSquare, MoreHorizontal, Pencil, Trash2, Plus } from "lucide-react";

import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import PageHeader from "@/components/common/PageHeader";
import ProjectForm from "./ProjectForm";
import TeamList from "@/components/team/TeamList";
import TeamMemberForm from "@/components/team/TeamMemberForm";
import TaskList from "@/components/tasks/TaskList";
import TaskForm from "@/components/tasks/TaskForm";

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    projects,
    getProjectProgress,
    getProjectTeamMembers,
    getProjectTasks,
    deleteProject
  } = useAppContext();

  const [showEditProject, setShowEditProject] = useState(false);
  const [showAddTeamMember, setShowAddTeamMember] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);

  // Find the project
  const project = projects.find(p => p.id === id);

  // If project not found, redirect to the dashboard
  if (!project) {
    navigate("/");
    return null;
  }

  const progress = getProjectProgress(project.id);
  const teamMembers = getProjectTeamMembers(project.id);
  const tasks = getProjectTasks(project.id);

  // Format the date
  const createdDate = new Date(project.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleDeleteProject = () => {
    if (window.confirm(`Are you sure you want to delete "${project.name}"? This will also delete all associated team members and tasks.`)) {
      deleteProject(project.id);
      navigate("/");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/")}
          className="flex items-center gap-1 text-gray-500"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4 mr-2" />
              Options
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setShowEditProject(true)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Project
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" onClick={handleDeleteProject}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <PageHeader
        title={project.name}
        description={project.description || "No description provided"}
      />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white dark:bg-gray-950 p-4 rounded-lg border shadow-sm">
          <h3 className="text-lg font-medium mb-2">Project Progress</h3>
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-gray-500 dark:text-gray-400">Completion</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3 mb-4" />

          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="flex flex-col items-center bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
              <Users className="h-5 w-5 text-blue-500 mb-1" />
              <span className="text-2xl font-semibold">{teamMembers.length}</span>
              <span className="text-sm text-gray-500">Team Members</span>
            </div>
            <div className="flex flex-col items-center bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
              <CheckSquare className="h-5 w-5 text-green-500 mb-1" />
              <span className="text-2xl font-semibold">{tasks.length}</span>
              <span className="text-sm text-gray-500">Tasks</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-500">
              <span className="font-medium">Created:</span> {createdDate}
            </p>
          </div>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="tasks">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="tasks" className="flex-1">Tasks</TabsTrigger>
              <TabsTrigger value="team" className="flex-1">Team Members</TabsTrigger>
            </TabsList>

            <TabsContent value="tasks" className="mt-0">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Project Tasks</h3>
                <Button size="sm" onClick={() => setShowAddTask(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>

              <TaskList projectId={project.id} />
            </TabsContent>

            <TabsContent value="team" className="mt-0">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Team Members</h3>
                <Button size="sm" onClick={() => setShowAddTeamMember(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </div>

              <TeamList projectId={project.id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Modals */}
      <ProjectForm
        project={project}
        isOpen={showEditProject}
        onClose={() => setShowEditProject(false)}
      />

      <TeamMemberForm
        projectId={project.id}
        isOpen={showAddTeamMember}
        onClose={() => setShowAddTeamMember(false)}
      />

      <TaskForm
        projectId={project.id}
        isOpen={showAddTask}
        onClose={() => setShowAddTask(false)}
      />
    </div>
  );
};

export default ProjectDetails;
