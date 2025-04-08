'use client'
import React, { useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore'
import { Image, LoaderIcon, Send, X } from 'lucide-react'
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';

interface ImageChangeEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & { files: FileList | null };
}
interface HandleSendMessageEvent extends React.FormEvent<HTMLFormElement> { }

export default function MessageInput() {
    const [text, setText] = useState('')
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [isSending, setIsSending] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { sendMessage } = useChatStore()
    const { authUserId } = useAuthStore()


    const handleImageChange = (e: ImageChangeEvent) => {
        const file = e.target.files?.[0]
        if (!file?.type.match(/^image\/(jpeg|png|gif|webp)$/)) {
            toast.error("Please select an image file")
            return;
        }
        const reader = new FileReader()
        reader.onload = () => {
            setImagePreview(reader.result as string)
        }
        reader.readAsDataURL(file)
    }
    const removeImage = () => {
        setImagePreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }


    const handleSendMessage = async (e: HandleSendMessageEvent): Promise<void> => {
        e.preventDefault()
        if (!text.trim() && !imagePreview) return;

        let imageUrl: string | null = null;

        setIsSending(true);
        try {
            // Step 1: Upload image to Cloudinary (if any)
            if (imagePreview) {
                const res = await fetch("/api/cloudinary/sign");
                const { timestamp, signature, apiKey, cloudName } = await res.json();

                const formData = new FormData();
                formData.append("file", fileInputRef.current?.files?.[0] as File);
                formData.append("api_key", apiKey);
                formData.append("timestamp", timestamp.toString());
                formData.append("signature", signature);
                formData.append("folder", "chatty_uploads");

                const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                    method: "POST",
                    body: formData,
                });

                const cloudinaryData = await cloudinaryRes.json();
                if (!cloudinaryRes.ok || !cloudinaryData.secure_url) {
                    throw new Error("Cloudinary upload failed");
                }
                imageUrl = cloudinaryData.secure_url;
            }

            await sendMessage({
                text: text.trim(),
                media: imageUrl,
            }, authUserId)

            setText('')
            setImagePreview(null)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
            // toast.success("Message sent")
        } catch (error) {
            console.error("Error sending message:", error)
            toast.error("Failed to send message")

        } finally {
            setIsSending(false);
        }
    }
    return (
        <div className="p-4 w-full">
            {imagePreview && (
                <div className="mb-3 flex items-center gap-2">
                    <div className="relative">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                        />
                        <button
                            onClick={removeImage}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
                            type="button"
                        >
                            <X className="size-3" />
                        </button>
                    </div>
                </div>
            )}

            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <div className="flex-1 flex gap-2">
                    {/* <input
                        type="text"
                        className="w-full input input-bordered rounded-lg input-sm sm:input-md"
                        placeholder="Type a message..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    /> */}
                    <textarea
                        rows={1}
                        className="pt-2 w-full min-h-10 h-auto max-h-24 overflow-y-auto resize-none input input-bordered rounded-lg input-md sm:input-md"
                        placeholder="Type a message..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = "auto"; // Reset
                            target.style.height = `${target.scrollHeight}px`; // Grow naturally
                        }}

                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault(); // Prevent newline
                                const form = e.currentTarget.closest("form");
                                form?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
                            }
                        }}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                    />

                </div>
                <button
                    type="button"
                    className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Image size={20} />
                </button>
                <button
                    type="submit"
                    className="btn btn-md btn-circle"
                    disabled={!text.trim() && !imagePreview || isSending}
                >
                    {isSending ? <LoaderIcon /> : <Send size={22} />}
                </button>
            </form>
        </div>
    )
}
