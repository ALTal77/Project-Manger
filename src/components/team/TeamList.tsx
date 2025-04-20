import type React from "react";
import { useAppContext } from "@/context/AppContext";
import TeamMemberCard from "./TeamMemberCard";

interface TeamListProps {
  projectId: string;
}

const TeamList: React.FC<TeamListProps> = ({ projectId }) => {
  const { getProjectTeamMembers } = useAppContext();
  const teamMembers = getProjectTeamMembers(projectId);

  if (teamMembers.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-slate-50 dark:bg-slate-900">
        <h3 className="text-lg font-medium">No team members yet</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Add team members to collaborate on this project
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {teamMembers.map(member => (
        <TeamMemberCard key={member.id} member={member} />
      ))}
    </div>
  );
};

export default TeamList;
