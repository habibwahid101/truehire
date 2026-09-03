-- CreateEnum
CREATE TYPE "CompanyStatus" AS ENUM ('ACTIVE', 'INACTIVE');
CREATE TYPE "JobStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CLOSED');
CREATE TYPE "WorkplaceType" AS ENUM ('ONSITE', 'REMOTE', 'HYBRID');
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'TEMPORARY');
CREATE TYPE "QuestionType" AS ENUM ('SHORT_TEXT', 'LONG_TEXT', 'YES_NO', 'SINGLE_CHOICE', 'NUMERIC');
CREATE TYPE "ApplicationStatus" AS ENUM ('NEW', 'REVIEWING', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'INTERVIEWED', 'SELECTED', 'HOLD', 'REJECTED', 'NO_SHOW');
CREATE TYPE "InterviewMode" AS ENUM ('IN_PERSON', 'PHONE', 'GOOGLE_MEET', 'ZOOM', 'OTHER_ONLINE');
CREATE TYPE "InterviewStatus" AS ENUM ('SCHEDULED', 'RESCHEDULED', 'CANCELLED', 'ATTENDED', 'NO_SHOW');
CREATE TYPE "ActivityEventType" AS ENUM ('APPLICATION_SUBMITTED', 'APPLICATION_OPENED', 'STATUS_CHANGED', 'EVALUATION_UPDATED', 'INTERVIEW_SCHEDULED', 'INTERVIEW_RESCHEDULED', 'INTERVIEW_CANCELLED', 'INTERVIEW_ATTENDED', 'INTERVIEW_NO_SHOW', 'NOTE_ADDED');

CREATE TABLE "AdminUser" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

CREATE TABLE "Company" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "logoKey" TEXT,
  "industry" TEXT,
  "website" TEXT,
  "location" TEXT,
  "overview" TEXT,
  "status" "CompanyStatus" NOT NULL DEFAULT 'ACTIVE',
  "internalNotes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Company_slug_key" ON "Company"("slug");
CREATE INDEX "Company_status_idx" ON "Company"("status");

CREATE TABLE "Job" (
  "id" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "workplaceType" "WorkplaceType" NOT NULL,
  "employmentType" "EmploymentType" NOT NULL,
  "vacancyCount" INTEGER NOT NULL DEFAULT 1,
  "salaryMin" INTEGER,
  "salaryMax" INTEGER,
  "salaryDisplay" TEXT,
  "salaryNegotiable" BOOLEAN NOT NULL DEFAULT false,
  "educationRequirement" TEXT,
  "experienceRequirement" TEXT,
  "relevantExperience" TEXT,
  "skills" TEXT[],
  "responsibilities" TEXT NOT NULL,
  "preferredQualifications" TEXT,
  "benefits" TEXT,
  "workingDays" TEXT,
  "workingHours" TEXT,
  "probation" TEXT,
  "joiningExpectation" TEXT,
  "applicationDeadline" TIMESTAMP(3),
  "terms" TEXT,
  "instructions" TEXT,
  "requirePortfolio" BOOLEAN NOT NULL DEFAULT false,
  "requireLinkedIn" BOOLEAN NOT NULL DEFAULT false,
  "status" "JobStatus" NOT NULL DEFAULT 'DRAFT',
  "publishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Job_slug_key" ON "Job"("slug");
CREATE INDEX "Job_status_applicationDeadline_idx" ON "Job"("status", "applicationDeadline");
CREATE INDEX "Job_companyId_idx" ON "Job"("companyId");
ALTER TABLE "Job" ADD CONSTRAINT "Job_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "JobQuestion" (
  "id" TEXT NOT NULL,
  "jobId" TEXT NOT NULL,
  "question" TEXT NOT NULL,
  "type" "QuestionType" NOT NULL,
  "options" TEXT[],
  "required" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "JobQuestion_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "JobQuestion" ADD CONSTRAINT "JobQuestion_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "Application" (
  "id" TEXT NOT NULL,
  "publicReference" TEXT NOT NULL,
  "jobId" TEXT NOT NULL,
  "candidateName" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "phoneNormalized" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "emailNormalized" TEXT NOT NULL,
  "currentLocation" TEXT NOT NULL,
  "permanentAddress" TEXT,
  "highestEducation" TEXT NOT NULL,
  "institution" TEXT,
  "subjectMajor" TEXT,
  "employmentStatus" TEXT NOT NULL,
  "currentCompany" TEXT,
  "currentDesignation" TEXT,
  "totalExperienceYrs" DECIMAL(4,1) NOT NULL,
  "relevantExperience" TEXT,
  "skills" TEXT NOT NULL,
  "currentSalary" INTEGER,
  "expectedSalary" INTEGER,
  "noticePeriod" TEXT,
  "earliestJoinDate" TIMESTAMP(3),
  "suitability" TEXT NOT NULL,
  "linkedinUrl" TEXT,
  "portfolioUrl" TEXT,
  "cvKey" TEXT NOT NULL,
  "cvFileName" TEXT NOT NULL,
  "cvMimeType" TEXT NOT NULL,
  "supportingKey" TEXT,
  "supportingFileName" TEXT,
  "termsAccepted" BOOLEAN NOT NULL,
  "accuracyConfirmed" BOOLEAN NOT NULL,
  "consentAccepted" BOOLEAN NOT NULL,
  "status" "ApplicationStatus" NOT NULL DEFAULT 'NEW',
  "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Application_publicReference_key" ON "Application"("publicReference");
CREATE INDEX "Application_jobId_status_idx" ON "Application"("jobId", "status");
CREATE INDEX "Application_emailNormalized_jobId_idx" ON "Application"("emailNormalized", "jobId");
CREATE INDEX "Application_phoneNormalized_jobId_idx" ON "Application"("phoneNormalized", "jobId");
CREATE INDEX "Application_status_submittedAt_idx" ON "Application"("status", "submittedAt");
ALTER TABLE "Application" ADD CONSTRAINT "Application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "ApplicationAnswer" (
  "id" TEXT NOT NULL,
  "applicationId" TEXT NOT NULL,
  "questionId" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  CONSTRAINT "ApplicationAnswer_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "ApplicationAnswer" ADD CONSTRAINT "ApplicationAnswer_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ApplicationAnswer" ADD CONSTRAINT "ApplicationAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "JobQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "CandidateEvaluation" (
  "id" TEXT NOT NULL,
  "applicationId" TEXT NOT NULL,
  "rating" INTEGER,
  "strengths" TEXT,
  "concerns" TEXT,
  "internalNote" TEXT,
  "recommendedAction" TEXT,
  "createdById" TEXT,
  "updatedById" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CandidateEvaluation_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "CandidateEvaluation_applicationId_key" ON "CandidateEvaluation"("applicationId");
ALTER TABLE "CandidateEvaluation" ADD CONSTRAINT "CandidateEvaluation_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CandidateEvaluation" ADD CONSTRAINT "CandidateEvaluation_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "Interview" (
  "id" TEXT NOT NULL,
  "applicationId" TEXT NOT NULL,
  "scheduledAt" TIMESTAMP(3) NOT NULL,
  "timezone" TEXT NOT NULL DEFAULT 'Asia/Dhaka',
  "mode" "InterviewMode" NOT NULL,
  "location" TEXT,
  "meetingUrl" TEXT,
  "interviewer" TEXT,
  "candidateInstruction" TEXT,
  "internalNote" TEXT,
  "status" "InterviewStatus" NOT NULL DEFAULT 'SCHEDULED',
  "cancellationReason" TEXT,
  "createdById" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Interview_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Interview_scheduledAt_status_idx" ON "Interview"("scheduledAt", "status");
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "ApplicationActivity" (
  "id" TEXT NOT NULL,
  "applicationId" TEXT NOT NULL,
  "actorId" TEXT,
  "eventType" "ActivityEventType" NOT NULL,
  "summary" TEXT NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ApplicationActivity_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ApplicationActivity_applicationId_createdAt_idx" ON "ApplicationActivity"("applicationId", "createdAt");
ALTER TABLE "ApplicationActivity" ADD CONSTRAINT "ApplicationActivity_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ApplicationActivity" ADD CONSTRAINT "ApplicationActivity_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "ApplicationCounter" (
  "year" INTEGER NOT NULL,
  "last" INTEGER NOT NULL,
  CONSTRAINT "ApplicationCounter_pkey" PRIMARY KEY ("year")
);
