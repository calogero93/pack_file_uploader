import express from "express";
import { Category, Language, Provider } from "../db/enums";

const router = express.Router();

const categoryLabels: Record<Category, string> = {
  ProjectManagemt: "Project Management",
  Leadership: "Leadership",
  Negotiation: "Negotiation",
  SoftwareDevelopment: "Software Development",
  ProblemSolving: "Problem Solving",
};

const languageLabels: Record<Language, string> = {
  Italian: "Italian",
  English: "English",
  Spanish: "Spanish",
  Chinese: "Chinese",
};

const providerLabels: Record<Provider, string> = {
  Pack: "Pack",
  Academy: "Academy",
  Tutor: "Tutor",
};

router.get("/enums", (req, res) => {
  const mapEnum = <T extends string>(values: T[], labels: Record<T, string>) =>
    values.map((value) => ({
      value,
      label: labels[value],
    }));

  res.json({
    category: mapEnum(Object.values(Category), categoryLabels),
    language: mapEnum(Object.values(Language), languageLabels),
    provider: mapEnum(Object.values(Provider), providerLabels),
  });
});

export default router;
