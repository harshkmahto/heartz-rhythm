import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './router/index.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(

   <AuthProvider>
     <ThemeProvider>
        <RouterProvider router={router} />
     </ThemeProvider>
   </AuthProvider> 
  
)
