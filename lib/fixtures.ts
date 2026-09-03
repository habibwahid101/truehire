/**
 * Review-only fixture data.
 * Isolated from production paths. Replace calls via liveOrFixture() when the database is live.
 */

import type {
  ReviewActivity,
  ReviewApplication,
  ReviewApplicationRecord,
  ReviewCompany,
  ReviewEvaluation,
  ReviewInterview,
  ReviewInterviewHydrated,
  ReviewJob,
  ReviewQuestion,
} from "./review-types";

export type {
  ReviewActivity,
  ReviewApplication,
  ReviewApplicationRecord,
  ReviewCompany,
  ReviewEvaluation,
  ReviewInterview,
  ReviewInterviewHydrated,
  ReviewJob,
  ReviewQuestion,
} from "./review-types";

const now = Date.now();
const days = (n: number) => new Date(now + n * 86400000);

export const fixtureCompanies: ReviewCompany[] = [
  { id: "co_northridge", name: "Northridge Apparel Ltd", slug: "northridge-apparel", logoKey: null, industry: "Apparel manufacturing", website: "https://northridge.example", location: "Gazipur", overview: "Mid-sized woven manufacturer. Factory-adjacent and operational.", status: "ACTIVE", internalNotes: "Primary operations partner.", createdAt: days(-120), updatedAt: days(-2), _count: { jobs: 2 } },
  { id: "co_helix", name: "Helix Digital", slug: "helix-digital", logoKey: null, industry: "Software services", website: "https://helix.example", location: "Dhaka", overview: "Operational software for local businesses.", status: "ACTIVE", internalNotes: "Prefers 30-day joiners.", createdAt: days(-80), updatedAt: days(-1), _count: { jobs: 1 } },
];

function reviewCompany(id: string): ReviewCompany {
  return fixtureCompanies.find((company) => company.id === id) ?? fixtureCompanies[0];
}

export const fixtureQuestions: ReviewQuestion[] = [
  { id: "q1", jobId: "job_prod", question: "Have you worked in a factory or production office before?", type: "YES_NO", options: ["Yes", "No"], required: true, sortOrder: 0 },
  { id: "q2", jobId: "job_prod", question: "Which ERP or production tools have you used?", type: "SHORT_TEXT", options: [], required: false, sortOrder: 1 },
];

export const fixtureJobs: ReviewJob[] = [
  { id: "job_prod", companyId: "co_northridge", slug: "production-coordinator", title: "Production Coordinator", summary: "Coordinate daily production plans and keep merchandising informed of delays.", description: "This role sits between planning and the production floor. Accuracy and calm follow-up matter more than presentation.", location: "Gazipur", workplaceType: "ONSITE", employmentType: "FULL_TIME", vacancyCount: 1, salaryMin: 45000, salaryMax: 60000, salaryDisplay: "BDT 45,000 – 60,000", salaryNegotiable: true, educationRequirement: "Bachelor's in any discipline", experienceRequirement: "2–4 years in production or planning", relevantExperience: "Apparel operations preferred", skills: ["Production planning", "Follow-up", "Excel"], responsibilities: "Prepare daily plans.\nWalk the floor.\nReport delivery risk early.", preferredQualifications: "Woven manufacturing experience.", benefits: "Salary as advertised. Festival bonus as per policy.", workingDays: "Saturday–Thursday", workingHours: "8:30am – 6:00pm", probation: "3 months", joiningExpectation: "Within 30 days", applicationDeadline: days(21), terms: "Employment is with Northridge Apparel Ltd. On-site six days a week. An application is not an offer.", instructions: "Apply through this page only.", requirePortfolio: false, requireLinkedIn: false, status: "PUBLISHED", publishedAt: days(-10), createdAt: days(-12), updatedAt: days(-1), company: reviewCompany("co_northridge"), questions: fixtureQuestions, _count: { applications: 4 } },
  { id: "job_cs", companyId: "co_helix", slug: "customer-support-executive", title: "Customer Support Executive", summary: "Handle inbound queries and follow cases through to a documented close.", description: "Receive, classify, resolve or escalate, and write a short record of what happened.", location: "Dhaka", workplaceType: "HYBRID", employmentType: "FULL_TIME", vacancyCount: 2, salaryMin: 32000, salaryMax: 42000, salaryDisplay: "BDT 32,000 – 42,000", salaryNegotiable: false, educationRequirement: "Bachelor's", experienceRequirement: "1–3 years in support or operations", relevantExperience: "Service-desk experience is useful", skills: ["Written English", "Ticketing"], responsibilities: "Respond within the service window.\nLog every case.\nClose only with a usable answer.", preferredQualifications: "Two office days in Gulshan after probation.", benefits: "Salary as advertised.", workingDays: "Sunday–Thursday", workingHours: "9:00am – 6:00pm", probation: "3 months", joiningExpectation: "Immediate to 15 days", applicationDeadline: days(14), terms: "Employment is with Helix Digital. Application does not guarantee an interview.", instructions: "Mention any notice period clearly.", requirePortfolio: false, requireLinkedIn: true, status: "PUBLISHED", publishedAt: days(-6), createdAt: days(-7), updatedAt: days(-1), company: reviewCompany("co_helix"), questions: [], _count: { applications: 2 } },
  { id: "job_fin", companyId: "co_northridge", slug: "finance-officer", title: "Finance Officer", summary: "This role is closed. It remains available so the closed-job state can be reviewed.", description: "Accounts payable support.", location: "Dhaka", workplaceType: "ONSITE", employmentType: "FULL_TIME", vacancyCount: 1, salaryMin: 40000, salaryMax: 50000, salaryDisplay: "BDT 40,000 – 50,000", salaryNegotiable: false, educationRequirement: "BBA / Accounting", experienceRequirement: "2 years", relevantExperience: null, skills: ["Accounting", "Excel"], responsibilities: "Process supplier invoices.", preferredQualifications: null, benefits: null, workingDays: "Sunday–Thursday", workingHours: "9:00am – 6:00pm", probation: "3 months", joiningExpectation: "Immediate", applicationDeadline: days(-3), terms: "This vacancy is no longer accepting applications.", instructions: null, requirePortfolio: false, requireLinkedIn: false, status: "CLOSED", publishedAt: days(-40), createdAt: days(-45), updatedAt: days(-3), company: reviewCompany("co_northridge"), questions: [], _count: { applications: 1 } },
];

function app(partial: Partial<ReviewApplicationRecord> & Pick<ReviewApplicationRecord, "id" | "publicReference" | "jobId" | "candidateName" | "phone" | "email" | "currentLocation" | "highestEducation" | "employmentStatus" | "totalExperienceYrs" | "skills" | "suitability" | "cvKey" | "cvFileName" | "status" | "submittedAt">): ReviewApplicationRecord {
  return {
    phoneNormalized: "",
    emailNormalized: "",
    permanentAddress: "",
    institution: "",
    subjectMajor: "",
    currentCompany: null,
    currentDesignation: null,
    relevantExperience: "",
    linkedinUrl: null,
    portfolioUrl: null,
    supportingKey: null,
    supportingFileName: null,
    cvMimeType: "application/pdf",
    termsAccepted: true,
    accuracyConfirmed: true,
    consentAccepted: true,
    createdAt: days(-3),
    updatedAt: days(-1),
    expectedSalary: null,
    currentSalary: null,
    noticePeriod: null,
    earliestJoinDate: null,
    ...partial,
  };
}

export const fixtureApplications: ReviewApplicationRecord[] = [
  app({ id: "app_1", publicReference: "TH-2026-000128", jobId: "job_prod", candidateName: "Farhana Rahman", phone: "01711-220045", email: "farhana.rahman@example.com", currentLocation: "Uttara, Dhaka", highestEducation: "Bachelor's", employmentStatus: "Employed", currentCompany: "Eastline Fashions", currentDesignation: "Junior Planner", totalExperienceYrs: 3, skills: "Planning, Excel, follow-up", currentSalary: 38000, expectedSalary: 50000, noticePeriod: "30 days", earliestJoinDate: days(35), suitability: "I already coordinate daily targets between planning and the floor and can work on-site in Gazipur.", cvKey: "fixtures/farhana.pdf", cvFileName: "Farhana-Rahman-CV.pdf", status: "SHORTLISTED", submittedAt: days(-4) }),
  app({ id: "app_2", publicReference: "TH-2026-000129", jobId: "job_prod", candidateName: "Mahmudul Hasan", phone: "01819-667721", email: "mahmudul.hasan@example.com", currentLocation: "Gazipur", highestEducation: "Bachelor's", employmentStatus: "Employed", currentCompany: "Delta Knit", currentDesignation: "Production Assistant", totalExperienceYrs: 2.5, skills: "Floor coordination", currentSalary: 30000, expectedSalary: 42000, noticePeriod: "15 days", earliestJoinDate: days(20), suitability: "I live near the facility and already do daily line follow-up for planning.", cvKey: "fixtures/mahmudul.pdf", cvFileName: "Mahmudul-Hasan-CV.pdf", status: "INTERVIEW_SCHEDULED", submittedAt: days(-5) }),
  app({ id: "app_3", publicReference: "TH-2026-000130", jobId: "job_cs", candidateName: "Nusrat Jahan", phone: "01612-448890", email: "nusrat.jahan@example.com", currentLocation: "Banani, Dhaka", highestEducation: "Bachelor's", employmentStatus: "Between roles", totalExperienceYrs: 2, skills: "Written English, Zendesk", currentSalary: null, expectedSalary: 40000, noticePeriod: "Immediate", earliestJoinDate: days(7), suitability: "I write concise case notes and own a ticket until it is actually closed.", linkedinUrl: "https://linkedin.com/in/example-nusrat", cvKey: "fixtures/nusrat.pdf", cvFileName: "Nusrat-Jahan-CV.pdf", status: "NEW", submittedAt: days(-1) }),
  app({ id: "app_4", publicReference: "TH-2026-000131", jobId: "job_cs", candidateName: "Tanvir Ahmed", phone: "01911-300212", email: "tanvir.ahmed@example.com", currentLocation: "Mirpur, Dhaka", highestEducation: "Bachelor's", employmentStatus: "Employed", currentCompany: "Local ISP", currentDesignation: "Support Officer", totalExperienceYrs: 4, skills: "Troubleshooting", currentSalary: 36000, expectedSalary: 48000, noticePeriod: "60 days", earliestJoinDate: days(70), suitability: "Strong operational support background, though the notice period is long.", cvKey: "fixtures/tanvir.pdf", cvFileName: "Tanvir-Ahmed-CV.pdf", status: "REVIEWING", submittedAt: days(-3) }),
  app({ id: "app_5", publicReference: "TH-2026-000132", jobId: "job_prod", candidateName: "Rokeya Sultana", phone: "01552-119933", email: "rokeya.sultana@example.com", currentLocation: "Narayanganj", highestEducation: "Master's", employmentStatus: "Unemployed", totalExperienceYrs: 1, skills: "Excel, documentation", currentSalary: null, expectedSalary: 35000, noticePeriod: "Immediate", earliestJoinDate: days(5), suitability: "Limited production experience. Strong documentation habits and availability.", cvKey: "fixtures/rokeya.pdf", cvFileName: "Rokeya-Sultana-CV.pdf", status: "HOLD", submittedAt: days(-8) }),
];

export const fixtureEvaluations: ReviewEvaluation[] = [
  { id: "ev_1", applicationId: "app_1", rating: 4, strengths: "Relevant planning background.", concerns: "30-day notice.", internalNote: "Confirm Gazipur commute.", recommendedAction: "Schedule on-site interview.", createdById: "admin_review", updatedById: "admin_review", createdAt: days(-2), updatedAt: days(-1) },
];

export const fixtureInterviews: ReviewInterview[] = [
  { id: "int_1", applicationId: "app_2", scheduledAt: days(2), timezone: "Asia/Dhaka", mode: "IN_PERSON", location: "Northridge factory office, Gazipur", meetingUrl: null, interviewer: "Head of Planning", candidateInstruction: "Bring a printed CV.", internalNote: "Confirm transport.", status: "SCHEDULED", cancellationReason: null, createdById: "admin_review", createdAt: days(-1), updatedAt: days(-1) },
];

export const fixtureActivities: ReviewActivity[] = [
  { id: "act_1", applicationId: "app_1", actorId: null, actor: { name: "System" }, eventType: "APPLICATION_SUBMITTED", summary: "Application submitted", metadata: null, createdAt: days(-4) },
  { id: "act_2", applicationId: "app_1", actorId: "admin_review", actor: { name: "Amina Chowdhury" }, eventType: "APPLICATION_OPENED", summary: "Application opened for review", metadata: null, createdAt: days(-3) },
  { id: "act_3", applicationId: "app_1", actorId: "admin_review", actor: { name: "Amina Chowdhury" }, eventType: "EVALUATION_UPDATED", summary: "Internal evaluation updated", metadata: null, createdAt: days(-2) },
  { id: "act_4", applicationId: "app_1", actorId: "admin_review", actor: { name: "Amina Chowdhury" }, eventType: "STATUS_CHANGED", summary: "Status changed to Shortlisted", metadata: null, createdAt: days(-1) },
  { id: "act_5", applicationId: "app_2", actorId: null, actor: { name: "System" }, eventType: "APPLICATION_SUBMITTED", summary: "Application submitted", metadata: null, createdAt: days(-5) },
  { id: "act_6", applicationId: "app_2", actorId: "admin_review", actor: { name: "Amina Chowdhury" }, eventType: "INTERVIEW_SCHEDULED", summary: "Interview scheduled at the Gazipur office", metadata: null, createdAt: days(-1) },
];

export const fixtureAdmin = { sub: "admin_review", email: "admin@truehire.local", name: "Amina Chowdhury" };

export function jobsWithCompany(): ReviewJob[] {
  return fixtureJobs.map((job) => ({
    ...job,
    company: reviewCompany(job.companyId),
  }));
}

export function applicationsHydrated(): ReviewApplication[] {
  const jobs = jobsWithCompany();
  return fixtureApplications.map((item) => {
    const job = jobs.find((entry) => entry.id === item.jobId) ?? jobs[0];
    return {
      ...item,
      job,
      evaluation: fixtureEvaluations.find((entry) => entry.applicationId === item.id) ?? null,
      interviews: fixtureInterviews.filter((entry) => entry.applicationId === item.id),
      activities: fixtureActivities.filter((entry) => entry.applicationId === item.id),
      answers: item.id === "app_1"
        ? [
            { id: "ans1", question: fixtureQuestions[0], value: "Yes" },
            { id: "ans2", question: fixtureQuestions[1], value: "Excel trackers" },
          ]
        : [],
    };
  });
}

export function interviewsHydrated(): ReviewInterviewHydrated[] {
  const apps = applicationsHydrated();
  return fixtureInterviews.map((item) => ({
    ...item,
    application: apps.find((entry) => entry.id === item.applicationId) ?? apps[0],
  }));
}
