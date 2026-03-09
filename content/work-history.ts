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
    location: "Toronto, ON",
    roles: [
      {
        title: "Senior Associate, Payments Strategy & Platform Modernization",
        period: "Jan 2024 – Present",
        bullets: [
          "Modernizing enterprise legacy mainframe to segregated specialized platforms.",
          "Leading integration of Interac Real-Time Payments into the mobile app, enabling instant credit card payoff — expected +2% customer spend.",
          "Launched mobile Payment Plan and Proactive Marketing → +37% reach, +20% enrollments.",
          "Built in-house SMS system and optimized contact funnel → $400K savings, +22% reach.",
        ],
      },
      {
        title: "Associate, Customer Segmentation & Digital Tools",
        period: "May 2022 – Dec 2023",
        bullets: [
          "Redesigned segmentation logic enabling vendor optimization → $1.7M savings.",
          "Managed US/Canada-wide vendor outage recovery — scoped, contained, and remediated high-severity incidents.",
          "Upheld regulatory risk standards for segmentation systems, ensuring Satisfactory Audit 2023.",
          "Built digital communications portfolio (Email, SMS, Push) → +21% penetration, +4% payments.",
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
          "Co-founded mobile app startup; built full-stack app (React JS + AWS) published on Play Store.",
          "Ran 50+ HCI-based user studies to refine UX/UI.",
          "Designed front-end and supported backend development.",
        ],
      },
    ],
  },
  {
    company: "University College Dean's Office, UofT",
    period: "Sep 2019 – Apr 2022",
    location: "Toronto, ON",
    roles: [
      {
        title: "Head Advisor",
        period: "Sep 2019 – Apr 2022",
        bullets: [
          "Led a team of 6 advisors and coordinated a 23-person schedule.",
          "Promoted through 4 roles: Front Desk → Program Assistant → Residence Advisor → Head Advisor.",
        ],
      },
    ],
  },
];
