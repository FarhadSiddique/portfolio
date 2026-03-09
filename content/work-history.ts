export type Role = {
  title: string;
  period: string;
  bullets: string[];
};

export type Job = {
  company: string;
  period: string;
  location: string;
  roles: Role[];
};

export const workHistory: Job[] = [
  {
    company: "Capital One",
    period: "May 2022 – Present",
    location: "Toronto, ON · Hybrid",
    roles: [
      {
        title: "Senior Associate – Payment Plans & Payment Infrastructure",
        period: "Jan 2024 – Present",
        bullets: [
          "Ideated, developed and delivered innovative Payment Plans to support customers going through financial difficulties.",
          "Led integration of new payment infrastructure enabling real-time payment processing (Interac RTP) — expected +2% customer spend.",
          "Launched mobile Payment Plan and Proactive Marketing → +37% reach, +20% enrollments.",
          "Built in-house SMS system and optimized contact funnel → $400K savings, +22% reach.",
          "Leading enterprise platform modernization — defining future capabilities of specialized segregated platforms to replace legacy mainframe systems.",
        ],
      },
      {
        title: "Associate – Customer Decisioning & Digital Channels",
        period: "May 2022 – Dec 2023",
        bullets: [
          "Managed the customer segmentation system for Canada's Customer Resiliency team, driving strategies on customer interaction models.",
          "Redesigned segmentation logic enabling vendor optimization → $1.7M savings.",
          "Built and managed digital communications portfolio (Email, SMS, Push) → +21% penetration, +4% payments.",
          "Managed US/Canada-wide vendor outage recovery — scoped, contained, and remediated high-severity incidents.",
          "Upheld regulatory risk standards for segmentation systems, ensuring Satisfactory Audit 2023.",
        ],
      },
    ],
  },
  {
    company: "Cirkle",
    period: "Jan 2021 – Oct 2021",
    location: "Toronto, ON",
    roles: [
      {
        title: "Co-Founder & Product/Design Lead",
        period: "Jan 2021 – Oct 2021",
        bullets: [
          "Co-founded mobile app startup; built full-stack app (React JS + AWS) published on the Google Play Store.",
          "Researched root causes of student dropout in higher education; performed 200+ user studies using HCI principles to refine the app interface.",
          "Worked with software developers setting timelines and feature goals in tandem with investor satisfaction.",
          "Designed front-end and contributed to backend development with React JS and AWS cloud integration.",
        ],
      },
    ],
  },
  {
    company: "Adyct",
    period: "Apr 2018 – Sep 2018",
    location: "Toronto, ON",
    roles: [
      {
        title: "Co-Founder",
        period: "Apr 2018 – Sep 2018",
        bullets: [
          "Co-founded retail advertising startup in the UofT Entrepreneurship Hatchery with a team of four.",
          "Designed an online marketplace and IoT device enabling retail stores to display cross-promotional ads on each other's screens.",
          "Conducted field research with 60+ downtown Toronto stores to validate market demand and business model with investors and mentors.",
        ],
      },
    ],
  },
  {
    company: "University of Toronto – University College",
    period: "Aug 2019 – Apr 2022",
    location: "Toronto, ON",
    roles: [
      {
        title: "Head Residence Don",
        period: "Sep 2021 – Apr 2022",
        bullets: [
          "Led a team of 6 Residence Advisors across planning, team meetings, and crisis management in residence.",
          "Planned and executed training sessions and coordinated monthly on-call shifts for a team of 23.",
          "Provided guidance to Residence Advisors on student support, event planning, and conflict resolution.",
        ],
      },
      {
        title: "Residence Don",
        period: "May 2020 – Aug 2021",
        bullets: [
          "Served as para-counselor and first point of support for students in residence.",
          "Facilitated monthly meetings and ran educational programs for social, academic, and leadership development.",
        ],
      },
      {
        title: "Program Don",
        period: "Aug 2019 – May 2020",
        bullets: [
          "Planned and executed a daylong student leadership conference with 100+ participants.",
          "Organized events with 200+ student participation during orientation.",
          "Created year-round educational events for 700+ students to foster an inclusive residential community.",
        ],
      },
    ],
  },
];
