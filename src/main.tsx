import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import { router } from './routes/router'
import { useAuthStore } from './store/useAuthStore'
import { Toaster } from 'sonner'

function Bootstrap() {
  const { hydrated, bootstrap } = useAuthStore();
  useEffect(() => { if (!hydrated) bootstrap(); }, [hydrated]);
  return <RouterProvider router={router} />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster position='top-right' richColors />
    <Bootstrap />
  </StrictMode>,
)
