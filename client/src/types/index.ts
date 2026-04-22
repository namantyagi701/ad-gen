export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export interface UploadZoneProps{
    label: string;
    file: File | null;
    onClear : () => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    // handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface User {
    id?: string;
    name?: string;
    email?: string;
}

export interface Project{
    id:string;  //required
    name?: string; //optional
    userId?: string;
    user?: UserActivation;
    productName : string;
    productDescription : string;
    userPrompt: string;
    aspectRatio : string;
    targetLength?: number;
    adScript?: string;
    generatedImage?: string;
    generatedVideo?: string;
    isGenerating ?: boolean;
    isPublished ?: boolean;
    error ?: string;
    createdAt : Date | string;
    updatedAt?: Date | string;
    uploadedImages: string[];
}