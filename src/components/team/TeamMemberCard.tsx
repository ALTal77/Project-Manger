import type React from "react";
import { useState } from "react";
import { MoreHorizontal, User, Briefcase, Pencil, Trash2 } from "lucide-react";
import type { TeamMember } from "@/types";
import { useAppContext } from "@/context/AppContext";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TeamMemberForm from "./TeamMemberForm";

interface TeamMemberCardProps {
  member: TeamMember;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member }) => {
  const { deleteTeamMember } = useAppContext();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to remove ${member.name} from the team?`)) {
      deleteTeamMember(member.id);
    }
  };

  // Get initials from name for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-2 flex flex-row justify-between items-start">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-medium">{member.name}</h3>
              <div className="flex items-center text-sm text-gray-500">
                <Briefcase className="h-3.5 w-3.5 mr-1" />
                {member.role}
              </div>
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
              <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
      </Card>

      <TeamMemberForm
        member={member}
        projectId={member.projectId}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      />
    </>
  );
};

export default TeamMemberCard;
