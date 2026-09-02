export const APP_NAME = "TrueHire";
export const SESSION_COOKIE = "th_admin";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
export const MAX_CV_BYTES = 8 * 1024 * 1024;
export const ALLOWED_CV_EXT = [".pdf", ".doc", ".docx"];
export const ALLOWED_CV_MIME = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const APPLICATION_STATUSES = [
  "NEW",
  "REVIEWING",
  "SHORTLISTED",
  "INTERVIEW_SCHEDULED",
  "INTERVIEWED",
  "SELECTED",
  "HOLD",
  "REJECTED",
  "NO_SHOW",
] as const;
export type ApplicationStatusValue = (typeof APPLICATION_STATUSES)[number];
export const APPLICATION_STATUS_LABELS: Record<ApplicationStatusValue, string> = {
  NEW: "New",
  REVIEWING: "Reviewing",
  SHORTLISTED: "Shortlisted",
  INTERVIEW_SCHEDULED: "Interview scheduled",
  INTERVIEWED: "Interviewed",
  SELECTED: "Selected",
  HOLD: "Hold",
  REJECTED: "Rejected",
  NO_SHOW: "No-show",
};

export const JOB_STATUSES = ["DRAFT", "PUBLISHED", "CLOSED"] as const;
export type JobStatusValue = (typeof JOB_STATUSES)[number];
export const JOB_STATUS_LABELS: Record<JobStatusValue, string> = { DRAFT: "Draft", PUBLISHED: "Published", CLOSED: "Closed" };
export const WORKPLACE_TYPES = ["ONSITE", "REMOTE", "HYBRID"] as const;
export type WorkplaceTypeValue = (typeof WORKPLACE_TYPES)[number];
export const WORKPLACE_LABELS: Record<WorkplaceTypeValue, string> = { ONSITE: "On-site", REMOTE: "Remote", HYBRID: "Hybrid" };
export const EMPLOYMENT_TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "TEMPORARY"] as const;
export type EmploymentTypeValue = (typeof EMPLOYMENT_TYPES)[number];
export const EMPLOYMENT_LABELS = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
  TEMPORARY: "Temporary",
} as const;
export const QUESTION_TYPES = ["SHORT_TEXT", "LONG_TEXT", "YES_NO", "SINGLE_CHOICE", "NUMERIC"] as const;
export type QuestionTypeValue = (typeof QUESTION_TYPES)[number];
export const QUESTION_TYPE_LABELS = {
  SHORT_TEXT: "Short text",
  LONG_TEXT: "Long text",
  YES_NO: "Yes / No",
  SINGLE_CHOICE: "Single choice",
  NUMERIC: "Numeric",
} as const;
export const INTERVIEW_MODES = ["IN_PERSON", "PHONE", "GOOGLE_MEET", "ZOOM", "OTHER_ONLINE"] as const;
export type InterviewModeValue = (typeof INTERVIEW_MODES)[number];
export const INTERVIEW_MODE_LABELS = {
  IN_PERSON: "In-person",
  PHONE: "Phone",
  GOOGLE_MEET: "Google Meet",
  ZOOM: "Zoom",
  OTHER_ONLINE: "Other online",
} as const;
export const INTERVIEW_STATUSES = ["SCHEDULED", "RESCHEDULED", "CANCELLED", "ATTENDED", "NO_SHOW"] as const;
export type InterviewStatusValue = (typeof INTERVIEW_STATUSES)[number];
export const COMPANY_STATUSES = ["ACTIVE", "INACTIVE"] as const;
export type CompanyStatusValue = (typeof COMPANY_STATUSES)[number];
export const INTERVIEW_STATUS_LABELS = {
  SCHEDULED: "Scheduled",
  RESCHEDULED: "Rescheduled",
  CANCELLED: "Cancelled",
  ATTENDED: "Attended",
  NO_SHOW: "No-show",
} as const;
export const EDUCATION_OPTIONS = [
  "SSC / O-Level",
  "HSC / A-Level",
  "Diploma",
  "Bachelor's",
  "Master's",
  "MPhil / PhD",
  "Professional certification",
  "Other",
];
export const EMPLOYMENT_STATUS_OPTIONS = [
  "Employed",
  "Unemployed",
  "Student",
  "Freelance / Contract",
  "Between roles",
];
