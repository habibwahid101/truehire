import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_BOOTSTRAP_EMAIL || "admin@truehire.local").toLowerCase();
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD || "change-me-now";
  const name = process.env.ADMIN_BOOTSTRAP_NAME || "TrueHire Admin";
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.adminUser.upsert({
    where: { email },
    update: { name, passwordHash },
    create: { email, name, passwordHash },
  });

  const northridge = await prisma.company.upsert({
    where: { slug: "northridge-apparel" },
    update: { name: "Northridge Apparel Ltd", status: "ACTIVE" },
    create: {
      name: "Northridge Apparel Ltd",
      slug: "northridge-apparel",
      industry: "Apparel manufacturing",
      location: "Gazipur",
      overview: "Mid-sized woven manufacturer. Factory-adjacent and operational.",
      status: "ACTIVE",
    },
  });
  const helix = await prisma.company.upsert({
    where: { slug: "helix-digital" },
    update: { name: "Helix Digital", status: "ACTIVE" },
    create: {
      name: "Helix Digital",
      slug: "helix-digital",
      industry: "Software services",
      location: "Dhaka",
      overview: "Operational software for local businesses.",
      status: "ACTIVE",
    },
  });

  const prodDeadline = new Date(Date.now() + 21 * 86400000);
  const csDeadline = new Date(Date.now() + 14 * 86400000);

  const prod = await prisma.job.upsert({
    where: { slug: "production-coordinator" },
    update: {
      companyId: northridge.id,
      title: "Production Coordinator",
      status: "PUBLISHED",
      publishedAt: new Date(),
      applicationDeadline: prodDeadline,
    },
    create: {
      companyId: northridge.id,
      slug: "production-coordinator",
      title: "Production Coordinator",
      summary: "Coordinate daily production plans and keep merchandising informed of delays.",
      description: "This role sits between planning and the production floor. Accuracy and calm follow-up matter more than presentation.",
      location: "Gazipur",
      workplaceType: "ONSITE",
      employmentType: "FULL_TIME",
      vacancyCount: 1,
      salaryMin: 45000,
      salaryMax: 60000,
      salaryDisplay: "BDT 45,000 – 60,000",
      salaryNegotiable: true,
      educationRequirement: "Bachelor's in any discipline",
      experienceRequirement: "2–4 years in production or planning",
      skills: ["Production planning", "Follow-up", "Excel"],
      responsibilities: "Prepare daily plans.\nWalk the floor.\nReport delivery risk early.",
      preferredQualifications: "Woven manufacturing experience.",
      benefits: "Salary as advertised. Festival bonus as per policy.",
      workingDays: "Saturday–Thursday",
      workingHours: "8:30am – 6:00pm",
      probation: "3 months",
      joiningExpectation: "Within 30 days",
      applicationDeadline: prodDeadline,
      terms: "Employment is with Northridge Apparel Ltd. On-site six days a week. An application is not an offer.",
      instructions: "Apply through this page only.",
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  await prisma.job.upsert({
    where: { slug: "customer-support-executive" },
    update: {
      companyId: helix.id,
      title: "Customer Support Executive",
      status: "PUBLISHED",
      publishedAt: new Date(),
      applicationDeadline: csDeadline,
    },
    create: {
      companyId: helix.id,
      slug: "customer-support-executive",
      title: "Customer Support Executive",
      summary: "Handle inbound queries and follow cases through to a documented close.",
      description: "Receive, classify, resolve or escalate, and write a short record of what happened.",
      location: "Dhaka",
      workplaceType: "HYBRID",
      employmentType: "FULL_TIME",
      vacancyCount: 2,
      salaryMin: 32000,
      salaryMax: 42000,
      salaryDisplay: "BDT 32,000 – 42,000",
      salaryNegotiable: false,
      educationRequirement: "Bachelor's",
      experienceRequirement: "1–3 years in support or operations",
      skills: ["Written English", "Ticketing"],
      responsibilities: "Respond within the service window.\nLog every case.\nClose only with a usable answer.",
      workingDays: "Sunday–Thursday",
      workingHours: "9:00am – 6:00pm",
      probation: "3 months",
      joiningExpectation: "Immediate to 15 days",
      applicationDeadline: csDeadline,
      terms: "Employment is with Helix Digital. Application does not guarantee an interview.",
      instructions: "Mention any notice period clearly.",
      requireLinkedIn: true,
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  await prisma.job.upsert({
    where: { slug: "finance-officer" },
    update: {
      companyId: northridge.id,
      title: "Finance Officer",
      status: "CLOSED",
    },
    create: {
      companyId: northridge.id,
      slug: "finance-officer",
      title: "Finance Officer",
      summary: "This role is closed and is no longer accepting applications.",
      description: "Accounts payable support.",
      location: "Dhaka",
      workplaceType: "ONSITE",
      employmentType: "FULL_TIME",
      vacancyCount: 1,
      salaryMin: 40000,
      salaryMax: 50000,
      salaryDisplay: "BDT 40,000 – 50,000",
      skills: ["Accounting", "Excel"],
      responsibilities: "Process supplier invoices.",
      workingDays: "Sunday–Thursday",
      workingHours: "9:00am – 6:00pm",
      applicationDeadline: new Date(Date.now() - 3 * 86400000),
      terms: "This vacancy is no longer accepting applications.",
      status: "CLOSED",
      publishedAt: new Date(Date.now() - 40 * 86400000),
    },
  });

  const existingQuestions = await prisma.jobQuestion.count({ where: { jobId: prod.id } });
  if (existingQuestions === 0) {
    await prisma.jobQuestion.createMany({
      data: [
        { jobId: prod.id, question: "Have you worked in a factory or production office before?", type: "YES_NO", options: ["Yes", "No"], required: true, sortOrder: 0 },
        { jobId: prod.id, question: "Which ERP or production tools have you used?", type: "SHORT_TEXT", options: [], required: false, sortOrder: 1 },
      ],
    });
  }

  console.log(`Admin ready: ${email}`);
  console.log("Seeded companies/jobs: northridge-apparel, helix-digital, production-coordinator, customer-support-executive, finance-officer");
}

main().finally(() => prisma.$disconnect());
