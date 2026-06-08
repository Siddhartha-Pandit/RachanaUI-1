import "./Breadcrumb.css";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({
  items,
}: BreadcrumbProps) {
  return (
    <nav className="breadcrumb">
      {items.map((item, index) => (
        <div
          key={item.label}
          className="breadcrumb-item"
        >
          {item.href ? (
            <a
              href={item.href}
              className="breadcrumb-link"
            >
              {item.label}
            </a>
          ) : (
            <span className="breadcrumb-current">
              {item.label}
            </span>
          )}

          {index !== items.length - 1 && (
            <span className="breadcrumb-separator">
              /
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}