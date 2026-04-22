import { useEffect, useState, useRef } from "react"
import type { Project } from "../types"
import { BACKEND_URL } from "../types"
import { ImageIcon, Loader2Icon, RefreshCwIcon, SparkleIcon, VideoIcon, AlertCircleIcon } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { GhostButton, PrimaryButton } from "../components/Buttons"
import { useAuth } from "@clerk/clerk-react"


const Result = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const { getToken } = useAuth()
  const [project, setProjectData] = useState<Project>({} as Project)
  const [loading, setLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchProjectData = async () => {
    try {
      const token = await getToken()
      const res = await fetch(`${BACKEND_URL}/api/user/projects/${projectId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok) {
        setProjectData(data.project)
        // If still generating, keep polling
        if (!data.project.isGenerating) {
          // Stop polling once generation is done
          if (pollRef.current) {
            clearInterval(pollRef.current)
            pollRef.current = null
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch project:', error)
    } finally {
      setLoading(false)
    }
  }


  const handleGenerateVideo = async () => {
    setIsGenerating(true)
  }

  useEffect(() => {
    fetchProjectData()

    // Poll every 5 seconds while project may still be generating
    pollRef.current = setInterval(fetchProjectData, 5000)

    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [projectId])

  return loading ? (
    <div className="h-screen w-full flex items-center justify-center">
      <Loader2Icon className="animate-spin text-gray-400 size-9" />
    </div>
  )
    :
    (
      <div className="min-h-screen p-6 md:p-12 mt-20">
        <div className="max-w-6xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-2xl md:text-3xl font-medium text-gray-900">Generation Result</h1>
            <Link to="/generate" className="btn-secondary text-sm flex items-center gap-2">
              <RefreshCwIcon className="w-4 h-4" />
              <p className="max-sm:hidden">New Generation</p>
            </Link>
          </header>

          <div>
            {/* grid layout */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main result display */}
              <div className="lg:col-span-2 space-y-6">
                <div className="glass-panel p-2 rounded-2xl">
                    <div className={`${project.aspectRatio === '9:16' ? 'aspect-9/16' : 'aspect-video'} w-full sm:max-h-200 rounded-xl bg-gray-100 overflow-hidden relative min-h-64`}>
                    {project?.isGenerating ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/10">
                        <Loader2Icon className="size-10 animate-spin text-gray-500" />
                        <p className="text-sm text-gray-500">AI is generating your ad...</p>
                      </div>
                    ) : project?.error ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-red-50 p-6 text-center">
                        <AlertCircleIcon className="size-10 text-red-400" />
                        <p className="text-sm text-red-500">{project.error}</p>
                      </div>
                    ) : project?.generatedVideo ? (
                      <video src={project.generatedVideo} controls autoPlay loop className="w-full h-full object-cover" />
                    )
                      :
                      (
                        <img src={project.generatedImage} alt="Generated Result" className="w-full h-full object-cover" />
                      )}
                  </div>
                </div>

                {/* Ad Script Section */}
                {project?.adScript && (
                  <div className="glass-panel p-6 rounded-2xl">
                    <h3 className="text-xl font-semibold mb-4 text-gray-900">Ad Script</h3>
                    <div className="text-sm text-gray-600 whitespace-pre-wrap bg-black/3 p-4 rounded-xl leading-relaxed">
                      {project.adScript}
                    </div>
                  </div>
                )}
              </div>
              {/* sidebar action */}
              <div className="space-y-6 ">
                {/* download buttons */}
                <div className="glass-panel p-6 rounded-2xl">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Actions</h3>
                  <div className="flex flex-col gap-3">
                    <a href={project.generatedImage} download>
                      <GhostButton disabled={!project.generatedImage}
                        className="w-full justify-center rounded-md py-3 disabled:opacity-50 disabled:cursor-not-allowed">
                        <ImageIcon className="size-4.5" />
                        Download Image
                      </GhostButton>
                    </a>
                    <a href={project.generatedVideo} download>
                      <GhostButton disabled={!project.generatedVideo}
                        className="w-full justify-center rounded-md py-3 disabled:opacity-50 disabled:cursor-not-allowed">
                        <VideoIcon className="size-4.5" />
                        Download Video
                      </GhostButton>
                    </a>
                  </div>
                </div>

                {/* generate video buttons */}
                <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <VideoIcon className="size-24" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Video Magic</h3>
                  <p className="text-gray-400 text-sm mb-6">Turn this static image into dynamic video for social media and your platform</p>
                  {!project.generatedVideo ? (
                    <PrimaryButton onClick={handleGenerateVideo} disabled={isGenerating || project.isGenerating || !project.generatedImage} className="w-full">
                      {isGenerating ? (
                        <>Generating Video...</>
                      ) : (
                        <>  <SparkleIcon className="size-4" />Generate Video</>
                      )}
                    </PrimaryButton>
                  ) :
                    (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-center text-sm font-medium">
                        Video Generated Successfully!
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    )
}

export default Result
