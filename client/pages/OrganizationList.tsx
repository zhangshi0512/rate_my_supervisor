import { Search, Building2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

export default function OrganizationList() {
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
                <SelectItem value="community">Community Mental Health</SelectItem>
                <SelectItem value="hospital">Hospital</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ny">New York</SelectItem>
                <SelectItem value="ca">California</SelectItem>
                <SelectItem value="tx">Texas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-muted rounded-md" />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Wellness Center</h3>
                  <div className="text-muted-foreground mb-2">Private Practice</div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span>12 Supervisors</span>
                    <span>•</span>
                    <span className="text-yellow-500">★ 4.6 avg</span>
                  </div>
                  <div className="mt-4">
                    <Link to={`/organizations/${i}`}>
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