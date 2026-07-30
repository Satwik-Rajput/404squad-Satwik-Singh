export type CategoryType =
  | "All"
  | "Home Services"
  | "Legal"
  | "Education"
  | "Tech"
  | "Creative"
  | "Wellness";

export type BudgetUnit = "minute" | "hour" | "day" | "month";

export interface Job {
  id?: string;
  title: string;
  category: Exclude<CategoryType, "All">;
  description: string;
  budget: number;
  budgetUnit: BudgetUnit;
  location: string;
  workerName?: string;
  workerAvatar?: string;
  workerRating?: number;
  workerTitle?: string;
  postedBy?: string;
  createdAt: string;
  status?: "open" | "assigned" | "completed";
}

export interface Worker {
  id: string;
  name: string;
  avatar: string;
  title: string;
  category: Exclude<CategoryType, "All">;
  subCategory?: string;
  rating: number;
  hourlyRate: number;
  bio: string;
  badges: Array<"Verified Identity" | "Top Rated" | "Background Checked">;
  completedJobs: number;
  location: string;
  city?: string;
  experience?: number;
  availability?: string;
  skills: string[];
}

export interface SmartMatchResult {
  workerId: string;
  matchPercentage: number;
  reason: string;
  highlightSkill: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
  jobCategory: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  bio: string;
  headline: string;
  location: string;
  isIdVerified: boolean;
  skills: string[];
  photoURL?: string;
  emailNotifications?: boolean;
}

export interface HireRecord {
  id: string;
  transactionId: string;
  jobTitle: string;
  category: Exclude<CategoryType, "All">;
  workerName: string;
  workerAvatar: string;
  workerTitle: string;
  workerId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  location: string;
  durationLabel: string;
  subtotal: number;
  gstAmount: number;
  totalPrice: number;
  paymentMethod: string;
  paymentDate: string;
  completionStatus: "payment_escrowed" | "in_progress" | "work_completed" | "released_and_finished";
  proConfirmedTime?: string;
  userRating?: number;
  userReview?: string;
}

export interface ChatMessage {
  id: string;
  sender: "worker" | "user";
  text: string;
  time: string;
}
