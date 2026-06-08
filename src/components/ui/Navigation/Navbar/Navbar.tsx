import "./Navbar.css";

interface NavbarProps {
  logo?: React.ReactNode;

  children?: React.ReactNode;
}

export default function Navbar({
  logo,
  children,
}: NavbarProps) {
  return (
    <header className="navbar">
      <div className="navbar-left">
        {logo}
      </div>

      <div className="navbar-right">
        {children}
      </div>
    </header>
  );
}