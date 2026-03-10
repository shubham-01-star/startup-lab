"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal as TerminalIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";

const ROUTE_COMMANDS: Record<string, { path: string; message: string }> = {
    "/": { path: "/", message: "Booting homepage... Redirecting to /." },
    "/projects": { path: "/projects", message: "Opening products index... Redirecting to /projects." },
    "/blog": { path: "/blog", message: "Loading technical writing... Redirecting to /blog." },
    "/experiments": { path: "/experiments", message: "Opening lab builds... Redirecting to /experiments." },
    "/ideas": { path: "/ideas", message: "Loading startup ideas... Redirecting to /ideas." },
    "/timeline": { path: "/timeline", message: "Opening founder journey... Redirecting to /timeline." },
    "/about": { path: "/about", message: "Loading profile data... Redirecting to /about." },
    "/contact": { path: "/contact", message: "Opening secure transmission channel... Redirecting to /contact." },
    "/now": { path: "/now", message: "Loading current focus... Redirecting to /now." },
    "/login": { path: "/admin/login", message: "Initiating secure connection... Redirecting to admin portal." },
};

const INITIAL_HISTORY: { type: "command" | "response" | "error"; text: string }[] = [
    { type: "response", text: "Startup Lab OS v1.0.0" },
    { type: "response", text: 'Type "help" to see available commands.' },
];

export default function TerminalButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [input, setInput] = useState("");
    const [history, setHistory] = useState<{ type: "command" | "response" | "error"; text: string }[]>(INITIAL_HISTORY);
    const inputRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history, isOpen]);

    const handleCommand = (cmd: string) => {
        const trimmedCmd = cmd.trim().toLowerCase();
        if (!trimmedCmd) return;

        setHistory((prev) => [...prev, { type: "command", text: cmd }]);

        let response = "";
        let isError = false;

        switch (trimmedCmd) {
            case "help":
                response = `Available commands:
  help       - Show this message
  clear      - Clear terminal output
  /          - Open homepage
  /projects  - Open products
  /blog      - Open technical writing
  /experiments - Open lab builds
  /ideas     - Open startup ideas
  /timeline  - Open founder journey
  /about     - Open about page
  /contact   - Go to contact page
  /now       - See what I am focused on right now
  /login     - Access admin portal
  sudo su    - Access admin portal
  mail       - Go to contact page
  whoami     - Guest user`;
                break;
            case "clear":
                setHistory(INITIAL_HISTORY);
                return;
            case "/login":
            case "sudo su":
                response = ROUTE_COMMANDS["/login"].message;
                setTimeout(() => {
                    setIsOpen(false);
                    router.push(ROUTE_COMMANDS["/login"].path);
                }, 1000);
                break;
            case "/contact":
            case "mail":
                response = ROUTE_COMMANDS["/contact"].message;
                setTimeout(() => {
                    setIsOpen(false);
                    router.push(ROUTE_COMMANDS["/contact"].path);
                }, 1000);
                break;
            case "whoami":
                response = "guest_user_1337";
                break;
            default:
                if (ROUTE_COMMANDS[trimmedCmd]) {
                    response = ROUTE_COMMANDS[trimmedCmd].message;
                    setTimeout(() => {
                        setIsOpen(false);
                        router.push(ROUTE_COMMANDS[trimmedCmd].path);
                    }, 900);
                } else {
                    response = `Command not found: ${trimmedCmd}. Type "help" for a list of commands.`;
                    isError = true;
                }
        }

        if (response) {
            setHistory((prev) => [...prev, { type: isError ? "error" : "response", text: response }]);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleCommand(input);
            setInput("");
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-text-secondary hover:text-accent-primary hover:bg-accent-primary/10 rounded-lg transition-colors"
                title="Open Terminal"
            >
                <TerminalIcon className="w-5 h-5" />
            </button>

            {mounted && createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsOpen(false)}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="w-full max-w-2xl bg-bg-primary border border-border/50 rounded-xl overflow-hidden shadow-2xl flex flex-col"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Terminal Header */}
                                <div className="flex items-center justify-between px-4 py-3 bg-bg-secondary border-b border-border/50">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-error/80" />
                                        <div className="w-3 h-3 rounded-full bg-warning/80" />
                                        <div className="w-3 h-3 rounded-full bg-success/80" />
                                    </div>
                                    <div className="text-xs font-mono text-text-secondary flex items-center gap-2">
                                        <TerminalIcon className="w-3.5 h-3.5" /> root@startup-lab:~
                                    </div>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="text-text-secondary hover:text-text-primary transition-colors"
                                        aria-label="Close terminal"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Terminal Body */}
                                <div
                                    className="p-4 h-[400px] overflow-y-auto font-mono text-sm bg-bg-primary"
                                    onClick={() => inputRef.current?.focus()}
                                >
                                    {history.map((line, i) => (
                                        <div key={i} className="mb-2 whitespace-pre-wrap">
                                            {line.type === "command" && (
                                                <div className="flex items-start">
                                                    <span className="text-success mr-2">guest@lab:~$</span>
                                                    <span className="text-text-primary">{line.text}</span>
                                                </div>
                                            )}
                                            {line.type === "response" && (
                                                <div className="text-text-secondary">{line.text}</div>
                                            )}
                                            {line.type === "error" && (
                                                <div className="text-error">{line.text}</div>
                                            )}
                                        </div>
                                    ))}

                                    <div className="flex items-center">
                                        <span className="text-success mr-2">guest@lab:~$</span>
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            className="flex-1 bg-transparent outline-none text-text-primary caret-accent-primary"
                                            spellCheck={false}
                                            autoComplete="off"
                                        />
                                    </div>
                                    <div ref={bottomRef} />
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}
