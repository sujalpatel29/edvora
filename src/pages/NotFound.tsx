import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // return (
  //   <div className="min-h-screen flex items-center justify-center bg-gray-100">
  //     <div className="text-center">
  //       <h1 className="text-4xl font-bold mb-4">404</h1>
  //       <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
  //       <a href="/" className="text-blue-500 hover:text-blue-700 underline">
  //         Return to Home
  //       </a>
  //     </div>
  //   </div>
  // );
  return (
    <>
      <main className="grid min-h-full place-items-center bg-gray-900 px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-indigo-400">404</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-white sm:text-7xl">
            Page not found
          </h1>
          <p className="mt-6 text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/"
              className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Go back home
            </a>
          </div>
        </div>
      </main>
    </>
  )
};

export default NotFound;
