import { Star, Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { SearchBar } from '@/components/SearchBar';
import { SupervisorCard } from '@/components/SupervisorCard';
import { OrganizationCard } from '@/components/OrganizationCard';

const topSupervisors = [
  { id: 1, name: "Dr. Jane Smith", organization: "Private Practice", specialties: ["Clinical Psychology"], experience: 10, rating: 4.8, reviewCount: 24 },
  { id: 2, name: "Dr. John Doe", organization: "Wellness Center", specialties: ["Counseling"], experience: 8, rating: 4.7, reviewCount: 18 },
  { id: 3, name: "Dr. Sarah Johnson", organization: "Community Health", specialties: ["Social Work"], experience: 12, rating: 4.9, reviewCount: 32 },
];

const featuredOrganizations = [
  { id: 1, name: "Wellness Center", type: "Private Practice", supervisorCount: 12, rating: 4.6 },
  { id: 2, name: "Community Health", type: "Community Mental Health", supervisorCount: 8, rating: 4.4 },
  { id: 3, name: "City Hospital", type: "Hospital", supervisorCount: 15, rating: 4.7 },
];

export default function LandingPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <section className="py-20 px-8 text-center">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-5xl font-bold mb-6">Find Your Ideal Supervisor</h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Connect with experienced supervisors and make informed decisions about your professional development
          </p>
          
          <Card className="max-w-3xl mx-auto">
            <CardContent className="p-6">
              <SearchBar placeholder="Search supervisors or organizations..." />
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
                  <h2 className="text-2xl font-semibold">Top Rated Supervisors</h2>
                </div>
                <div className="space-y-4">
                  {topSupervisors.map((supervisor) => (
                    <SupervisorCard key={supervisor.id} {...supervisor} compact />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Building2 className="h-5 w-5" />
                  <h2 className="text-2xl font-semibold">Featured Organizations</h2>
                </div>
                <div className="space-y-4">
                  {featuredOrganizations.map((org) => (
                    <OrganizationCard key={org.id} {...org} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}