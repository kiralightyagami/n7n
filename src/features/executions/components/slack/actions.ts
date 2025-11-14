"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { inngest } from "@/ingest/client";
import { slackChannel } from "@/ingest/channels/slack";

export type SlackToken = Realtime.Token<typeof slackChannel, ["status"]>;

export async function fetchSlackRealtimeToken():
Promise<SlackToken> {
    const token = await getSubscriptionToken(inngest, {
        channel: slackChannel(),
        topics: ["status"],
    });

    return token;
}