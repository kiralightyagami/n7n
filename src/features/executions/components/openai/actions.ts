"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { inngest } from "@/ingest/client";
import { openaiChannel } from "@/ingest/channels/openai";

export type OpenAIToken = Realtime.Token<typeof openaiChannel, ["status"]>;

export async function fetchOpenAIToken():
Promise<OpenAIToken> {
    const token = await getSubscriptionToken(inngest, {
        channel: openaiChannel(),
        topics: ["status"],
    });

    return token;
}