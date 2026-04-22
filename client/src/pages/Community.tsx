import { useEffect, useState } from "react"
import type { Project } from "../types"
import { BACKEND_URL } from "../types"
import { Loader2Icon } from "lucide-react"
import ProjectCard from "../components/ProjectCard"

const Community = () => {

  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/project/published`)
      const data = await res.json()
      if (res.ok) {
        setProjects(data.projects || [])
      }
    } catch (error) {
      console.error('Failed to fetch community projects:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  return loading ? (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2Icon className="size-7 animate-spin text-gray-400" />
    </div>
  ) : (
    <div className="min-h-screen p-6 md:p-12 my-28">
      <div className="max-w-6xl mx-auto">
        <header>
          <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-gray-900">Community</h1>
          <p className="text-gray-500">See what others are creating at AdForge</p>
        </header>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} gen={project} setGenerations={setProjects} forCommunity={true} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Community
