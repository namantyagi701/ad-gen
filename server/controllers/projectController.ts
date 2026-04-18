import { Request, Response } from "express"
import { prisma } from "../configs/prisma.js"
import * as Sentry from "@sentry/node"
import { v2 } from "cloudinary"

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
        const project = await prisma.project.create({
            data: {
                name,
                userId,
                productName,
                productDescription,
                userPrompt,
                aspectRatio,
                targetLength,
                uploadedImages,
                isGenerating: true
            }
        })
        tempProjectId = project.id;
        
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

    } catch (error: any) {
        Sentry.captureException(error)
        res.status(500).json({ message: error.message })
    }
}

export const deleteProject = async (req: Request, res: Response) => {
    try {

    } catch (error: any) {
        Sentry.captureException(error)
        res.status(500).json({ message: error.message })
    }
}

