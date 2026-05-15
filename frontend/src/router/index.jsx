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
import ProductManagement from "../pages/Admin/products/ProductManagement";
import UserManagement from "../pages/Admin/User/UserManagement";
import WishList from "../pages/Products/WishList";
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
import ProductAbout from "../pages/Products/ProductAbout";
import SellerBrandDetails from "../pages/Products/SellerBrandDetails";
import ReportedProducts from "../pages/Seller/ReportedProducts";
import AdminReportDetails from "../pages/Admin/products/AdminReportDetails";
import AllBlockedProducts from "../pages/Admin/products/AllBlockedProducts";
import MyBlockedProducts from "../pages/Seller/MyBlockedProducts";
import CategoryPage from "../pages/ShowCase/CategoryPage";
import ProductDetail from "../pages/Products/ProductDetail";
import ReturnReplace from "../pages/ShowCase/ReturnReplace";
import Terms from "../pages/ShowCase/Terms";
import Policies from "../pages/ShowCase/Policies";
import Help from "../pages/Auth/Help";
import Sellers from "../pages/ShowCase/Sellers";
import SerchPage from "../pages/Products/SerchPage";
import Address from "../pages/Order/Address";
import OrderConfirmation from "../pages/Order/OrderConfirmation";
import MyOrders from "../components/order/MyOrders";
import OrderDetails from "../components/order/OrderDetails";
import Ordermanagement from "../pages/Seller/orders/SellerOrdermanagement";
import AllOrders from "../pages/Seller/orders/SellerOrders";
import SellerOrdermanagement from "../pages/Seller/orders/SellerOrdermanagement";
import SellerOrders from "../pages/Seller/orders/SellerOrders";
import SellerOrderDetails from "../pages/Seller/orders/SellerOrderDetails";
import SellerCancelledOrders from "../pages/Seller/orders/SellerCancelledOrders";
import SellerCompletedOrders from "../pages/Seller/orders/SellerCompletedOrders";
import AdminOrderManagement from "../pages/Admin/orders/AdminOrderManagement";
import AdminAllOrder from "../pages/Admin/orders/AdminAllOrder";
import RefundedOrders from "../pages/Admin/orders/AdminRefundedOrders";
import AdminOrderDetails from "../pages/Admin/orders/AdminOrderDetails";
import CancelledOrders from "../pages/Admin/orders/AdminCancelledOrders";
import AdminRefundedOrders from "../pages/Admin/orders/AdminRefundedOrders";
import AdminCancelledOrders from "../pages/Admin/orders/AdminCancelledOrders";
import PlacedOrders from "../pages/Admin/orders/PlacedOrders";
import SellerRevenue from "../pages/Seller/orders/SellerRevenue";
import AdminRevenue from "../pages/Admin/orders/AdminRevenue";




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
            {path: 'category/:categorySlug', element:<CategoryPage/>},
            {path: 'product/details/:productCategory/:productId',element:<ProductAbout/>},
            {path: 'product/coming-soon/:id',element:<ProductDetail/>},
            {path: 'seller/brand/:brandName', element:<SellerBrandDetails/>},
            {path: 'sellers', element:<Sellers/>},
            {path: 'search', element:<SerchPage/>},
            {path: 'my-address', element:<Address/>},
            {path: 'order-confirmation', element:<OrderConfirmation/>},
            {path: 'order-details/:orderId', element:<OrderDetails/>},

            {path: 'returns', element:<ReturnReplace/>},
            {path: 'terms', element:<Terms/>},
            {path: 'privacy', element:<Policies/>},
            {path: 'help', element:<Help/>},


            {path: '*', element: <NotFound/>},






            {path: 'my-orders', element: <MyOrders/>},
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
            {path: 'product/report', element:<ReportedProducts/>},
            {path: 'products/blocked', element:<MyBlockedProducts/>},
            {path: 'orders', element:<SellerOrdermanagement/>},
            {path: 'orders/all', element:<SellerOrders/>},
            {path: 'orders/details/:orderId', element:<SellerOrderDetails/>},
            {path: 'orders/cancelled', element:<SellerCancelledOrders/>},
            {path: 'orders/delivered', element:<SellerCompletedOrders/>},
            {path: 'orders/revenue', element:<SellerRevenue/>},


            
        ],
    },

    {path: 'admin', element:
        <ProtectedRoute allowedRoles={['admin']}><AdminPannel/> </ProtectedRoute>,
        children:[
            {index: true, element:<AdminDashboard/>},
            {path: 'users/all', element:<AllUsers/>},
            {path: 'users', element:<UserManagement/>},
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
            {path: 'report/details/:id', element:<AdminReportDetails/>},
            {path: 'product/details/:productId', element:<AdminProductDetails/>},
            {path: 'products/blocked', element:<AllBlockedProducts/>},
            {path: 'orders', element:<AdminOrderManagement/>},
            {path: 'orders/all', element:<AdminAllOrder/>},
            {path: 'orders/details/:orderId', element:<AdminOrderDetails/>},
            {path: 'orders/placed', element:<PlacedOrders/>},
            {path: 'orders/cancelled', element:<AdminCancelledOrders/>},
            {path: 'orders/refunds', element:<AdminRefundedOrders/>},
            {path: 'orders/revenue', element:<AdminRevenue/>},
           
        ],
    }
])

export default router;