import { Request, Response } from "express"
import { prisma } from "../configs/prisma.js"
import * as Sentry from "@sentry/node"

// get user credits
export const getUserCredits = async (req: Request, res: Response) => {
    try {
        const { userId } = req.auth()
        if (!userId) { return res.status(401).json({ message: 'Unauthorized' }) }
        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (!user) { return res.status(404).json({ message: 'User not found' }) }
        return res.status(200).json({ credits: user.credits })
    } catch (error: any) {
        Sentry.captureException(error)
        res.status(500).json({ message: error.message })
    }
}

// get all user projects
export const getAllProjects = async (req: Request, res: Response) => {
    try {
        const { userId } = req.auth()
        if (!userId) { return res.status(401).json({ message: 'Unauthorized' }) }
        const projects = await prisma.project.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        })
        return res.status(200).json({ projects })
    } catch (error: any) {
        Sentry.captureException(error)
        res.status(500).json({ message: error.message })
    }
}

//get project by id
export const getProjectById = async (req: Request, res: Response) => {
    try {
        const { userId } = req.auth()
        if (!userId) { return res.status(401).json({ message: 'Unauthorized' }) }
        const { projectId } = req.params
        const project = await prisma.project.findUnique({ where: { id: projectId as string, userId } })
        if (!project) { return res.status(404).json({ message: 'Project not found' }) }
        return res.status(200).json({ project })
    } catch (error: any) {
        Sentry.captureException(error)
        res.status(500).json({ message: error.message })
    }
}

//publish / unpublish project
export const toggleProjectPublic = async (req: Request, res: Response) => {
    try {
        const { userId } = req.auth()
        if (!userId) { return res.status(401).json({ message: 'Unauthorized' }) }
        const {projectId} = req.params
        const project = await prisma.project.findUnique({ where: { id: projectId as string , userId } })
        if (!project?.generatedImage && !project?.generatedVideo) { return res.status(404).json({ message: 'image or video not found' }) }
        await prisma.project.update({
            where: { id: projectId as string },
            data: { isPublished: !project?.isPublished }
        })
        return res.status(200).json({ isPublished: !project?.isPublished })
    } catch (error: any) {
        Sentry.captureException(error)
        res.status(500).json({ message: error.message })
    }
}