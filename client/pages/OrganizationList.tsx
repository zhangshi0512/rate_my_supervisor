import { useState, useEffect } from "react";
import { Search, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { getOrganizations, type Organization } from "@/lib/api";
import { toast } from "sonner";

export default function OrganizationList() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const data = await getOrganizations();
        setOrganizations(data);
      } catch (error) {
        toast.error("Failed to load organizations");
        console.error("Error fetching organizations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading organizations...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search organizations..." />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Organization Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private Practice</SelectItem>
                <SelectItem value="community">
                  Community Mental Health
                </SelectItem>
                <SelectItem value="hospital">Hospital</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4">4+ Stars</SelectItem>
                <SelectItem value="3">3+ Stars</SelectItem>
                <SelectItem value="2">2+ Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid md:grid-cols-2 gap-6">
        {organizations.map((org) => (
          <Card key={org.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-muted rounded-md" />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{org.name}</h3>
                  <div className="text-muted-foreground mb-2">{org.type}</div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span>{org.supervisor_count} Supervisors</span>
                    <span>•</span>
                    <span className="text-yellow-500">
                      ★ {org.rating.toFixed(1)} avg
                    </span>
                  </div>
                  <div className="mt-4">
                    <Link to={`/organizations/${org.id}`}>
                      <Button
                        variant="outline"
                        className="text-primary hover:text-primary hover:bg-primary/5"
                      >
                        View Details →
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
