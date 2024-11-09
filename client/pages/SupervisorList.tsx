import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { Link } from "react-router-dom";
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
import { getSupervisors, type Supervisor } from "@/lib/api";
import { toast } from "sonner";

export default function SupervisorList() {
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        const data = await getSupervisors();
        setSupervisors(data);
      } catch (error) {
        toast.error("Failed to load supervisors");
        console.error("Error fetching supervisors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSupervisors();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading supervisors...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Filter Supervisors</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search..." />
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
                <SelectValue placeholder="Specialties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clinical">Clinical Psychology</SelectItem>
                <SelectItem value="counseling">Counseling</SelectItem>
                <SelectItem value="social">Social Work</SelectItem>
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
      <div className="space-y-4">
        {supervisors.map((supervisor) => (
          <Card key={supervisor.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-muted rounded-full" />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">
                    {supervisor.name}
                  </h3>
                  <div className="text-muted-foreground mb-2">
                    {supervisor.organization_id}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span>{supervisor.specialties.join(", ")}</span>
                    <span>•</span>
                    <span>{supervisor.experience} years experience</span>
                    <span>•</span>
                    <span className="text-yellow-500">
                      ★ {supervisor.rating.toFixed(1)} (
                      {supervisor.review_count} reviews)
                    </span>
                  </div>
                  <p className="text-muted-foreground">{supervisor.bio}</p>
                </div>
                <Link to={`/supervisors/${supervisor.id}`}>
                  <Button>View Profile</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
