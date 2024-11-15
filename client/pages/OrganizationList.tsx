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

const ORGANIZATION_TYPES = {
  all: "All Types",
  "private-practice": "Private Practice",
  "community-mental-health": "Community Mental Health",
  hospital: "Hospital",
} as const;

const RATINGS = {
  all: "All Ratings",
  "4": "4+ Stars",
  "3": "3+ Stars",
  "2": "2+ Stars",
} as const;

type OrgType = keyof typeof ORGANIZATION_TYPES;
type RatingFilter = keyof typeof RATINGS;

export default function OrganizationList() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState<
    Organization[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<OrgType>("all");
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("all");

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const data = await getOrganizations();
        setOrganizations(data);
        setFilteredOrganizations(data);
      } catch (error) {
        toast.error("Failed to load organizations");
        console.error("Error fetching organizations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  useEffect(() => {
    filterOrganizations();
  }, [searchQuery, typeFilter, ratingFilter, organizations]);

  const filterOrganizations = () => {
    let filtered = [...organizations];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (org) =>
          org.name.toLowerCase().includes(query) ||
          org.description?.toLowerCase().includes(query)
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      const normalizedType = typeFilter.replace(/-/g, " ");
      filtered = filtered.filter(
        (org) => org.type.toLowerCase() === normalizedType
      );
    }

    // Rating filter
    if (ratingFilter !== "all") {
      const minRating = parseInt(ratingFilter);
      filtered = filtered.filter((org) => org.rating >= minRating);
    }

    setFilteredOrganizations(filtered);
  };

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
              <Input
                className="pl-9"
                placeholder="Search organizations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select
              value={typeFilter}
              onValueChange={(value: OrgType) => setTypeFilter(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Organization Type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ORGANIZATION_TYPES).map(([value, label]) => (
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
      <div className="grid md:grid-cols-2 gap-6">
        {filteredOrganizations.length > 0 ? (
          filteredOrganizations.map((org) => (
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
          ))
        ) : (
          <div className="col-span-2 text-center py-8 text-muted-foreground">
            No organizations found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
}
