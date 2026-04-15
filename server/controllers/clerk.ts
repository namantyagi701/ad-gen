import { Request, Response } from "express"
import { verifyWebhook } from '@clerk/express/webhooks'
import {prisma} from '../configs/prisma.js'


const clerkWebhooks = async (req: Request, res: Response) => {
    console.log("Webhook request received")
    let type = "unknown";
    try {
        const evt: any = await verifyWebhook(req)
        //get data from request
        const { data, type: eventType } = evt;
        type = eventType;

        switch (eventType) {
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
                await prisma.user.deleteMany({ where: { id: data.id } })
                break;
            }
            case "paymentAttempt.updated": {
                if ((data.charge_type === "recurring" || data.charge_type === "checkout") && data.status === 'paid') {
                    const credits = { pro: 80, premium: 240 }
                    const clerkUserId = data?.payer?.user_id;
                    const planId: keyof typeof credits = data?.subscription_items?.[0]?.plan?.slug;
                    if (planId != "pro" && planId != "premium") {
                        return res.status(400).json({ message: "Invalid plan" })
                    }
                    console.log(planId)
                    await prisma.user.update({
                        where :{id : clerkUserId},
                        data:{
                            credits : {increment: credits[planId]}
                        }
                    })
                }
                break;
            }


            default:
                break;
        }
        return res.json({ message: "Webhook received: " + eventType })

    } catch (error : any) {
        const message = error?.message || "Webhook processing failed";
        const status = /signature|svix|webhook/i.test(message) ? 401 : 500;
        console.error("Webhook error:", message);
        return res.status(status).json({ message, type });
    }
}

export default clerkWebhooks