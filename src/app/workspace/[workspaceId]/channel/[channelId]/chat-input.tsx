import dynamic from "next/dynamic"
import Quill from "quill";
import { useRef } from "react"

const Editor = dynamic(() => import("@/components/editor"), { ssr: false })

export const ChatInput = () => {

    const editorRef = useRef<Quill | null>(null);

    return (
        <div className="px-5 w-full">
            <Editor
            placeholder="Test placeholder"
            onSubmit={() => {}}
            disabled={false}
            innerRef={editorRef}
            />
        </div>
    )
}