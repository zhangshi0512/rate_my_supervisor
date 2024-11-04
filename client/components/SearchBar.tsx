import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface SearchBarProps {
  placeholder?: string;
  showOrgTypeFilter?: boolean;
}

export function SearchBar({ placeholder = "Search...", showOrgTypeFilter = true }: SearchBarProps) {
  return (
    <div className="flex gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9" placeholder={placeholder} />
      </div>
      {showOrgTypeFilter && (
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Organization Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="private">Private Practice</SelectItem>
            <SelectItem value="community">Community Mental Health</SelectItem>
            <SelectItem value="hospital">Hospital</SelectItem>
          </SelectContent>
        </Select>
      )}
      <Button>Search</Button>
    </div>
  );
}