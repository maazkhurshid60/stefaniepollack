import { useLocation } from "react-router-dom";

export default function NotFound() {
  const location = useLocation();
  
  return (
    <div className="relative flex flex-col items-center justify-center h-screen text-center px-4 bg-foreground-900">
      <h1 className="absolute bottom-0 text-9xl md:text-[12rem] font-black text-background-500/10 select-none pointer-events-none z-0">
        404
      </h1>
      <div className="relative z-10">
        <h1 className="text-xl md:text-2xl font-semibold mt-6 text-background-50">This page has not been generated</h1>
        <p className="mt-2 text-base text-background-400 font-mono">{location.pathname}</p>
        <p className="mt-4 text-lg md:text-xl text-background-300">Tell me more about this page, so I can generate it</p>
      </div>
    </div>
  );
}