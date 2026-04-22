import { useState, useEffect } from "react"
import type { Project } from "../types"
import { BACKEND_URL } from "../types"
import ProjectCard from "../components/ProjectCard"
import { Loader2Icon, Sparkles } from "lucide-react"
import { PrimaryButton } from "../components/Buttons"
import { useAuth } from "@clerk/clerk-react"
import { motion } from "framer-motion"

const MyGenerations = () => {
    const [generations, setGenerations] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const { getToken } = useAuth()

    const fetchMyGenerations = async () => {
        try {
            const token = await getToken()
            const res = await fetch(`${BACKEND_URL}/api/user/projects`, {
                headers: { 'Authorization': `Bearer ${token}` },
            })
            const data = await res.json()
            if (res.ok) {
                setGenerations(data.projects)
            }
        } catch (error) {
            console.error('Failed to fetch generations:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMyGenerations()
    }, [])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Loader2Icon className="size-10 animate-spin text-gray-400 mb-4" />
                <p className="text-gray-400 font-medium">Loading your masterpieces...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 mb-2"
                    >
                        <div className="p-2 bg-gray-100 rounded-lg border border-black/8">
                            <Sparkles className="size-5 text-gray-500" />
                        </div>
                        <span className="text-sm font-semibold tracking-wider text-gray-400 uppercase">Library</span>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-bold mb-4 tracking-tight text-gray-900"
                    >
                        My <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-600 to-gray-400">Works</span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 text-lg md:text-xl max-w-2xl"
                    >
                        A collection of your AI-generated ad creatives and product visuals.
                    </motion.p>
                </header>

                {generations.length > 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
                    >
                        {generations.map((gen, index) => (
                            <motion.div
                                key={gen.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * (index % 6) }}
                            >
                                <ProjectCard gen={gen} setGenerations={setGenerations} forCommunity={false} />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-32 bg-black/2 rounded-3xl border border-black/8 backdrop-blur-xl"
                    >
                        <div className="size-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-black/8">
                            <Sparkles className="size-10 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-3 text-gray-900">No works created yet</h3>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">Your creative journey begins here. Upload your product photos and let the AI do the magic.</p>
                        <PrimaryButton onClick={() => window.location.href = '/generate'}>
                            Create your first work
                        </PrimaryButton>
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default MyGenerations
