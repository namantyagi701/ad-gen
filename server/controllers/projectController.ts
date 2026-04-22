import { Request, Response } from "express"
import { prisma } from "../configs/prisma.js"
import * as Sentry from "@sentry/node"
import { v2 } from "cloudinary"
import { generateAdScript, generateAdImage } from "../services/aiService.js"

export const createProject = async (req: Request, res: Response) => {
    let tempProjectId: string;
    const { userId } = req.auth()
    let isCreditDeducted = false;

    const { name = 'New Project', aspectRatio, userPrompt, productName, productDescription, targetLength = 5 } = req.body;
    const images: any = req.files;

    if (images.length < 2 || !productName) {
        return res.status(400).json({ message: 'Please provide at least 2 images and product name' })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) { return res.status(404).json({ message: 'User not found' }) }
    if (user.credits < 5) { return res.status(400).json({ message: 'Insufficient credits' }) }
    else {
        await prisma.user.update({
            where: { id: userId },
            data: { credits: { decrement: 5 } }
        }).then(() => {
            isCreditDeducted = true;
        })
    }
    try {
        let uploadedImages = await Promise.all(
            images.map((item: any) => {
                return v2.uploader.upload(item.path, {
                    resource_type: 'image'
                })
            })
        )

        const imageUrls = uploadedImages.map((img: any) => img.secure_url);

        const project = await prisma.project.create({
            data: {
                name,
                userId,
                productName,
                productDescription,
                userPrompt,
                aspectRatio,
                targetLength,
                uploadedImages: imageUrls,
                isGenerating: true
            }
        })
        tempProjectId = project.id;

        // Return immediately — AI generation happens in background
        res.status(200).json({ project });

        // Fire-and-forget: async AI pipeline
        (async () => {
            try {
                // Step 1: Generate ad script (gpt-4.1-mini vision)
                const { adScript, imagePrompt } = await generateAdScript({
                    imageUrls,
                    productName,
                    productDescription: productDescription || "",
                    userPrompt: userPrompt || "",
                    targetLength,
                    aspectRatio: aspectRatio || "9:16",
                });

                // Step 2: Generate ad image (gpt-image-1)
                const generatedImageUrl = await generateAdImage(imageUrls, imagePrompt);

                // Step 3: Update project with results
                await prisma.project.update({
                    where: { id: project.id },
                    data: {
                        adScript,
                        generatedImage: generatedImageUrl,
                        isGenerating: false,
                    },
                });
            } catch (aiError: any) {
                Sentry.captureException(aiError);
                await prisma.project.update({
                    where: { id: project.id },
                    data: {
                        isGenerating: false,
                        error: aiError.message || "AI generation failed",
                    },
                });
            }
        })();

    } catch (error: any) {
        Sentry.captureException(error)
        res.status(500).json({ message: error.message })
    } 
}

export const createVideo = async (req: Request, res: Response) => {
    try {

    } catch (error: any) {
        Sentry.captureException(error)
        res.status(500).json({ message: error.message })
    }
}

export const getAllPublishedProjects = async (req: Request, res: Response) => {
    try {
        const projects = await prisma.project.findMany({
            where: { isPublished: true },
            orderBy: { createdAt: 'desc' },
        })
        return res.status(200).json({ projects })
    } catch (error: any) {
        Sentry.captureException(error)
        res.status(500).json({ message: error.message })
    }
}

export const deleteProject = async (req: Request, res: Response) => {
    try {
        const { userId } = req.auth()
        const { projectId } = req.params
        const project = await prisma.project.findUnique({ where: { id: projectId as string, userId } })
        if (!project) { return res.status(404).json({ message: 'Project not found' }) }
        await prisma.project.delete({ where: { id: projectId as string } })
        return res.status(200).json({ message: 'Project deleted' })
    } catch (error: any) {
        Sentry.captureException(error)
        res.status(500).json({ message: error.message })
    }
}
