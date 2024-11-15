import { useState, useEffect } from "react";
import { Star, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SearchBar } from "@/components/SearchBar";
import { SupervisorCard } from "@/components/SupervisorCard";
import { OrganizationCard } from "@/components/OrganizationCard";
import {
  getSupervisors,
  getOrganizations,
  type Supervisor,
  type Organization,
} from "@/lib/api";
import { toast } from "sonner";

export type OrgType =
  | "all"
  | "private-practice"
  | "community-mental-health"
  | "hospital";

export default function LandingPage() {
  const [topSupervisors, setTopSupervisors] = useState<Supervisor[]>([]);
  const [featuredOrganizations, setFeaturedOrganizations] = useState<
    Organization[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [orgType, setOrgType] = useState<OrgType>("all");
  const [allSupervisors, setAllSupervisors] = useState<Supervisor[]>([]);
  const [allOrganizations, setAllOrganizations] = useState<Organization[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [supervisorsData, organizationsData] = await Promise.all([
          getSupervisors(),
          getOrganizations(),
        ]);

        setAllSupervisors(supervisorsData);
        setAllOrganizations(organizationsData);

        // Set initial top rated items
        updateTopItems(supervisorsData, organizationsData);
      } catch (error) {
        toast.error("Failed to load data");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateTopItems = (
    supervisors: Supervisor[],
    organizations: Organization[]
  ) => {
    const filteredSupervisors = filterItems(supervisors);
    const filteredOrganizations = filterOrganizations(organizations);

    setTopSupervisors(
      filteredSupervisors.sort((a, b) => b.rating - a.rating).slice(0, 3)
    );

    setFeaturedOrganizations(
      filteredOrganizations.sort((a, b) => b.rating - a.rating).slice(0, 3)
    );
  };

  const filterItems = (items: Supervisor[]): Supervisor[] => {
    return items.filter(
      (item) =>
        searchQuery.toLowerCase() === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filterOrganizations = (
    organizations: Organization[]
  ): Organization[] => {
    return organizations.filter((org) => {
      const matchesSearch =
        searchQuery.toLowerCase() === "" ||
        org.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType =
        orgType === "all" ||
        org.type.toLowerCase().replace(/\s+/g, "-") === orgType;

      return matchesSearch && matchesType;
    });
  };

  const handleSearch = () => {
    updateTopItems(allSupervisors, allOrganizations);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <section className="py-20 px-8 text-center">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-5xl font-bold mb-6">
            Find Your Ideal Supervisor
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Connect with experienced supervisors and make informed decisions
            about your professional development
          </p>

          <Card className="max-w-3xl mx-auto">
            <CardContent className="p-6">
              <SearchBar
                placeholder="Search supervisors or organizations..."
                searchQuery={searchQuery}
                orgType={orgType}
                onSearchChange={setSearchQuery}
                onTypeChange={setOrgType}
                onSearch={handleSearch}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-16 px-8 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Star className="h-5 w-5" />
                  <h2 className="text-2xl font-semibold">
                    Top Rated Supervisors
                  </h2>
                </div>
                <div className="space-y-4">
                  {topSupervisors.length > 0 ? (
                    topSupervisors.map((supervisor) => (
                      <SupervisorCard
                        key={supervisor.id}
                        {...supervisor}
                        compact
                      />
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-4">
                      No supervisors found matching your criteria
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Building2 className="h-5 w-5" />
                  <h2 className="text-2xl font-semibold">
                    Featured Organizations
                  </h2>
                </div>
                <div className="space-y-4">
                  {featuredOrganizations.length > 0 ? (
                    featuredOrganizations.map((org) => (
                      <OrganizationCard
                        key={org.id}
                        id={org.id}
                        name={org.name}
                        type={org.type}
                        supervisor_count={org.supervisor_count}
                        rating={org.rating}
                      />
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-4">
                      No organizations found matching your criteria
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
