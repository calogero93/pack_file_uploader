export const Category = {
    ProjectManagemt: "ProjectManagemt",
    Leadership: "Leadership",
    Negotiation: "Negotiation",
    SoftwareDevelopment: "SoftwareDevelopment",
    ProblemSolving: "ProblemSolving"
} as const;
export type Category = (typeof Category)[keyof typeof Category];
export const Language = {
    Italian: "Italian",
    English: "English",
    Spanish: "Spanish",
    Chinese: "Chinese"
} as const;
export type Language = (typeof Language)[keyof typeof Language];
export const Provider = {
    Pack: "Pack",
    Academy: "Academy",
    Tutor: "Tutor"
} as const;
export type Provider = (typeof Provider)[keyof typeof Provider];
export const Role = {
    Tutor: "Tutor",
    Student: "Student"
} as const;
export type Role = (typeof Role)[keyof typeof Role];
