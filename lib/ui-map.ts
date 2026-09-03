import {
  APPLICATION_STATUSES,
  COMPANY_STATUSES,
  EMPLOYMENT_TYPES,
  INTERVIEW_MODES,
  INTERVIEW_STATUSES,
  JOB_STATUSES,
  QUESTION_TYPES,
  WORKPLACE_TYPES,
  type ApplicationStatusValue,
  type CompanyStatusValue,
  type EmploymentTypeValue,
  type InterviewModeValue,
  type InterviewStatusValue,
  type JobStatusValue,
  type QuestionTypeValue,
  type WorkplaceTypeValue,
} from "./constants";
import type {
  AdminApplicationDetail,
  AdminApplicationListItem,
  AdminCompanyItem,
  AdminInterviewItem,
  AdminJobItem,
  AdminJobListItem,
  AdminPublicApplication,
  AdminQuestion,
  ReviewActivity,
  ReviewAnswer,
  ReviewApplication,
  ReviewCompany,
  ReviewEvaluation,
  ReviewInterview,
  ReviewJob,
  ReviewQuestion,
} from "./review-types";

export function uiNumber(value: unknown): number {
  if (value == null || value === "") return 0;
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (typeof value === "object" && value && "toNumber" in value && typeof (value as { toNumber: () => number }).toNumber === "function") {
    const parsed = (value as { toNumber: () => number }).toNumber();
    return Number.isFinite(parsed) ? parsed : 0;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function uiNullableNumber(value: unknown): number | null {
  if (value == null || value === "") return null;
  return uiNumber(value);
}

function pick<T extends string>(value: string, allowed: readonly T[], fallback: T): T {
  return (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

type CompanyRow = {
  id: string;
  name: string;
  slug: string;
  logoKey?: string | null;
  industry?: string | null;
  website?: string | null;
  location?: string | null;
  overview?: string | null;
  status: string;
  internalNotes?: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count?: { jobs?: number };
};

type QuestionRow = {
  id: string;
  jobId: string;
  question: string;
  type: string;
  options: string[];
  required: boolean;
  sortOrder: number;
};

type JobRow = {
  id: string;
  companyId: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  location: string;
  workplaceType: string;
  employmentType: string;
  vacancyCount: number;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryDisplay?: string | null;
  salaryNegotiable?: boolean;
  educationRequirement?: string | null;
  experienceRequirement?: string | null;
  relevantExperience?: string | null;
  skills: string[];
  responsibilities: string;
  preferredQualifications?: string | null;
  benefits?: string | null;
  workingDays?: string | null;
  workingHours?: string | null;
  probation?: string | null;
  joiningExpectation?: string | null;
  applicationDeadline?: Date | null;
  terms?: string | null;
  instructions?: string | null;
  requirePortfolio?: boolean;
  requireLinkedIn?: boolean;
  status: string;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  company?: CompanyRow;
  questions?: QuestionRow[];
  _count?: { applications?: number };
};

type ApplicationRow = {
  id: string;
  publicReference: string;
  jobId: string;
  candidateName: string;
  phone: string;
  phoneNormalized?: string;
  email: string;
  emailNormalized?: string;
  currentLocation: string;
  permanentAddress?: string | null;
  highestEducation: string;
  institution?: string | null;
  subjectMajor?: string | null;
  employmentStatus: string;
  currentCompany?: string | null;
  currentDesignation?: string | null;
  totalExperienceYrs: unknown;
  relevantExperience?: string | null;
  skills: string;
  currentSalary?: number | null;
  expectedSalary?: number | null;
  noticePeriod?: string | null;
  earliestJoinDate?: Date | null;
  suitability: string;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
  cvKey: string;
  cvFileName: string;
  cvMimeType: string;
  supportingKey?: string | null;
  supportingFileName?: string | null;
  termsAccepted?: boolean;
  accuracyConfirmed?: boolean;
  consentAccepted?: boolean;
  status: string;
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  job?: JobRow;
  evaluation?: {
    id: string;
    applicationId: string;
    rating?: number | null;
    strengths?: string | null;
    concerns?: string | null;
    internalNote?: string | null;
    recommendedAction?: string | null;
    createdById?: string | null;
    updatedById?: string | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  interviews?: InterviewRow[];
  activities?: {
    id: string;
    applicationId: string;
    actorId?: string | null;
    actor?: { name: string } | null;
    eventType: string;
    summary: string;
    metadata?: unknown;
    createdAt: Date;
  }[];
  answers?: { id: string; value: string; question: QuestionRow }[];
};

type InterviewRow = {
  id: string;
  applicationId: string;
  scheduledAt: Date;
  timezone?: string;
  mode: string;
  location?: string | null;
  meetingUrl?: string | null;
  interviewer?: string | null;
  candidateInstruction?: string | null;
  internalNote?: string | null;
  status: string;
  cancellationReason?: string | null;
  createdById?: string | null;
  createdAt: Date;
  updatedAt: Date;
  application?: ApplicationRow;
};

export function mapAdminCompany(row: CompanyRow): AdminCompanyItem {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    logoKey: row.logoKey ?? null,
    industry: row.industry ?? null,
    website: row.website ?? null,
    location: row.location ?? null,
    overview: row.overview ?? null,
    status: pick(row.status, COMPANY_STATUSES, "ACTIVE"),
    internalNotes: row.internalNotes ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    _count: { jobs: row._count?.jobs ?? 0 },
  };
}

export function mapAdminQuestion(row: QuestionRow): ReviewQuestion {
  return {
    id: row.id,
    jobId: row.jobId,
    question: row.question,
    type: pick(row.type, QUESTION_TYPES, "SHORT_TEXT"),
    options: row.options ?? [],
    required: row.required,
    sortOrder: row.sortOrder,
  };
}

export function mapAdminJob(row: JobRow, companyFallback?: ReviewCompany): AdminJobItem {
  const company = row.company ? mapAdminCompany(row.company) : companyFallback ?? {
    id: row.companyId,
    name: "",
    slug: "",
    logoKey: null,
    industry: null,
    website: null,
    location: null,
    overview: null,
    status: "ACTIVE",
    internalNotes: null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    _count: { jobs: 0 },
  };
  return {
    id: row.id,
    companyId: row.companyId,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    description: row.description,
    location: row.location,
    workplaceType: pick(row.workplaceType, WORKPLACE_TYPES, "ONSITE"),
    employmentType: pick(row.employmentType, EMPLOYMENT_TYPES, "FULL_TIME"),
    vacancyCount: row.vacancyCount,
    salaryMin: row.salaryMin ?? null,
    salaryMax: row.salaryMax ?? null,
    salaryDisplay: row.salaryDisplay ?? null,
    salaryNegotiable: row.salaryNegotiable ?? false,
    educationRequirement: row.educationRequirement ?? null,
    experienceRequirement: row.experienceRequirement ?? null,
    relevantExperience: row.relevantExperience ?? null,
    skills: row.skills ?? [],
    responsibilities: row.responsibilities,
    preferredQualifications: row.preferredQualifications ?? null,
    benefits: row.benefits ?? null,
    workingDays: row.workingDays ?? null,
    workingHours: row.workingHours ?? null,
    probation: row.probation ?? null,
    joiningExpectation: row.joiningExpectation ?? null,
    applicationDeadline: row.applicationDeadline ?? null,
    terms: row.terms ?? null,
    instructions: row.instructions ?? null,
    requirePortfolio: row.requirePortfolio ?? false,
    requireLinkedIn: row.requireLinkedIn ?? false,
    status: pick(row.status, JOB_STATUSES, "DRAFT"),
    publishedAt: row.publishedAt ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    company,
    questions: (row.questions ?? []).map(mapAdminQuestion),
    _count: { applications: row._count?.applications ?? 0 },
  };
}

export function mapAdminJobListItem(row: JobRow): AdminJobListItem {
  const job = mapAdminJob(row);
  return {
    id: job.id,
    slug: job.slug,
    title: job.title,
    status: job.status,
    applicationDeadline: job.applicationDeadline,
    company: { id: job.company.id, name: job.company.name },
    _count: job._count,
  };
}

export function mapAdminApplicationListItem(row: ApplicationRow): AdminApplicationListItem {
  const job = row.job ? mapAdminJob(row.job) : null;
  return {
    id: row.id,
    publicReference: row.publicReference,
    jobId: row.jobId,
    candidateName: row.candidateName,
    email: row.email,
    phone: row.phone,
    status: pick(row.status, APPLICATION_STATUSES, "NEW"),
    submittedAt: row.submittedAt,
    totalExperienceYrs: uiNumber(row.totalExperienceYrs),
    expectedSalary: row.expectedSalary ?? null,
    job: {
      id: job?.id ?? row.jobId,
      title: job?.title ?? "",
      companyId: job?.companyId ?? "",
      company: { id: job?.company.id ?? "", name: job?.company.name ?? "" },
    },
  };
}

export function mapAdminInterviewRecord(row: InterviewRow): ReviewInterview {
  return {
    id: row.id,
    applicationId: row.applicationId,
    scheduledAt: row.scheduledAt,
    timezone: row.timezone ?? "Asia/Dhaka",
    mode: pick(row.mode, INTERVIEW_MODES, "OTHER_ONLINE"),
    location: row.location ?? null,
    meetingUrl: row.meetingUrl ?? null,
    interviewer: row.interviewer ?? null,
    candidateInstruction: row.candidateInstruction ?? null,
    internalNote: row.internalNote ?? null,
    status: pick(row.status, INTERVIEW_STATUSES, "SCHEDULED"),
    cancellationReason: row.cancellationReason ?? null,
    createdById: row.createdById ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function mapAdminApplicationDetail(row: ApplicationRow): AdminApplicationDetail {
  const job = mapAdminJob(row.job ?? {
    id: row.jobId,
    companyId: "",
    slug: "",
    title: "",
    summary: "",
    description: "",
    location: "",
    workplaceType: "ONSITE",
    employmentType: "FULL_TIME",
    vacancyCount: 1,
    skills: [],
    responsibilities: "",
    status: "PUBLISHED",
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
  const evaluation: ReviewEvaluation | null = row.evaluation
    ? {
        id: row.evaluation.id,
        applicationId: row.evaluation.applicationId,
        rating: row.evaluation.rating ?? null,
        strengths: row.evaluation.strengths ?? null,
        concerns: row.evaluation.concerns ?? null,
        internalNote: row.evaluation.internalNote ?? null,
        recommendedAction: row.evaluation.recommendedAction ?? null,
        createdById: row.evaluation.createdById ?? null,
        updatedById: row.evaluation.updatedById ?? null,
        createdAt: row.evaluation.createdAt,
        updatedAt: row.evaluation.updatedAt,
      }
    : null;
  return {
    id: row.id,
    publicReference: row.publicReference,
    jobId: row.jobId,
    candidateName: row.candidateName,
    phone: row.phone,
    phoneNormalized: row.phoneNormalized ?? row.phone,
    email: row.email,
    emailNormalized: row.emailNormalized ?? row.email,
    currentLocation: row.currentLocation,
    permanentAddress: row.permanentAddress ?? null,
    highestEducation: row.highestEducation,
    institution: row.institution ?? null,
    subjectMajor: row.subjectMajor ?? null,
    employmentStatus: row.employmentStatus,
    currentCompany: row.currentCompany ?? null,
    currentDesignation: row.currentDesignation ?? null,
    totalExperienceYrs: uiNumber(row.totalExperienceYrs),
    relevantExperience: row.relevantExperience ?? null,
    skills: row.skills,
    currentSalary: row.currentSalary ?? null,
    expectedSalary: row.expectedSalary ?? null,
    noticePeriod: row.noticePeriod ?? null,
    earliestJoinDate: row.earliestJoinDate ?? null,
    suitability: row.suitability,
    linkedinUrl: row.linkedinUrl ?? null,
    portfolioUrl: row.portfolioUrl ?? null,
    cvKey: row.cvKey,
    cvFileName: row.cvFileName,
    cvMimeType: row.cvMimeType,
    supportingKey: row.supportingKey ?? null,
    supportingFileName: row.supportingFileName ?? null,
    termsAccepted: row.termsAccepted ?? true,
    accuracyConfirmed: row.accuracyConfirmed ?? true,
    consentAccepted: row.consentAccepted ?? true,
    status: pick(row.status, APPLICATION_STATUSES, "NEW"),
    submittedAt: row.submittedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    job,
    evaluation,
    interviews: (row.interviews ?? []).map(mapAdminInterviewRecord),
    activities: (row.activities ?? []).map((activity) => ({
      id: activity.id,
      applicationId: activity.applicationId,
      actorId: activity.actorId ?? null,
      actor: activity.actor ?? null,
      eventType: activity.eventType,
      summary: activity.summary,
      metadata: activity.metadata ?? null,
      createdAt: activity.createdAt,
    })),
    answers: (row.answers ?? []).map((answer) => ({
      id: answer.id,
      value: answer.value,
      question: mapAdminQuestion(answer.question),
    })),
  };
}

export function mapAdminInterviewItem(row: InterviewRow): AdminInterviewItem {
  const application = row.application
    ? mapAdminApplicationDetail(row.application)
    : mapAdminApplicationDetail({
        id: row.applicationId,
        publicReference: "",
        jobId: "",
        candidateName: "",
        phone: "",
        email: "",
        currentLocation: "",
        highestEducation: "",
        employmentStatus: "",
        totalExperienceYrs: 0,
        skills: "",
        suitability: "",
        cvKey: "",
        cvFileName: "",
        cvMimeType: "",
        status: "NEW",
        submittedAt: row.createdAt,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      });
  return {
    ...mapAdminInterviewRecord(row),
    application,
  };
}

export function mapPublicApplication(row: ApplicationRow): AdminPublicApplication {
  const detail = mapAdminApplicationDetail(row);
  return {
    publicReference: detail.publicReference,
    candidateName: detail.candidateName,
    submittedAt: detail.submittedAt,
    job: {
      title: detail.job.title,
      company: { name: detail.job.company.name },
    },
  };
}

export function asApplicationStatus(value: string): ApplicationStatusValue {
  return pick(value, APPLICATION_STATUSES, "NEW");
}
export function asJobStatus(value: string): JobStatusValue {
  return pick(value, JOB_STATUSES, "DRAFT");
}
export function asCompanyStatus(value: string): CompanyStatusValue {
  return pick(value, COMPANY_STATUSES, "ACTIVE");
}
export function asWorkplace(value: string): WorkplaceTypeValue {
  return pick(value, WORKPLACE_TYPES, "ONSITE");
}
export function asEmployment(value: string): EmploymentTypeValue {
  return pick(value, EMPLOYMENT_TYPES, "FULL_TIME");
}
export function asQuestionType(value: string): QuestionTypeValue {
  return pick(value, QUESTION_TYPES, "SHORT_TEXT");
}
export function asInterviewMode(value: string): InterviewModeValue {
  return pick(value, INTERVIEW_MODES, "OTHER_ONLINE");
}
export function asInterviewStatus(value: string): InterviewStatusValue {
  return pick(value, INTERVIEW_STATUSES, "SCHEDULED");
}

export function mapReviewApplicationToListItem(app: ReviewApplication): AdminApplicationListItem {
  return {
    id: app.id,
    publicReference: app.publicReference,
    jobId: app.jobId,
    candidateName: app.candidateName,
    email: app.email,
    phone: app.phone,
    status: app.status,
    submittedAt: app.submittedAt,
    totalExperienceYrs: uiNumber(app.totalExperienceYrs),
    expectedSalary: app.expectedSalary,
    job: {
      id: app.job.id,
      title: app.job.title,
      companyId: app.job.companyId,
      company: { id: app.job.company.id, name: app.job.company.name },
    },
  };
}
