import React, { useState } from "react"
import Title from "../components/Title"
import UploadZone from "../components/UploadZone"
import { LoaderIcon, RectangleHorizontalIcon, RectangleVerticalIcon, Wand2Icon } from "lucide-react"
import { PrimaryButton } from "../components/Buttons"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@clerk/clerk-react"
import { BACKEND_URL } from "../types"

const Generator = () => {
  const navigate = useNavigate()
  const { getToken } = useAuth()

  const [name, setName] = useState('')
  const [productName, setProductName] = useState('')
  const [productDescription, setProductDescription] = useState('')
  const [aspectRatio, setAspectRatio] = useState('9:16')
  const [productImage, setProductImage] = useState<File | null>(null)
  const [modelImage, setModelImage] = useState<File | null>(null)
  const [userPrompt, setUserPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'product' | 'model') => {
    if (e.target.files && e.target.files[0]) {
      if (type === 'product') setProductImage(e.target.files[0])
      else setModelImage(e.target.files[0])
    }
  }

  const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!productImage || !modelImage) {
      alert('Please upload both product and model images')
      return
    }

    setIsGenerating(true)
    try {
      const token = await getToken()
      const formData = new FormData()
      formData.append('name', name || 'New Project')
      formData.append('productName', productName)
      formData.append('productDescription', productDescription)
      formData.append('aspectRatio', aspectRatio)
      formData.append('userPrompt', userPrompt)
      formData.append('images', productImage)
      formData.append('images', modelImage)

      const res = await fetch(`${BACKEND_URL}/api/project/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await res.json()

      if (res.ok) {
        navigate(`/result/${data.project.id}`)
      } else {
        alert(data.message || 'Something went wrong')
      }
    } catch (error: any) {
      alert(error.message || 'Failed to create project')
    } finally {
      setIsGenerating(false)
    }
  }


  return (
    <div className="min-h-screen p-6 md:p-12 mt-28">

      <form onSubmit={handleGenerate} className="max-w-4xl mx-auto mb-40" >

        <Title heading="Create In-Context Image" description="Upload your model and product images to generate stunning UGC, short-form videos and social media posts" />

        <div className="flex gap-20 max-sm:flex-col items-start justify-between">
          {/* left col */}
          <div className="flex flex-col w-full sm:max-w-60 gap-8 mt-8 mb-12">

            <UploadZone label="Product Image" file={productImage} onClear={() => setProductImage(null)} onChange={(e) => handleFileChange(e, 'product')} />
            <UploadZone label="Model Image" file={modelImage} onClear={() => setModelImage(null)} onChange={(e) => handleFileChange(e, 'model')} />
          </div>

          {/* right col */}
          <div className="w-full">
            <div className="mb-4 text-gray-600">
              <label htmlFor="name" className="block text-sm mb-4">Project Name</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name your project" required className="w-full bg-black/2 rounded-lg border-2 p-4 text-sm border-black/8 focus:border-gray-900/50 outline-none transition-all text-gray-900" />
            </div>

            <div className="mb-4 text-gray-600">
              <label htmlFor="productName" className="block text-sm mb-4">Product Name</label>
              <input type="text" id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Enter the name of the product" required className="w-full bg-black/2 rounded-lg border-2 p-4 text-sm border-black/8 focus:border-gray-900/50 outline-none transition-all text-gray-900" />
            </div>

            <div className="mb-4 text-gray-600">
              <label htmlFor="productDescription" className="block text-sm mb-4">Product Description <span className="text-xs text-gray-400">(optional)</span> </label>
              <textarea id="productDescription" rows={4} value={productDescription} onChange={(e) => setProductDescription(e.target.value)} placeholder="Enter the description" className="w-full bg-black/2 rounded-lg border-2 p-4 text-sm border-black/8 focus:border-gray-900/50 outline-none resize-none transition-all text-gray-900"></textarea>
            </div>

            <div className="mb-4 text-gray-600">

              <label className="block text-sm mb-4">Aspect Ratio</label>
              <div className="flex gap-3">
                <RectangleVerticalIcon onClick={() => setAspectRatio('9:16')}
                  className={`p-2.5 size-13 bg-black/4 rounded transition-all ring-2 ring-transparent cursor-pointer text-gray-700 ${aspectRatio === '9:16' ? 'ring-gray-900/50 bg-black/8' : ''}`} />
                <RectangleHorizontalIcon onClick={() => setAspectRatio('16:9')}
                  className={`p-2.5 size-13 bg-black/4 rounded transition-all ring-2 ring-transparent cursor-pointer text-gray-700 ${aspectRatio === '16:9' ? 'ring-gray-900/50 bg-black/8' : ''}`} />
              </div>
            </div>

            <div className="mb-4 text-gray-600">
              <label htmlFor="userPrompt" className="block text-sm mb-4">User Prompt <span className="text-xs text-gray-400">(optional)</span> </label>
              <textarea id="userPrompt" rows={4} value={userPrompt} onChange={(e) => setUserPrompt(e.target.value)} placeholder="Give a prompt" className="w-full bg-black/2 rounded-lg border-2 p-4 text-sm border-black/8 focus:border-gray-900/50 outline-none resize-none transition-all text-gray-900"></textarea>
            </div>

          </div>
        </div>

        <div className="flex justify-center mt-10">
          <PrimaryButton disabled={isGenerating} className="px-10 py-3 rounded-md disabled:opacity-70 disabled:cursor-not-allowed">
            {isGenerating ? (
              <>
               <LoaderIcon className="size-5 animate-spin"/> Generating...
              </>
            ) : (
              <>
               <Wand2Icon className="size-5"/>Generate Image
              </>
            )
            }
          </PrimaryButton>
        </div>

      </form>
    </div>
  )
}
export default Generator
