import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars";
import { decode } from "html-entities";
import ky from "ky";
import { slackChannel } from "@/ingest/channels/slack";
Handlebars.registerHelper("json", (context) => {
  const stringified = JSON.stringify(context, null, 2);
  return new Handlebars.SafeString(stringified);
});

type SlackData = {
  variableName?: string;
  webhookUrl?: string;
  content?: string;
};

export const slackExecutor: NodeExecutor<SlackData> = async ({ 
    data, 
    nodeId, 
    context, 
    step,
    publish,

}) => {
    
  await publish(slackChannel().status({
    nodeId,
    status: "loading",
  }));


  if (!data.content) {
    await publish(slackChannel().status({
      nodeId,
      status: "error",
    }));
    throw new NonRetriableError("Content is required");
  }

  const rawContent = Handlebars.compile(data.content)(context);
  const content = decode(rawContent);

  
  try {
    const result = await step.run("slack-webhook", async () => {
      if (!data.webhookUrl) {
        await publish(slackChannel().status({
          nodeId,
          status: "error",
        }));
        throw new NonRetriableError("Webhook URL is required");
      }
      
      await ky.post(data.webhookUrl, {
        json: {
          content: content,
        },
      });

      if (!data.variableName) {
        await publish(slackChannel().status({
          nodeId,
          status: "error",
        }));
        throw new NonRetriableError("Variable name is required");
      }

      return {
        ...context,
        [data.variableName]: {
          messageContent: content,
        },
      }
    });

    await publish(slackChannel().status({
      nodeId,
      status: "success",
    }));

    return result;

    
  } catch (error) {
    await publish(slackChannel().status({
      nodeId,
      status: "error",
    }));
    throw error;
  }
};