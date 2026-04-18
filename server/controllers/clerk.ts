import { Request, Response } from "express"
import { verifyWebhook } from '@clerk/express/webhooks'
import { prisma } from '../configs/prisma.js'
import * as Sentry from "@sentry/node"

const clerkWebhooks = async (req: Request, res: Response) => {
    console.log("Webhook request received")

    const signingSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET?.trim();

    if (!signingSecret) {
        return res.status(500).json({ message: "Missing CLERK_WEBHOOK_SIGNING_SECRET in server environment" })
    }

    try {
        const evt = await verifyWebhook(req, { signingSecret });

        //get data from request
        const { data, type } = evt;

        switch (type) {
            case "user.created": {
                await prisma.user.create({
                    data: {
                        id: data.id,
                        email: data?.email_addresses[0]?.email_address,
                        name: data?.first_name + " " + data.last_name,
                        image: data.image_url
                    }
                })
                break;
            }

            case "user.updated": {
                await prisma.user.update({
                    where: {
                        id: data.id
                    },
                    data: {
                        email: data?.email_addresses[0]?.email_address,
                        name: data?.first_name + " " + data.last_name,
                        image: data.image_url
                    }
                })
                break;
            }

            case "user.deleted": {
                await prisma.user.deleteMany({
                    where: { id: data.id }
                })
                break;
            }

            case "paymentAttempt.updated": {
                if ((data.charge_type === "recurring" || data.charge_type === "checkout") && data.status === 'paid') {

                    const credits = { pro: 80, premium: 240 }

                    const clerkUserId = data?.payer?.user_id;

                    const planId = data?.subscription_items?.[0]?.plan?.slug as keyof typeof credits;

                    if (planId != "pro" && planId != "premium") {
                        return res.status(400).json({ message: "Invalid plan" })
                    }

                    console.log(planId)

                    await prisma.user.update({
                        where: { id: clerkUserId },
                        data: {
                            credits: { increment: credits[planId] }
                        }
                    })
                }
                break;
            }

            default:
                break;
        }
        return res.status(200).json({ received: true })  

    } catch (error: any) {
        Sentry.captureException(error)
        res.status(500).json({ message: error.message });
    }
}

export default clerkWebhooks