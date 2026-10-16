import { createOpenAI } from "@ai-sdk/openai";
import { APICallError, NoObjectGeneratedError, Output, streamText } from "ai";
import { contrastReportSchema, type ContrastResult } from "./contrast-schema";

const GATEWAY = "https://ai.gateway.lovable.dev/v1";
const MODEL = "openai/gpt-6-astra";

const INSTRUCTIONS = `You are an accessibility reviewer checking colour contrast on a website screenshot.
Find text that is hard to read: low contrast against its background, text over images, thin light text, small muted captions, buttons and links.
For each issue estimate the foreground and background colours as hex, estimate the contrast ratio, and compare with WCAG 2.2 AA (4.5:1 normal text, 3:1 large text of 24px+ or 18.66px+ bold, 3:1 for UI component boundaries).
Suggest a replacement colour (hex) that keeps the design's character and meets AA, with its estimated new ratio.
Quote the visible text exactly as shown (short). Only report what you can see; if everything passes, return an empty issues list. Colours and ratios are estimates from pixels — say so in the summary when uncertain.`;

function failure(status: number | undefined, fallback: string): ContrastResult {
  if (status === 402) return { ok: false, message: "The checker is out of AI credits right now. Please try again later." };
  if (status === 429) return { ok: false, message: "The checker is busy. Please wait a minute and try again." };
  if (status === 403) return { ok: false, message: "The checker isn't available for this request." };
  if (status === 400) return { ok: false, message: "That image couldn't be read. Try a PNG or JPG screenshot." };
  return { ok: false, message: fallback };
}

export async function analyzeContrast(imageDataUrl: string): Promise<ContrastResult> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) return { ok: false, message: "The checker isn't set up yet." };

  const provider = createOpenAI({
    baseURL: GATEWAY,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
  });

  try {
    const result = streamText({
      model: provider.responses(MODEL),
      system: INSTRUCTIONS,
      messages: [{
        role: "user",
        content: [
          { type: "text", text: "Review this page screenshot for hard-to-read text and suggest accessible colours." },
          { type: "image", image: new URL(imageDataUrl) },
        ],
      }],
      output: Output.object({ schema: contrastReportSchema }),
      maxRetries: 1,
      providerOptions: {
        openai: {
          forceReasoning: true,
          reasoningEffort: "low",
          reasoningSummary: "auto",
          store: false,
          include: ["reasoning.encrypted_content"],
        },
      },
    });
    const report = await result.output;
    return { ok: true, report };
  } catch (error) {
    if (APICallError.isInstance(error)) {
      console.error("contrast gateway error", error.statusCode, error.message);
      return failure(error.statusCode, "The check couldn't finish. Please try again.");
    }
    if (NoObjectGeneratedError.isInstance(error)) {
      return { ok: false, message: "The check didn't return a usable report. Please try again." };
    }
    const status = (error as { statusCode?: number })?.statusCode;
    console.error("contrast check failed", error);
    return failure(status, "The check couldn't finish. Please try again.");
  }
}
