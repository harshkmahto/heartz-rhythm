import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import About from "../pages/ShowCase/About";
import Shop from "../pages/Products/Shop";
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
import AllUsers from "../pages/Admin/User/AllUsers";
import OrderManagement from "../pages/Admin/OrderManagement";
import ProductManagement from "../pages/Admin/products/ProductManagement";
import UserManagement from "../pages/Admin/User/UserManagement";
import WishList from "../pages/Order/WishList";
import Cart from "../pages/Order/Cart";
import Checkout from "../pages/Order/Checkout";
import Profile from "../pages/Auth/Profile";
import LoginRegister from "../pages/Auth/LoginRegister";
import BecomeSeller from "../pages/Seller/BecomeSeller";
import NotFound from "../pages/ShowCase/NotFound";
import SellerLogin from "../pages/Auth/SellerLogin";
import SellerRegister from "../pages/Auth/SellerRegister";
import SellerVerify from "../pages/Auth/SellerVerify";
import ForgetPassword from "../pages/Auth/ForgetPassword";
import ProtectedRoute from "../components/Auth/ProtectedRoute";
import SellerBrandPannel from "../pages/Seller/SellerBrandPannel";
import SellerDetails from "../pages/Seller/SellerDetails";
import CreateSellerPannel from "../pages/Seller/CreateSellerPannel";
import SellerAllDetails from "../pages/Admin/User/SellerAllDetails";
import AllSellers from "../pages/Admin/User/AllSellers";
import AllBlockedUsers from "../pages/Admin/User/AllBlockedUsers";
import UnverifiedUser from "../pages/Admin/User/UnverifiedUser";
import StatusWiseUser from "../pages/Admin/User/StatusWiseUser";
import BinUsers from "../pages/Admin/User/BinUsers";
import CreateProducts from "../pages/Seller/CreateProducts";
import ProductDetails from "../pages/Seller/ProductDetails";
import SellerUpdateProduct from "../pages/Seller/SellerUpdateProduct";
import Inventory from "../pages/Seller/Inventory";
import DraftInventory from "../pages/Seller/DraftInventory";
import SellerAnalytics from "../pages/Seller/SellerAnalytics";
import AdminAllProducts from "../pages/Admin/products/AdminAllProducts";
import PriceUpdation from "../pages/Admin/products/PriceUpdation";
import ReportedItems from "../pages/Admin/products/ReportedItems";
import AdminProductDetails from "../pages/Admin/products/AdminProductDetails";
import ProductAbout from "../components/Products/ProductAbout";




const router = createBrowserRouter([
    {path: '/', element:<App/>, 
        children:[
            {index: true, element:<Home/>},
            {path: 'auth', element:<LoginRegister/> },

            {path: 'seller/auth', element:<SellerLogin/>},
            {path: 'seller/signup', element:<SellerRegister/> },
            {path: 'seller/login', element:<SellerLogin/>},
            {path: 'seller/verify', element:<SellerVerify/>},

            {path: 'forgot-password', element:<ForgetPassword/>},

            {path: 'seller/become-seller', element:<BecomeSeller/>},
            
            {path: 'about', element:<About/>},
            {path: 'shop', element:<Shop/>},
            {path: 'blogs', element:<BlogPage/>},
            {path: 'contact', element:<Contact/>},
            {path: 'categories', element: <Categories/>},
            {path: 'category/acoustic', element: <AcousticCategory/>},
            {path: 'category/electric', element: <ElectricCategory/>},
            {path: 'category/semi-acoustic', element: <SemiAcousticCategory/>},
            {path: 'product/details/:productCategory/:productId',element:<ProductAbout/>},

            {path: '*', element: <NotFound/>},




            
            {path: 'wishlist',element: ( <ProtectedRoute>  <WishList/> </ProtectedRoute> )},
            {path: 'cart', element: <Cart/>},
            {path: 'checkout', element: <Checkout/>},
            {path: 'profile', element: <Profile/>}
            
        ],
    },

    {path: 'seller', element:
       <ProtectedRoute allowedRoles={['seller']}> <SellerPannel/> </ProtectedRoute>,
        children:[
            {index: true, element:<SellerDashboard/>},
            {path: 'products', element:<SellerProductManagement/>},
            {path: 'products/all', element:<SellerAllProduct/>},
            {path: 'product/details/:productId', element:<ProductDetails/>},
            {path: 'create/seller-pannel', element:<CreateSellerPannel/>},
            {path: 'aboutme', element:<SellerBrandPannel/>},
            {path: 'seller-details', element:<SellerDetails/>},
            {path: 'product/create', element:<CreateProducts/>},
            {path: 'product/update/:productId', element:<SellerUpdateProduct/>},
            {path: 'products/inventory', element:<Inventory/>},
            {path: 'draft/inventory', element:<DraftInventory/>},
            {path: 'analytics', element:<SellerAnalytics/>},
            
        ],
    },

    {path: 'admin', element:
        <ProtectedRoute allowedRoles={['admin']}><AdminPannel/> </ProtectedRoute>,
        children:[
            {index: true, element:<AdminDashboard/>},
            {path: 'users/all', element:<AllUsers/>},
            {path: 'users', element:<UserManagement/>},
            {path: 'orders', element:<OrderManagement/>},
            {path: 'products', element:<ProductManagement/>},
            {path: 'users/sellers', element:<AllSellers/>},
            {path: 'seller-profile/:userId', element:<SellerAllDetails/>},
            {path: 'users/blocked', element:<AllBlockedUsers/>},
            {path: 'users/verification', element:<UnverifiedUser/>},
            {path: 'users/status', element:<StatusWiseUser/>},
            {path: 'users/bin', element:<BinUsers/>},
            {path: 'products/all', element:<AdminAllProducts/>},
            {path: 'products/price-update', element:<PriceUpdation/>},
            {path: 'products/report', element:<ReportedItems/>},
            {path: 'product/details/:productId', element:<AdminProductDetails/>},
           
        ],
    }
])

export default router;