import fs from "fs";
import path from "path";

export const renderTemplate = (templateName, variables) => {
  const templatePath = path.join(
    process.cwd(),
    "templates",
    "emails",
    templateName
  );

  let html = fs.readFileSync(templatePath, "utf-8");

  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, "g");
    html = html.replace(regex, value);
  });

  return html;
};
