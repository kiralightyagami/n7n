import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars";
import { OPENAI_AVAILABLE_MODELS } from "./dialog";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { openaiChannel } from "@/ingest/channels/openai";

Handlebars.registerHelper("json", (context) => {
  const stringified = JSON.stringify(context, null, 2);
  return new Handlebars.SafeString(stringified);
});

type OpenAIData = {
  variableName?: string;
  model?: typeof OPENAI_AVAILABLE_MODELS[number];
  systemPrompt?: string;
  userPrompt?: string;
};

export const openaiExecutor: NodeExecutor<OpenAIData> = async ({ 
    data, 
    nodeId, 
    context, 
    step,
    publish,

}) => {
    
  await publish(openaiChannel().status({
    nodeId,
    status: "loading",
  }));

  if (!data.variableName) {
    await publish(openaiChannel().status({
      nodeId,
      status: "error",
    }));
    throw new NonRetriableError("Variable name is required");
  }

  if (!data.userPrompt) {
    await publish(openaiChannel().status({
      nodeId,
      status: "error",
    }));
    throw new NonRetriableError("User prompt is required");
  }

  const systemPrompt = data.systemPrompt
  ? Handlebars.compile(data.systemPrompt)(context)
  : "You are a helpful assistant that can answer questions and help with tasks.";
  
  const userPrompt = Handlebars.compile(data.userPrompt)(context);

  const credentialValues = process.env.OPENAI_API_KEY!;

  const openai = createOpenAI({
    apiKey: credentialValues,
  });
  try {
    const { steps } = await step.ai.wrap(
      "openai-generate-text",
      generateText,
      {
        model: openai(data.model || "gpt-3.5-turbo"),
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

    await publish(openaiChannel().status({
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
    await publish(openaiChannel().status({
      nodeId,
      status: "error",
    }));
    throw error;
  }
};