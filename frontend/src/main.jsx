import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './router/index.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { SellerProvider } from './context/SellerContext.jsx'
import { Provider } from 'react-redux';
import { store } from './store/store.js'

createRoot(document.getElementById('root')).render(

   <AuthProvider>
     <SellerProvider>
      <Provider store={store}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
      </Provider>
     </SellerProvider>
   </AuthProvider> 
  
)
