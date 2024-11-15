import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { OrgType } from "@/pages/LandingPage";

interface SearchBarProps {
  placeholder?: string;
  showOrgTypeFilter?: boolean;
  searchQuery: string;
  orgType: OrgType;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: OrgType) => void;
  onSearch: () => void;
}

export function SearchBar({
  placeholder = "Search...",
  showOrgTypeFilter = true,
  searchQuery,
  orgType,
  onSearchChange,
  onTypeChange,
  onSearch,
}: SearchBarProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="flex gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>
      {showOrgTypeFilter && (
        <Select value={orgType} onValueChange={onTypeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Organization Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="private-practice">Private Practice</SelectItem>
            <SelectItem value="community-mental-health">
              Community Mental Health
            </SelectItem>
            <SelectItem value="hospital">Hospital</SelectItem>
          </SelectContent>
        </Select>
      )}
      <Button onClick={onSearch}>Search</Button>
    </div>
  );
}
