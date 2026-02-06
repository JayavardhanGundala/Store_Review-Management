import Login from "./pages/Login/Login"
import AdminDah from "./pages/Admin/AdminDah"
import StoreOwnerDash from "./pages/Storeowner/StoreOwnerDash"
import UserDash from "./pages/User/UserDash"
import {createBrowserRouter,RouterProvider} from "react-router-dom"
function App() {
  const router=createBrowserRouter([
    {
      path:"/Login",
      element:<Login/>
    },
    {
      path:"/adminDashboard",
      element:<AdminDah/>
    },
    {
      path:"/storeownerDasgboard",
      element:<StoreOwnerDash/>
    },
    {
      path:"/userDahboard",
      element:<UserDash/>
    }
  ])


  return (
    <>
      <RouterProvider router={router}> 

      </RouterProvider>
    </>
  )
}

export default App
