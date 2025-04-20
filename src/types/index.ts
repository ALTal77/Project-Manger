export type TeamMember = {
  id: string;
  name: string;
  role: string;
  projectId: string;
};

export type TaskStatus = "not-started" | "in-progress" | "completed";

export type Task = {
  id: string;
  title: string;
  description: string;
  startDate: string;
  dueDate: string;
  status: TaskStatus;
  projectId: string;
  assignedToId: string | null;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
};

export type AppData = {
  projects: Project[];
  teamMembers: TeamMember[];
  tasks: Task[];
};
