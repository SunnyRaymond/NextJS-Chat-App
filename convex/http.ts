import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { internal } from "./_generated/api";

const validatePayload = async (
  req: Request
): Promise<WebhookEvent | undefined> => {
  const payload = await req.text();

  const svixHeaders = {
    "svix-id": req.headers.get("svix-id") || "",
    "svix-timestamp": req.headers.get("svix-timestamp") || "",
    "svix-signature": req.headers.get("svix-signature") || "",
  };

  const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

  try {
    const event = webhook.verify(payload, svixHeaders) as WebhookEvent;
    return event;
  } catch (error) {
    console.error("Webhook verification failed:", error);
    return;
  }
};

const handleClerkWebhook = httpAction(async (ctx, req) => {
  const event = await validatePayload(req);

  if (!event) {
    console.error("Invalid webhook payload");
    return new Response("Invalid webhook", { status: 400 });
  }

  console.log("Received event:", event);

  switch (event.type) {
    case "user.created": {
      const user = await ctx.runQuery(internal.user.get, {
        clerkId: event.data.id,
      });

      if (user) {
        console.log(`User already exists: ${event.data.id}`);
      } else {
        console.log(`Creating new user: ${event.data.id}`);
        await ctx.runMutation(internal.user.create, {
          username: `${event.data.first_name} ${event.data.last_name}`,
          imageUrl: event.data.image_url,
          clerkId: event.data.id,
          email: event.data.email_addresses[0].email_address,
        });
      }
      break;
    }
    case "user.updated": {
      console.log(`Updating user: ${event.data.id}`);
      await ctx.runMutation(internal.user.create, {
        username: `${event.data.first_name} ${event.data.last_name}`,
        imageUrl: event.data.image_url,
        clerkId: event.data.id,
        email: event.data.email_addresses[0].email_address,
      });
      break;
    }
    default: {
      console.log(`Unknown event type: ${event.type}`);
      break;
    }
  }
  return new Response(null, { status: 200 });
});

const http = httpRouter();

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: handleClerkWebhook,
});

export default http;
