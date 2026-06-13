import React, { createContext } from "react";
import "./Navbar.css";

interface NavbarContextValue {
  variant: "default" | "transparent" | "bordered";
}

const NavbarContext = createContext<NavbarContextValue>({
  variant: "default",
});

interface NavbarProps {
  children: React.ReactNode;
  variant?: "default" | "transparent" | "bordered";
  className?: string;
}

function Navbar({
  children,
  variant = "default",
  className = "",
}: NavbarProps) {
  return (
    <NavbarContext.Provider value={{ variant }}>
      <header className={`navbar navbar--${variant} ${className}`}>
        <div className="navbar-inner">{children}</div>
      </header>
    </NavbarContext.Provider>
  );
}

interface NavbarBrandProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
}

function NavbarBrand({
  children,
  href = "/",
  className = "",
}: NavbarBrandProps) {
  return (
    <a href={href} className={`navbar-brand ${className}`}>
      {children}
    </a>
  );
}

interface NavbarContentProps {
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  className?: string;
}

function NavbarContent({
  children,
  align = "start",
  className = "",
}: NavbarContentProps) {
  return (
    <div
      className={`navbar-content navbar-content--${align} ${className}`}
    >
      {children}
    </div>
  );
}

interface NavbarItemProps {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}

function NavbarItem({
  children,
  active = false,
  className = "",
}: NavbarItemProps) {
  return (
    <div
      className={[
        "navbar-item",
        active ? "navbar-item--active" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

interface NavbarLinkProps {
  children: React.ReactNode;
  href?: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

function NavbarLink({
  children,
  href = "#",
  active = false,
  onClick,
  className = "",
}: NavbarLinkProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={[
        "navbar-link",
        active ? "navbar-link--active" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </a>
  );
}

interface NavbarSeparatorProps {
  className?: string;
}

function NavbarSeparator({
  className = "",
}: NavbarSeparatorProps) {
  return (
    <div className={`navbar-separator ${className}`} />
  );
}

Navbar.Brand = NavbarBrand;
Navbar.Content = NavbarContent;
Navbar.Item = NavbarItem;
Navbar.Link = NavbarLink;
Navbar.Separator = NavbarSeparator;

export default Navbar;