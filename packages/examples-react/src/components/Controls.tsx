interface ControlsProps {
  children: React.ReactNode;
}

export function Controls({ children }: ControlsProps) {
  return <div className="controls">{children}</div>;
}
