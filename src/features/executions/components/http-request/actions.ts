"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { httpRequestChannel } from "@/ingest/channels/http-request";
import { inngest } from "@/ingest/client";

export type HttpRequestToken = Realtime.Token<typeof httpRequestChannel, ["status"]>;

export async function fetchHttpRequestRealtimeToken():
Promise<HttpRequestToken> {
    const token = await getSubscriptionToken(inngest, {
        channel: httpRequestChannel(),
        topics: ["status"],
    });

    return token;
}