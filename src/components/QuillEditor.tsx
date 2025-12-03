import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
};

export default function QuillEditor({ value, onChange, placeholder, className = "", readOnly = false }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);
  const lastValueRef = useRef<string>(value || "");
  const initializedRef = useRef<boolean>(false);

  // Initialize editor once
  useEffect(() => {
    const container = containerRef.current;
    if (!container || initializedRef.current) return;

    // clean container and create editor element
    container.innerHTML = "";
    const editorEl = document.createElement("div");
    container.appendChild(editorEl);

    const q = new Quill(editorEl, {
      theme: "snow",
      readOnly,
      placeholder,
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link"],
          ["clean"],
        ],
      },
    });

    quillRef.current = q;
    initializedRef.current = true;

    q.on("text-change", () => {
      const root = q.root as HTMLElement | null;
      if (!root) return;
      const html = root.innerHTML;
      lastValueRef.current = html;
      onChange(html);
    });

    // initial content
    if (value) {
      q.clipboard.dangerouslyPasteHTML(0, value, "silent");
      lastValueRef.current = value;
    }

    return () => {
      // cleanup on unmount
      quillRef.current = null;
      if (containerRef.current) containerRef.current.innerHTML = "";
      initializedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync external value -> editor
  useEffect(() => {
    const q = quillRef.current;
    if (!q) return;
    const next = value || "";
    if (lastValueRef.current !== next) {
      const sel = q.getSelection();
      q.clipboard.dangerouslyPasteHTML(0, next, "silent");
      if (sel) q.setSelection(sel);
      lastValueRef.current = next;
    }
  }, [value]);

  return <div ref={containerRef} className={className} />;
}
