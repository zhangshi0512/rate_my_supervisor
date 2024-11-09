import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface Supervisor {
  id: number;
  name: string;
  organization_id: number;
  specialties: string[];
  experience: number;
  bio: string;
  rating: number;
  review_count: number;
}

export interface Organization {
  id: number;
  name: string;
  type: string;
  description: string;
  website_url: string;
  rating: number;
  supervisor_count: number;
}

export interface SupervisorReview {
  id: number;
  supervisor_id: number;
  rating: number;
  content: string;
  author: string;
  supervision_period: string;
  is_anonymous: boolean;
  helpful_count: number;
  created_at: string;
}

export interface OrganizationReview {
  id: number;
  organization_id: number;
  rating: number;
  content: string;
  author: string;
  role: string;
  employment_period: string;
  is_anonymous: boolean;
  created_at: string;
}

// Helper function to ensure numeric rating
const ensureNumericRating = (data: any) => {
  if (data.rating) {
    data.rating = parseFloat(data.rating.toString()) || 0;
  }
  return data;
};

// Supervisor endpoints
export const getSupervisors = async () => {
  const response = await api.get<Supervisor[]>("/api/supervisors");
  return response.data.map((supervisor) => ensureNumericRating(supervisor));
};

export const getSupervisor = async (id: string) => {
  const response = await api.get<Supervisor>(`/api/supervisors/${id}`);
  return ensureNumericRating(response.data);
};

export const createSupervisorReview = (
  id: string,
  review: Partial<SupervisorReview>
) => api.post(`/api/reviews/supervisors/${id}`, review).then((res) => res.data);

// Organization endpoints
export const getOrganizations = async () => {
  const response = await api.get<Organization[]>("/api/organizations");
  return response.data.map((org) => ensureNumericRating(org));
};

export const getOrganization = async (id: string) => {
  const response = await api.get<Organization>(`/api/organizations/${id}`);
  return ensureNumericRating(response.data);
};

export const getOrganizationSupervisors = async (id: string) => {
  const response = await api.get<Supervisor[]>(
    `/api/organizations/${id}/supervisors`
  );
  return response.data.map((supervisor) => ensureNumericRating(supervisor));
};

export const createOrganizationReview = (
  id: string,
  review: Partial<OrganizationReview>
) =>
  api.post(`/api/reviews/organizations/${id}`, review).then((res) => res.data);
