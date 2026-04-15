interface ControlsProps {
  children: React.ReactNode;
}

export function Controls({ children }: ControlsProps) {
  return <div className="fixed bottom-5 left-12 z-[1000] flex gap-2.5">{children}</div>;
}
