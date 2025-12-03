import { useMemo, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

export default function SupportContact() {
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);

  const text = useMemo(() => {
    const email = user?.email || "";
    const base = `Good day, my email is: ${email} - `;
    const tail = `then write the complaint here...`;
    return encodeURIComponent(`${base}${tail}`);
  }, [user?.email]);

  const waHref = `https://wa.me/+2348166846226?text=${text}`;

  return (
    <>
      {/* Floating Button */}
      <button
        aria-label="Contact Support"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg flex items-center justify-center"
      >
        {/* Font-Awesome like chat icon (inline SVG) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="h-6 w-6"
          fill="currentColor"
        >
          <path d="M256 32C114.6 32 0 125.1 0 240c0 45.1 17.1 86.8 45.9 121.2C38 407.3 7 469.5 6.6 470.3c-3.4 6.8-2.1 15 3.1 20.5C13.5 495.7 18.7 496 21 496c7.1 0 114.3-32.9 168.5-52.6C209.6 447.9 232.5 448 256 448c141.4 0 256-93.1 256-208S397.4 32 256 32z"/>
        </svg>
      </button>

      {/* Modal */}
      <div
        className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />
        {/* Dialog */}
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-md bg-white text-gray-900 rounded-lg shadow-lg border p-5 transition-all ${open ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-lg font-semibold">Contact Support</h2>
            <button onClick={() => setOpen(false)} className="text-2xl leading-none">x</button>
          </div>
          <div className="mt-3 space-y-3 text-sm">
            <p>
              Reach out to support for any complaints or issues. We typically respond within <strong>4-6 hours</strong> and aim to resolve quickly.
            </p>
            <p>
              Click the button below to open WhatsApp. The message will start with:
            </p>
            <pre className="bg-gray-100 p-2 rounded text-xs text-wrap">Good day, my email is: {user?.email || "your@email.com"} - then write your complaint here...</pre>
            <a
              href={waHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-medium"
            >
              {/* WhatsApp icon-like */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="h-4 w-4" fill="currentColor"><path d="M380.9 97.1C339 55.2 283.2 32 224.1 32 100.8 32 0 132.3 0 255.6c0 45.1 11.8 88.2 34.3 126.4L2.4 480l100.9-31.5c36.6 20 77.9 30.6 120.8 30.6h.1c123.3 0 224.1-100.3 224.1-223.6 0-59.1-23.2-114.8-66.1-157.4zM224.1 438.6h-.1c-37.8 0-74.8-10.1-107-29.1l-7.7-4.6-59.9 18.7 19.2-58.4-5-8.1c-21.3-34.1-32.5-73.6-32.5-113.8 0-117.8 96-213.7 214-213.7 57.3 0 111.2 22.3 151.7 62.8 40.6 40.5 63 94.3 63 151.6 0 117.9-96 214.6-215.7 214.6zm121.1-160.5c-6.6-3.3-39.1-19.3-45.1-21.5-6-2.2-10.4-3.3-14.8 3.3-4.4 6.6-17 21.5-20.8 25.9-3.8 4.4-7.7 5-14.3 1.6-6.6-3.3-27.9-10.3-53.1-32.8-19.6-17.3-32.8-38.7-36.6-45.3-3.8-6.6-.4-10.2 2.9-13.5 3-3 6.6-7.7 9.9-11.5 3.3-3.8 4.4-6.6 6.6-11 2.2-4.4 1.1-8.2-.5-11.5-1.6-3.3-14.8-35.7-20.3-48.9-5.4-13-10.9-11.2-14.8-11.4-3.8-.2-8.2-.2-12.6-.2s-11.5 1.6-17.5 8.2c-6 6.6-23 22.5-23 54.9s23.6 63.7 26.9 68.3c3.3 4.4 46.3 70.7 112.3 99.2 15.7 6.8 28 10.9 37.6 13.9 15.8 5 30.2 4.3 41.6 2.6 12.7-1.9 39.1-16 44.6-31.4 5.5-15.4 5.5-28.6 3.8-31.4-1.6-2.7-6-4.4-12.6-7.7z"/></svg>
              Message on WhatsApp
            </a>
            <p className="text-xs text-gray-500">Response time: 4-6 hours.</p>
          </div>
        </div>
      </div>
    </>
  );
}
