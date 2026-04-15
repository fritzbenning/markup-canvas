interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export function Button({ onClick, children }: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex cursor-pointer items-center gap-1.5 rounded-xl border-2 border-[#eee] bg-white/90 px-3 py-2 font-semibold text-black text-xs backdrop-blur transition-all hover:bg-neutral-100"
    >
      {children}
    </button>
  );
}
