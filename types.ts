export enum UserRole {
  NONE = 'NONE',
  BUYER = 'BUYER',
  BROKER = 'BROKER',
  BUILDER = 'BUILDER'
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isBrokerRecommendation?: boolean;
  brokers?: Broker[];
}

export interface Broker {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  dealsClosed: number;
  avatarUrl: string;
}

export interface Deal {
  id: string;
  propertyName: string;
  buyerName: string;
  status: 'Negotiation' | 'Contract Sent' | 'Closed';
  amount: string;
}

export interface Lead {
  id: string;
  name: string;
  budget: string;
  preferences: string;
  urgency: 'HIGH' | 'MED' | 'LOW';
  matchScore: number;
}

export interface Project {
  id: string;
  location: string;
  size: string;
  zoning: string;
  status: 'Available' | 'Pending' | 'Developed';
}

// 3D Scene Prop Types
export interface SceneProps {
  onSelectRole: (role: UserRole) => void;
}