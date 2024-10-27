import { Link } from "react-router-dom";

interface NavItemProps {
  to: string;
  icon: JSX.Element;
  label: string;
  isExpanded: boolean;
  color?: string;
}

export default function NavItem({
  to,
  icon,
  label,
  isExpanded,
  color,
}: NavItemProps) {
  return (
    <li className="flex items-center space-x-2">
      <Link
        to={to}
        className={`${
          color ? color : "text-gray-300"
        } hover:text-white flex items-center text-lg transition-all duration-200`}
      >
        {icon}
        {isExpanded && <span className="ml-2">{label}</span>}
      </Link>
    </li>
  );
}
