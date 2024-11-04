import { Building2, MapPin, Globe, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SupervisorCard } from '@/components/SupervisorCard';
import { Link, useParams } from 'react-router-dom';

const supervisors = [
  { id: 1, name: "Dr. Jane Smith", organization: "Wellness Center", specialties: ["Clinical Psychology"], experience: 10, rating: 4.8, reviewCount: 24 },
  { id: 2, name: "Dr. John Doe", organization: "Wellness Center", specialties: ["Counseling"], experience: 8, rating: 4.7, reviewCount: 18 },
  { id: 3, name: "Dr. Sarah Johnson", organization: "Wellness Center", specialties: ["Social Work"], experience: 12, rating: 4.9, reviewCount: 32 },
];

export default function OrganizationDetail() {
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Organization Header */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex items-start gap-8">
            <div className="w-32 h-32 bg-muted rounded-lg" />
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">Wellness Center</h1>
              <div className="text-xl text-muted-foreground mb-4">Private Practice</div>
              
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <div className="font-medium">Organization Info</div>
                    </div>
                    <div className="text-muted-foreground mt-1">12 Supervisors</div>
                    <div className="flex items-center gap-1 text-yellow-500 mt-1">
                      <Star className="h-4 w-4" />
                      <span>4.6 average rating</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div className="font-medium">Location</div>
                    </div>
                    <div className="text-muted-foreground mt-1">
                      123 Main Street<br />
                      New York, NY 10001
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex items-center gap-4">
                <Button 
                  variant="outline"
                  className="text-primary hover:text-primary hover:bg-primary/5"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Visit Website
                </Button>
                <Link to={`/organizations/${id}/review`}>
                  <Button 
                    variant="outline"
                    className="text-primary hover:text-primary hover:bg-primary/5"
                  >
                    Write a Review
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About Section */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <h2 className="text-2xl font-semibold mb-4">About</h2>
          <p className="text-muted-foreground">
            The Wellness Center is a leading mental health practice dedicated to providing high-quality supervision 
            and training opportunities. Our experienced supervisors specialize in various therapeutic approaches 
            and are committed to supporting the professional development of interns and associates.
          </p>
        </CardContent>
      </Card>

      {/* Supervisors Section */}
      <Card>
        <CardContent className="p-8">
          <h2 className="text-2xl font-semibold mb-6">Our Supervisors</h2>
          <div className="space-y-4">
            {supervisors.map((supervisor) => (
              <SupervisorCard
                key={supervisor.id}
                {...supervisor}
                description="Experienced supervisor specializing in evidence-based therapeutic approaches."
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}