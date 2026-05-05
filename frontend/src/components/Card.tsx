import { CSSProperties } from "react";

export function Card({ children, onClick, delay = 0 }: any) {
  const style: CSSProperties = {
    animation: `fadeInUp 600ms ease-out forwards`,
    animationDelay: `${delay}ms`,
    opacity: delay > 0 ? 0 : 1,
  };

  return (
    <div
      onClick={onClick}
      style={style}
      className="rounded-xl bg-white/95 p-6 shadow-md transition duration-300 ease-out hover:shadow-lg hover:scale-105 backdrop-blur-sm"
    >
      {children}
    </div>
  );
}