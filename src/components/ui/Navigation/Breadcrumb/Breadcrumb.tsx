import "./Breadcrumb.css";
import { ChevronRightIcon } from "../../Icons/Icons";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={item.label} className="breadcrumb-item">
            {item.href && !isLast ? (
              <a href={item.href} className="breadcrumb-link">
                {item.label}
              </a>
            ) : (
              <span className={isLast ? "breadcrumb-current" : "breadcrumb-link"}>
                {item.label}
              </span>
            )}
            {!isLast && (
              <span className="breadcrumb-separator" aria-hidden="true">
                <ChevronRightIcon size={14} />
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}