import ai from "../configs/ai.js";
import { v2 as cloudinary } from "cloudinary";

interface GenerateAdParams {
    imageUrls: string[];
    productName: string;
    productDescription: string;
    userPrompt: string;
    targetLength: number;
    aspectRatio: string;
}

/**
 * Step 1: Analyze product images and generate ad script using gpt-4.1-mini (vision)
 * Returns: ad copy, taglines, scene-by-scene video script, and a refined image generation prompt
 */
export async function generateAdScript(params: GenerateAdParams): Promise<{ adScript: string; imagePrompt: string }> {
    const { imageUrls, productName, productDescription, userPrompt, targetLength, aspectRatio } = params;

    const imageBlocks = imageUrls.map((url) => ({
        type: "input_image" as const,
        image_url: url,
        detail: "low" as const,
    }));

    const response = await ai.responses.create({
        model: "gpt-4.1-mini",
        input: [
            {
                role: "developer",
                content: `You are an expert ad creative director. Analyze the provided product images and generate compelling ad content. Return your response in the following exact format:

---AD COPY---
[Write 2-3 short, punchy ad copy variations / taglines for the product]

---VIDEO SCRIPT---
[Write a scene-by-scene video script for a ${targetLength}-second ad in ${aspectRatio} format. Each scene should describe: the visual, any text overlay, and transitions]

---IMAGE PROMPT---
[Write a single detailed prompt that can be used with an AI image generator to create a stunning ad creative image for this product. The prompt should reference the product's key visual features from the uploaded images. Keep it under 200 words.]`,
            },
            {
                role: "user",
                content: [
                    {
                        type: "input_text",
                        text: `Product Name: ${productName}
Product Description: ${productDescription || "Not provided"}
Additional Instructions: ${userPrompt || "None"}
Target Ad Length: ${targetLength} seconds
Aspect Ratio: ${aspectRatio}

Please analyze these ${imageUrls.length} product images and generate ad content.`,
                    },
                    ...imageBlocks,
                ],
            },
        ],
    });

    const outputText = response.output_text;

    // Extract the image prompt section for use in image generation
    const imagePromptMatch = outputText.match(/---IMAGE PROMPT---\s*([\s\S]*?)(?:---|$)/);
    const imagePrompt = imagePromptMatch ? imagePromptMatch[1].trim() : `Create a stunning advertisement image for ${productName}`;

    // The full output (without the image prompt) is the ad script
    const adScript = outputText.replace(/---IMAGE PROMPT---[\s\S]*$/, "").trim();

    return { adScript, imagePrompt };
}

/**
 * Step 2: Generate an ad creative image using gpt-image-1
 * Takes the 2 product images + refined prompt and generates a new ad image
 * Returns: Cloudinary URL of the generated image
 */
export async function generateAdImage(imageUrls: string[], imagePrompt: string): Promise<string> {
    // Download images from Cloudinary URLs and convert to File objects for the API
    const imageFiles = await Promise.all(
        imageUrls.map(async (url) => {
            const response = await fetch(url);
            const blob = await response.blob();
            const file = new File([blob], "product.png", { type: "image/png" });
            return file;
        })
    );

    // Use the Images Edit API with gpt-image-1
    // gpt-image-1 supports up to 16 input images and always returns base64
    const result = await ai.images.edit({
        model: "gpt-image-1",
        image: imageFiles,
        prompt: imagePrompt,
        n: 1,
        size: "1024x1024",
    });

    const base64Image = result.data?.[0]?.b64_json;
    if (!base64Image) {
        throw new Error("No image data returned from gpt-image-1");
    }

    // Upload the generated base64 image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(
        `data:image/png;base64,${base64Image}`,
        {
            resource_type: "image",
            folder: "ad-gen/generated",
        }
    );

    return uploadResult.secure_url;
}
