import { useNavigate } from "react-router-dom"
import type { Project } from "../types"
import { BACKEND_URL } from "../types"
import { useState } from "react";
import { EllipsisIcon, ImageIcon, Loader2Icon, PlaySquareIcon, Share2Icon, Trash2Icon } from "lucide-react";
import { GhostButton, PrimaryButton } from "./Buttons";
import { useAuth } from "@clerk/clerk-react";

const ProjectCard = ({ gen, setGenerations, forCommunity = false }
    : { gen: Project, setGenerations: React.Dispatch<React.SetStateAction<Project[]>>, forCommunity?: boolean }) => {

    const navigate = useNavigate();
    const { getToken } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleDelete = async(id : string) => {
      const confirm = window.confirm('Are you sure you want to delete this project?')
      if(!confirm) return;
      try {
        const token = await getToken()
        const res = await fetch(`${BACKEND_URL}/api/project/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        })
        if (res.ok) {
          setGenerations(prev => prev.filter(g => g.id !== id))
        }
      } catch (error) {
        console.error('Failed to delete project:', error)
      }
    }

    const togglePublish = async(projectId : string) => {
      try {
        const token = await getToken()
        const res = await fetch(`${BACKEND_URL}/api/user/publish/${projectId}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` },
        })
        const data = await res.json()
        if (res.ok) {
          setGenerations(prev => prev.map(g =>
            g.id === projectId ? { ...g, isPublished: data.isPublished } : g
          ))
        }
      } catch (error) {
        console.error('Failed to toggle publish:', error)
      }
    }

    


    return (
        <div key={gen.id} className="mb-4 break-inside-avoid">
            <div className="bg-black/2 border border-black/8 rounded-xl overflow-hidden hover:border-black/15 transition group">
                {/* preview */}
                <div className={`${gen?.aspectRatio === '9:16' ? 'aspect-9/16' : 'aspect-video'} relative overflow-hidden`}>
                    {gen.generatedImage && (
                        <img src={gen.generatedImage} alt={gen.productName} className={`absolute inset-0 w-full h-full object-cover transition duration-500 ${gen.generatedVideo ? 'group-hover:opacity-0' : 'group-hover:scale-105'}`} />
                    )}

                    {gen.generatedVideo && (
                        <video src={gen.generatedVideo} muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 duration-500" onMouseEnter={(e) => e.currentTarget.play()} onMouseLeave={(e) => e.currentTarget.pause()} />
                    )}

                    {(!gen?.generatedImage && !gen.generatedVideo) && (
                        <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gray-100">
                            <Loader2Icon className="size-7 animate-spin text-gray-400" />
                        </div>
                    )}

                    {/* status badge */}
                    <div className="absolute left-3 top-3 flex gap-2 items-center">
                        {gen.isGenerating && (
                            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">Generating</span>)}

                        {gen.isPublished && (
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Published</span>)}
                    </div>

                    {/* action menu for my generations only*/}
                    {!forCommunity && (
                        <div
                            onMouseDownCapture={() => { setMenuOpen(true) }}
                            onMouseLeave={() => setMenuOpen(false)}
                            className="absolute right-3 top-3 sm:opacity-0 group-hover:opacity-100 transition flex items-center gap-2">
                            <div className="absolute top-3 right-3">
                                <EllipsisIcon className="ml-auto bg-white/70 backdrop-blur rounded-full p-1 size-7 text-gray-700" />
                            </div>
                            <div className="flex flex-col items-end w-32 text-sm">
                                <ul className={`text-xs ${menuOpen ? 'block' : 'hidden'} overflow-hidden right-0 peer-focus:block hover:block w-40 bg-white/90 backdrop-blur text-gray-700 border border-black/10 rounded-lg shadow-md mt-2 py-1 z-10`}>

                                    {gen.generatedImage && <a href='#' download className="flex gap-2 items-center px-4 py-2 hover:bg-black/5 cursor-pointer"><ImageIcon size={14} /> Download Image </a>}
                                    {gen.generatedVideo && <a href='#' download className="flex gap-2 items-center px-4 py-2 hover:bg-black/5 cursor-pointer"><PlaySquareIcon size={14} /> Download Video </a>}

                                    {(gen.generatedImage || gen.generatedVideo) && <button onClick={() => navigator.share({ url: gen.generatedVideo || gen.generatedImage, title: gen.productName, text: gen.productDescription })} className="w-full flex gap-2 items-center px-4 py-2 hover:bg-black/5 text-gray-700 cursor-pointer">
                                        <Share2Icon size={14} /> Share
                                    </button>}

                                    <button onClick={() => handleDelete(gen.id)} className="w-full flex gap-2 items-center px-4 py-2 hover:bg-red-50 text-red-500 cursor-pointer">
                                        <Trash2Icon size={14} /> Delete
                                    </button>

                                </ul>
                            </div>
                        </div>
                    )

                    }

                    {/* source images */}
                    <div className="absolute right-3 bottom-3">
                        <img src={gen.uploadedImages[0]} alt="product" className="w-16 h-16 object-cover rounded-full animate-float " style={{ animationDelay: '2s' }} />
                        <img src={gen.uploadedImages[1]} alt="model" className="w-16 h-16 object-cover rounded-full animate-float -ml-8" style={{ animationDelay: '3s' }} />
                    </div>

                </div>

                {/* details */}
                <div className="p-4">

                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <h3 className="font-medium text-lg mb-1 text-gray-900">{gen.productName}</h3>
                            <p className="text-sm text-gray-400">Created: {new Date(gen.createdAt).toLocaleString()}</p>
                            {gen.updatedAt && (
                                <p className="text-xs text-gray-400 mt-1">Updated: {new Date(gen.updatedAt).toLocaleString()}</p>
                            )}
                        </div>
                        <div className="text-right">
                            <div>
                                <span className="text-xs px-2 py-1 bg-black/4 text-gray-500 rounded-full">
                                    Aspect: {gen.aspectRatio}
                                </span>
                            </div>
                        </div>
                    </div>

                    {gen.productDescription && (
                        <div className="mt-3">
                            <p className="text-xs text-gray-500 mb-1">Description</p>
                            <div className="text-sm text-gray-600 bg-black/3 p-2 rounded-md wrap-break-word">{gen.productDescription}</div>
                        </div>
                    )}

                    {gen.userPrompt && (
                        <div className="mt-3">
                            <div className="text-xs text-gray-500">{gen.userPrompt}</div>
                        </div>
                    )}

                    {/* buttons */}
                    {!forCommunity && (
                        <div className="mt-4 grid grid-cols-2 gap-3" >
                            <GhostButton className="text-xs justify-center"
                            onClick={() => {navigate(`/result/${gen.id}`); scrollTo(0,0)}}
                            >
                                View Details
                            </GhostButton>
                            
                            <PrimaryButton onClick={() => togglePublish(gen.id)} className="rounded-md">
                                {gen.isPublished ? 'Unpublish' : 'Publish'}
                            </PrimaryButton>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProjectCard

// 2:10:00
