import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars";
import { GEMINI_AVAILABLE_MODELS } from "./dialog";
import { geminiChannel } from "@/ingest/channels/gemini";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import prisma from "@/lib/db";

Handlebars.registerHelper("json", (context) => {
  const stringified = JSON.stringify(context, null, 2);
  return new Handlebars.SafeString(stringified);
});

type GeminiData = {
  variableName?: string;
  credentialId?: string;
  model?: typeof GEMINI_AVAILABLE_MODELS[number];
  systemPrompt?: string;
  userPrompt?: string;
};

export const geminiExecutor: NodeExecutor<GeminiData> = async ({ 
    data, 
    nodeId, 
    context, 
    step,
    publish,

}) => {
    
  await publish(geminiChannel().status({
    nodeId,
    status: "loading",
  }));

  if (!data.variableName) {
    await publish(geminiChannel().status({
      nodeId,
      status: "error",
    }));
    throw new NonRetriableError("Variable name is required");
  }

  if (!data.credentialId) {
    await publish(geminiChannel().status({
      nodeId,
      status: "error",
    }));
    throw new NonRetriableError("Credential is required");
  }

  if (!data.userPrompt) {
    await publish(geminiChannel().status({
      nodeId,
      status: "error",
    }));
    throw new NonRetriableError("User prompt is required");
  }

  const systemPrompt = data.systemPrompt
  ? Handlebars.compile(data.systemPrompt)(context)
  : "You are a helpful assistant that can answer questions and help with tasks.";
  
  const userPrompt = Handlebars.compile(data.userPrompt)(context);

  const credential = await step.run("get-credential", () => {
    return prisma.credential.findUnique({
      where: {
         id: data.credentialId,
      },
    })
  });

  if (!credential) {
    throw new NonRetriableError("Credential not found");
  }
  

  const google = createGoogleGenerativeAI({
    apiKey: credential.value,
  });

  try {
    const { steps } = await step.ai.wrap(
      "gemini-generate-text",
      generateText,
      {
        model: google(data.model || "gemini-2.5-flash"),
        system: systemPrompt,
        prompt: userPrompt,
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },

      },
    );

    const text = 
    steps[0].content[0].type === "text"
    ? steps[0].content[0].text 
    : "";

    await publish(geminiChannel().status({
      nodeId,
      status: "success",
    }));

    return {
      ...context,
      [data.variableName]: {
        aiResponse: text,
      },
    }

    
  } catch (error) {
    await publish(geminiChannel().status({
      nodeId,
      status: "error",
    }));
    throw error;
  }
};