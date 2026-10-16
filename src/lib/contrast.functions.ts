import { createServerFn } from "@tanstack/react-start";
import { contrastInputSchema } from "./contrast-schema";

export const checkContrast = createServerFn({ method: "POST" })
  .inputValidator((data) => contrastInputSchema.parse(data))
  .handler(async ({ data }) => {
    const { analyzeContrast } = await import("./contrast.server");
    return analyzeContrast(data.image);
  });
