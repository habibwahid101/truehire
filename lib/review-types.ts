import type {
  ApplicationStatusValue,
  CompanyStatusValue,
  EmploymentTypeValue,
  InterviewModeValue,
  InterviewStatusValue,
  JobStatusValue,
  QuestionTypeValue,
  WorkplaceTypeValue,
} from "./constants";

export type ReviewCompany = {
  id: string;
  name: string;
  slug: string;
  logoKey: string | null;
  industry: string | null;
  website: string | null;
  location: string | null;
  overview: string | null;
  status: CompanyStatusValue;
  internalNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count: { jobs: number };
};

export type ReviewQuestion = {
  id: string;
  jobId: string;
  question: string;
  type: QuestionTypeValue;
  options: string[];
  required: boolean;
  sortOrder: number;
};

export type ReviewJob = {
  id: string;
  companyId: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  location: string;
  workplaceType: WorkplaceTypeValue;
  employmentType: EmploymentTypeValue;
  vacancyCount: number;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryDisplay: string | null;
  salaryNegotiable: boolean;
  educationRequirement: string | null;
  experienceRequirement: string | null;
  relevantExperience: string | null;
  skills: string[];
  responsibilities: string;
  preferredQualifications: string | null;
  benefits: string | null;
  workingDays: string | null;
  workingHours: string | null;
  probation: string | null;
  joiningExpectation: string | null;
  applicationDeadline: Date | null;
  terms: string | null;
  instructions: string | null;
  requirePortfolio: boolean;
  requireLinkedIn: boolean;
  status: JobStatusValue;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  company: ReviewCompany;
  questions: ReviewQuestion[];
  _count: { applications: number };
};

export type ReviewEvaluation = {
  id: string;
  applicationId: string;
  rating: number | null;
  strengths: string | null;
  concerns: string | null;
  internalNote: string | null;
  recommendedAction: string | null;
  createdById: string | null;
  updatedById: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ReviewInterview = {
  id: string;
  applicationId: string;
  scheduledAt: Date;
  timezone: string;
  mode: InterviewModeValue;
  location: string | null;
  meetingUrl: string | null;
  interviewer: string | null;
  candidateInstruction: string | null;
  internalNote: string | null;
  status: InterviewStatusValue;
  cancellationReason: string | null;
  createdById: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ReviewActivity = {
  id: string;
  applicationId: string;
  actorId: string | null;
  actor: { name: string } | null;
  eventType: string;
  summary: string;
  metadata: unknown;
  createdAt: Date;
};

export type ReviewAnswer = {
  id: string;
  question: ReviewQuestion;
  value: string;
};

export type ReviewApplicationRecord = {
  id: string;
  publicReference: string;
  jobId: string;
  candidateName: string;
  phone: string;
  phoneNormalized: string;
  email: string;
  emailNormalized: string;
  currentLocation: string;
  permanentAddress: string | null;
  highestEducation: string;
  institution: string | null;
  subjectMajor: string | null;
  employmentStatus: string;
  currentCompany: string | null;
  currentDesignation: string | null;
  totalExperienceYrs: string | number;
  relevantExperience: string | null;
  skills: string;
  currentSalary: number | null;
  expectedSalary: number | null;
  noticePeriod: string | null;
  earliestJoinDate: Date | null;
  suitability: string;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  cvKey: string;
  cvFileName: string;
  cvMimeType: string;
  supportingKey: string | null;
  supportingFileName: string | null;
  termsAccepted: boolean;
  accuracyConfirmed: boolean;
  consentAccepted: boolean;
  status: ApplicationStatusValue;
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type ReviewApplication = ReviewApplicationRecord & {
  job: ReviewJob;
  evaluation: ReviewEvaluation | null;
  interviews: ReviewInterview[];
  activities: ReviewActivity[];
  answers: ReviewAnswer[];
};

export type ReviewInterviewHydrated = ReviewInterview & {
  application: ReviewApplication;
};
