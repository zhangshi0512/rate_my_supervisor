// client/lib/api.ts

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Types
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
  id?: number;
  supervisor_id?: number;
  rating: number;
  content: string;
  author: string;
  supervision_period: string;
  is_anonymous: boolean;
  characteristics?: string;
  created_at?: string;
}

export interface OrganizationReview {
  id?: number;
  organization_id?: number;
  rating: number;
  content: string;
  author: string;
  role: string;
  employment_period: string;
  is_anonymous: boolean;
  created_at?: string;
}

export interface OrganizationReviewWithAuthor extends OrganizationReview {
  author: string;
  role: string;
  employment_period: string;
  is_anonymous: boolean;
}

// API Functions
export const getSupervisors = async () => {
  const response = await api.get<Supervisor[]>("/api/supervisors");
  return response.data;
};

export const getSupervisor = async (id: string) => {
  const response = await api.get<Supervisor>(`/api/supervisors/${id}`);
  return response.data;
};

export const getSupervisorReviews = async (id: string) => {
  const response = await api.get(`/api/reviews/supervisors/${id}`);
  return response.data;
};

export const getOrganizations = async () => {
  const response = await api.get<Organization[]>("/api/organizations");
  return response.data;
};

export const getOrganization = async (id: string) => {
  const response = await api.get<Organization>(`/api/organizations/${id}`);
  return response.data;
};

export const getOrganizationSupervisors = async (id: string) => {
  const response = await api.get<Supervisor[]>(
    `/api/organizations/${id}/supervisors`
  );
  return response.data;
};

export const getOrganizationReviews = async (id: string) => {
  const response = await api.get<OrganizationReviewWithAuthor[]>(
    `/api/organizations/${id}/reviews`
  );
  return response.data.map((review) => ({
    ...review,
    rating: parseFloat(review.rating.toString()) || 0,
  }));
};

export const createSupervisorReview = async (
  id: string,
  review: Partial<SupervisorReview>
) => {
  const response = await api.post(`/api/reviews/supervisors/${id}`, review);
  return response.data;
};

export const createOrganizationReview = async (
  id: string,
  review: Partial<OrganizationReview>
) => {
  const response = await api.post(`/api/reviews/organizations/${id}`, review);
  return response.data;
};
