import { UploadIcon, XIcon } from "lucide-react";
import type { UploadZoneProps } from "../types";

const UploadZone = ({ label, file, onClear, onChange }: UploadZoneProps) => {
    return (
        <div className="relative group">
            <div
                className={`relative h-64 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-6
        ${file
                        ? "border-gray-400 bg-gray-50"
                        : "border-black/10 hover:border-gray-400 hover:bg-black/2"
                    }`}
            >
                {file ? (
                    <>
                        <img
                            src={URL.createObjectURL(file)}
                            alt="preview"
                            className="absolute inset-0 w-full h-full object-cover rounded-2xl opacity-60"
                        />

                        <button
                            type="button"
                            onClick={onClear}
                            className="absolute top-4 right-4 p-2 rounded-full bg-black/10 hover:bg-red-100 text-gray-700 hover:text-red-500 transition-colors"
                        >
                            <XIcon className="w-6 h-6" />
                        </button>

                        <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-md p-3 rounded-lg border border-black/8">
                            <p className="text-sm font-medium truncate text-gray-800">{file.name}</p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="w-16 h-16 rounded-full bg-black/4 flex items-center justify-center mb-4">
                            <UploadIcon className="w-8 h-8 text-gray-400 group-hover:text-gray-600 transition-colors" />
                        </div>

                        <h3 className="text-lg font-semibold mb-2 text-gray-900">{label}</h3>
                        <p className="text-sm text-gray-400 text-center max-w-[200px]">
                            Drag & drop or click to upload
                        </p>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={onChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default UploadZone;
