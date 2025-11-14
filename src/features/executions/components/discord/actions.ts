"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { inngest } from "@/ingest/client";
import { discordChannel } from "@/ingest/channels/discord";

export type DiscordToken = Realtime.Token<typeof discordChannel, ["status"]>;

export async function fetchDiscordRealtimeToken():
Promise<DiscordToken> {
    const token = await getSubscriptionToken(inngest, {
        channel: discordChannel(),
        topics: ["status"],
    });

    return token;
}