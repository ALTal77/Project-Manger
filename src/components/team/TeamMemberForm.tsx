import type React from "react";
import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import type { TeamMember } from "@/types";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Common role options
const ROLE_OPTIONS = [
  "Project Manager",
  "Developer",
  "Designer",
  "Business Analyst",
  "QA Engineer",
  "DevOps Engineer",
  "Product Owner"
];

interface TeamMemberFormProps {
  member?: TeamMember;
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
}

const TeamMemberForm: React.FC<TeamMemberFormProps> = ({
  member,
  projectId,
  isOpen,
  onClose
}) => {
  const { addTeamMember, updateTeamMember } = useAppContext();

  const [formData, setFormData] = useState({
    name: "",
    role: ROLE_OPTIONS[0],
  });

  // Reset form data when the dialog opens or member changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: member?.name || "",
        role: member?.role || ROLE_OPTIONS[0],
      });
    }
  }, [isOpen, member]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.name.trim() === "") {
      alert("Team member name is required");
      return;
    }

    if (member) {
      // Update existing team member
      updateTeamMember({
        ...member,
        name: formData.name,
        role: formData.role,
      });
    } else {
      // Add new team member
      addTeamMember({
        name: formData.name,
        role: formData.role,
        projectId,
      });
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{member ? "Edit Team Member" : "Add Team Member"}</DialogTitle>
            <DialogDescription>
              {member
                ? "Update the team member's information below."
                : "Add a new member to your project team."
              }
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter team member name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              {member ? "Save Changes" : "Add Member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TeamMemberForm;
