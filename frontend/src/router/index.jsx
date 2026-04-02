import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import About from "../pages/ShowCase/About";
import Shop from "../pages/Shop";
import BlogPage from "../pages/Blogs/BlogPage";
import Contact from "../pages/Auth/Contact";
import Categories from "../pages/ShowCase/Categories";
import AcousticCategory from "../pages/ShowCase/AcousticCategory";
import ElectricCategory from "../pages/ShowCase/ElectricCategory";
import SemiAcousticCategory from "../pages/ShowCase/SemiAcousticCategory";
import SellerPannel from "../pages/Seller/SellerPannel";
import SellerDashboard from "../pages/Seller/SellerDashboard";
import AdminPannel from "../pages/Admin/AdminPannel";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import SellerProductManagement from "../pages/Seller/SellerProductManagement";
import SellerAllProduct from "../pages/Seller/SellerAllProduct";
import AllUsers from "../pages/Admin/AllUsers";
import OrderManagement from "../pages/Admin/OrderManagement";
import ProductManagement from "../pages/Admin/ProductManagement";
import UserManagement from "../pages/Admin/UserManagement";
import WishList from "../pages/Order/WishList";
import Cart from "../pages/Order/Cart";
import Checkout from "../pages/Order/Checkout";
import Profile from "../pages/Auth/Profile";




const router = createBrowserRouter([
    {path: '/', element:<App/>, 
        children:[
            {index: true, element:<Home/>},
            {path: 'about', element:<About/>},
            {path: 'shop', element:<Shop/>},
            {path: 'blogs', element:<BlogPage/>},
            {path: 'contact', element:<Contact/>},
            {path: 'categories', element: <Categories/>},
            {path: 'category/acoustic', element: <AcousticCategory/>},
            {path: 'category/electric', element: <ElectricCategory/>},
            {path: 'category/semi-acoustic', element: <SemiAcousticCategory/>},
            {path: 'wishlist', element: <WishList/>},
            {path: 'cart', element: <Cart/>},
            {path: 'checkout', element: <Checkout/>},
            {path: 'profile', element: <Profile/>}
        ],
    },

    {path: 'seller', element:<SellerPannel/>,
        children:[
            {index: true, element:<SellerDashboard/>},
            {path: 'products', element:<SellerProductManagement/>},
            {path: 'products/all', element:<SellerAllProduct/>},
        ],
    },

    {path: 'admin', element:<AdminPannel/>,
        children:[
            {index: true, element:<AdminDashboard/>},
            {path: 'users', element:<AllUsers/>},
            {path: 'user/management', element:<UserManagement/>},
            {path: 'orders', element:<OrderManagement/>},
            {path: 'products', element:<ProductManagement/>},
        ],
    }
])

export default router;