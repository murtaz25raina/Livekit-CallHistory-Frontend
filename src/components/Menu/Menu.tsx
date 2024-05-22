import { FC, ReactNode } from "react";
import "./Menu.css";
interface MenuItem {
  icon: ReactNode;
  content: ReactNode;
}

interface MenuProps {
  items: MenuItem[];
  onClose?: () => void;
  position?: { top: number; left: number };
}

const Menu: FC<MenuProps> = ({ items }) => {
  // const menuStyle: React.CSSProperties = {
  //   position: "absolute",
  //   top: position.top + 10, // Adjust the offset from the button
  //   left: position.left + 10, // Adjust the offset from the button
  // };
  return (
    <div className="menu">
      {items.map((item, index) => (
        <div key={index} className="menu-item">
          <div className="menu-icon">{item.icon}</div>
          <div className="menu-content">{item.content}</div>
        </div>
      ))}
    </div>
  );
};

export default Menu;
