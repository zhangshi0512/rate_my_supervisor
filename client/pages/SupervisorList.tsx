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

const SPECIALTIES = {
  all: "All Specialties",
  "clinical-psychology": "Clinical Psychology",
  counseling: "Counseling",
  "social-work": "Social Work",
} as const;

const RATINGS = {
  all: "All Ratings",
  "4": "4+ Stars",
  "3": "3+ Stars",
  "2": "2+ Stars",
} as const;

type SpecialtyType = keyof typeof SPECIALTIES;
type RatingFilter = keyof typeof RATINGS;

export default function SupervisorList() {
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [filteredSupervisors, setFilteredSupervisors] = useState<Supervisor[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState<SpecialtyType>("all");
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("all");
  const [organizationType, setOrganizationType] = useState<string>("all");

  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        const data = await getSupervisors();
        setSupervisors(data);
        setFilteredSupervisors(data);
      } catch (error) {
        toast.error("Failed to load supervisors");
        console.error("Error fetching supervisors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSupervisors();
  }, []);

  useEffect(() => {
    filterSupervisors();
  }, [
    searchQuery,
    specialtyFilter,
    ratingFilter,
    organizationType,
    supervisors,
  ]);

  const filterSupervisors = () => {
    let filtered = [...supervisors];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((supervisor) =>
        supervisor.name.toLowerCase().includes(query)
      );
    }

    // Specialty filter
    if (specialtyFilter !== "all") {
      const normalizedSpecialty = specialtyFilter.replace(/-/g, " ");
      filtered = filtered.filter((supervisor) =>
        supervisor.specialties.some(
          (specialty) => specialty.toLowerCase() === normalizedSpecialty
        )
      );
    }

    // Rating filter
    if (ratingFilter !== "all") {
      const minRating = parseInt(ratingFilter);
      filtered = filtered.filter(
        (supervisor) => supervisor.rating >= minRating
      );
    }

    // Organization type filter
    if (organizationType !== "all") {
      filtered = filtered.filter(
        (supervisor) =>
          supervisor.organization_id.toString() === organizationType
      );
    }

    setFilteredSupervisors(filtered);
  };

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
              <Input
                className="pl-9"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select
              value={organizationType}
              onValueChange={setOrganizationType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Organization Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Organizations</SelectItem>
                <SelectItem value="1">Wellness Center</SelectItem>
                <SelectItem value="2">Community Health</SelectItem>
                <SelectItem value="3">City Hospital</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={specialtyFilter}
              onValueChange={(value: SpecialtyType) =>
                setSpecialtyFilter(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Specialties" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SPECIALTIES).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={ratingFilter}
              onValueChange={(value: RatingFilter) => setRatingFilter(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(RATINGS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        {filteredSupervisors.length > 0 ? (
          filteredSupervisors.map((supervisor) => (
            <Card key={supervisor.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-muted rounded-full" />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">
                      {supervisor.name}
                    </h3>
                    <div className="text-muted-foreground mb-2">
                      Organization {supervisor.organization_id}
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
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No supervisors found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
}
