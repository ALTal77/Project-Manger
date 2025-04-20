import type React from "react";
import { useState } from "react";
import { Plus, Search } from "lucide-react";

import { useAppContext } from "@/context/AppContext";
import PageHeader from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProjectList from "@/components/projects/ProjectList";
import ProjectForm from "@/components/projects/ProjectForm";

type FilterStatus = "all" | "in-progress" | "completed";

const DashboardView: React.FC = () => {
  const { projects } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchQuery.toLowerCase());

      if (filterStatus === "all") return matchesSearch;

      const { getProjectProgress } = useAppContext();
      const progress = getProjectProgress(project.id);

      if (filterStatus === "completed") return matchesSearch && progress === 100;
      if (filterStatus === "in-progress") return matchesSearch && progress < 100;

      return matchesSearch;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects Dashboard"
        description="Create and manage your projects"
        actions={
          <Button onClick={() => setShowProjectForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            placeholder="Search projects..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="px-3 py-2 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
        >
          <option value="all">All Projects</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {filteredProjects.length > 0 ? (
        <ProjectList projects={filteredProjects} />
      ) : (
        <div className="text-center p-12 border rounded-lg bg-white dark:bg-gray-950">
          <h3 className="text-lg font-medium">No projects found</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {searchQuery
              ? "Try adjusting your search or filter criteria"
              : "Create your first project to get started"}
          </p>
        </div>
      )}

      <ProjectForm
        isOpen={showProjectForm}
        onClose={() => setShowProjectForm(false)}
      />
    </div>
  );
};

export default DashboardView;
