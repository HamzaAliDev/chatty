import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinarySignatureResponse {
    timestamp: number;
    signature: string;
    apiKey: string | undefined;
    cloudName: string | undefined;
}

export async function GET(request: Request): Promise<Response> {
    try {
        const timestamp: number = Math.round(new Date().getTime() / 1000);

        const signature: string = cloudinary.utils.api_sign_request(
            {
                timestamp,
                folder: "chatty_uploads", // optional folder in Cloudinary
            },
            process.env.CLOUDINARY_API_SECRET as string
        );

        const responseBody: CloudinarySignatureResponse = {
            timestamp,
            signature,
            apiKey: process.env.CLOUDINARY_API_KEY,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        };

        return Response.json(responseBody);
    } catch (error) {
        console.error("Error generating Cloudinary signature:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
