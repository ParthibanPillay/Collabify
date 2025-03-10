import Quill, { Delta, QuillOptions, Op } from "quill";

import "quill/dist/quill.snow.css";
import { MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

import { PiTextAa } from "react-icons/pi";
import { MdSend } from "react-icons/md";
import { ImageIcon, Smile } from "lucide-react";
import { Hint } from "./hint";
import { cn } from "@/lib/utils";
import Keyboard from "quill/modules/keyboard";
import { current } from "../../convex/members";
import { EmojiPopover } from "./emoji-popover";

type EditorValue = {
    image: File | null;
    body: string;
}

interface EditorProps {
    onSubmit: ({ image, body }: EditorValue) => void;
    onCancel?: () => void;
    placeholder?: string;
    defaultValue?: Delta | Op[];
    disabled?: boolean;
    innerRef?: MutableRefObject<Quill | null>;
    variant?: "create" | "update";
};

const Editor = ({
    onCancel,
    onSubmit,
    placeholder = "write something...",
    defaultValue = [],
    disabled = false,
    innerRef,
    variant = "create" }: EditorProps) => {

    const [text, setText] = useState("");
    const [istoolbarvisible, setIstoolbarvisible] = useState(true);

    const submitRef = useRef(onSubmit);
    const placeholderRef = useRef(placeholder);
    const quillRef = useRef<Quill | null>(null);
    const defaultValueRef = useRef(defaultValue);
    const containerRef = useRef<HTMLDivElement>(null);
    const disabledRef = useRef(disabled);

    useLayoutEffect(() => {
        submitRef.current = onSubmit;
        placeholderRef.current = placeholder;
        defaultValueRef.current = defaultValue;
        disabledRef.current = disabled;
    });

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const editorContainer = container.appendChild(
            container.ownerDocument.createElement("div"),
        );

        const options: QuillOptions = {
            theme: "snow",
            placeholder: placeholderRef.current,
            modules: {
                toolbar: [
                    ["bold", "italic", 'strike'],
                    ["link"],
                    [{ list: "ordered" }, { list: "bullet" }]
                ],
                //TODO fix this keyboard issue
                // Keyboard: {
                //     bindings: {
                //         enter: {
                //             key: "Enter",
                //             handler: () => {
                //                 return;
                //             }
                //         },
                //         shift_enter: {
                //             key: "Enter",
                //             shiftKey:true,
                //             handler: () => {
                //                 quill.insertText(quill.getSelection()?.index || 0,"\n");
                //             },
                //         },
                //     },
                // },
            },
        };

        const quill = new Quill(editorContainer, options);
        quillRef.current = quill;
        quillRef.current.focus();

        if (innerRef) {
            innerRef.current = quill;
        };

        quill.setContents(defaultValueRef.current);
        setText(quill.getText());

        quill.on(Quill.events.TEXT_CHANGE, () => {
            setText(quill.getText());
        });

        return () => {
            quill.off(Quill.events.TEXT_CHANGE);
            if (container) {
                container.innerHTML = "";
            }
            if (quillRef.current) {
                quillRef.current = null;
            }
            if (innerRef) {
                innerRef.current = null;
            }
        };
    }, [innerRef]);

    const toggleToolbar = () => {
        setIstoolbarvisible((current) => !current);
        const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");

        if (toolbarElement) {
            toolbarElement.classList.toggle("hidden");
        }
    };

    const onEmojiSelect = (emoji: any) => {
        const quill = quillRef.current;

        quill?.insertText(quill?.getSelection()?.index || 0,emoji.native);
    }

    const isEmpty = text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

    return (
        <div className="flex flex-col">
            <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:shadow-sm transition bg-white">
                <div ref={containerRef} className="h-full ql-custom" />
                <div className="flex px-2 pb-2 z-[5]">
                    <Hint label={istoolbarvisible ? "Hide formatting" : "Show formatting"}>
                        <Button
                            disabled={disabled}
                            size="sm"
                            variant="ghost"
                            onClick={toggleToolbar}
                        >
                            <PiTextAa className="size-4" />
                        </Button>
                    </Hint>
                    <EmojiPopover onEmojiSelect={onEmojiSelect}>
                        <Button
                            disabled={disabled}
                            size="iconSm"
                            variant="ghost"
                        >
                            <Smile className="size-4" />
                        </Button>
                    </EmojiPopover>
                    {variant === "create" && (
                        <Hint label="Image">
                            <Button
                                disabled={disabled}
                                size="iconSm"
                                variant="ghost"
                                onClick={() => { }}
                            >
                                <ImageIcon className="size-4" />
                            </Button>
                        </Hint>
                    )}
                    {variant === "update" && (
                        <div className="ml-auto flex items-center gap-x-2">
                            <Button variant="outline" size="sm" onClick={() => { }} disabled={false}>cancel</Button>
                            <Button size="sm" onClick={() => { }} disabled={disabled || isEmpty}
                                className="bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
                            >save</Button>
                        </div>
                    )}
                    {variant === "create" && (
                        <Button
                            disabled={disabled || isEmpty}
                            onClick={() => { }}
                            className={cn("ml-auto",
                                isEmpty
                                    ? "bg-white hover:bg-white text-muted-foreground"
                                    : "bg-[#007a5a] hover:bg-[#007a5a]/80 text-white")}>
                            <MdSend className="size-4" />
                        </Button>
                    )}
                </div>
            </div>
            {variant === "create" && (
                <div className={cn(
                    "p-2 text-[10px] text-muted-foreground flex justify-end opacity-0 transition",
                    !isEmpty && "opacity-100"
                )}>
                    <p>
                        <strong>Shift + Return to add a new line</strong>
                    </p>
                </div>
            )}
        </div>
    )
};

export default Editor;