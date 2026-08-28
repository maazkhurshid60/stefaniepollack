import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import About from "../pages/about/page";
import Buyers from "../pages/buyers/page";
import Sellers from "../pages/sellers/page";
import Neighborhoods from "../pages/neighborhoods/page";
import Philanthropy from "../pages/philanthropy/page";
import Resources from "../pages/resources/page";
import Contact from "../pages/contact/page";
import Listings from "../pages/listings/page";
import PropertyDetail from "../pages/listings/slug/page";
import Blog from "../pages/blog/page";
import BlogArticle from "../pages/blog/slug/page";
import Account from "../pages/account/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/buyers",
    element: <Buyers />,
  },
  {
    path: "/sellers",
    element: <Sellers />,
  },
  {
    path: "/neighborhoods",
    element: <Neighborhoods />,
  },
  {
    path: "/philanthropy",
    element: <Philanthropy />,
  },
  {
    path: "/resources",
    element: <Resources />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/listings",
    element: <Listings />,
  },
  {
    path: "/listings/:slug",
    element: <PropertyDetail />,
  },
  {
    path: "/blog",
    element: <Blog />,
  },
  {
    path: "/blog/:slug",
    element: <BlogArticle />,
  },
  {
    path: "/account",
    element: <Account />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
