"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { inngest } from "@/ingest/client";
import { googleFormTriggerChannel } from "@/ingest/channels/google-form-trigger";

export type GoogleFormTriggerToken = Realtime.Token<typeof googleFormTriggerChannel, ["status"]>;

export async function fetchGoogleFormTriggerRealtimeToken():
Promise<GoogleFormTriggerToken> {
    const token = await getSubscriptionToken(inngest, {
        channel: googleFormTriggerChannel(),
        topics: ["status"],
    });

    return token;
}