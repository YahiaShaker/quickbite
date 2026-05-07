import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

const NavShell = styled.nav`
  align-items: center;
  background: white;
  border: 1px solid #dedad4;
  border-radius: 30px 30px 0 0;
  bottom: 0;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.25);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  height: 80px;
  left: 0;
  padding: 0 32px;
  position: sticky;
  transition: box-shadow 180ms ease;
  width: 100%;
  z-index: 5;

  &:hover {
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.18);
  }
`;

function BottomNav() {
  const { pathname } = useLocation();

  const links = [
    {
      to: "/",
      label: "Home",
      icon: pathname === "/" ? "/images/figma/nav-home-active.svg" : "/images/figma/nav-home.svg",
      match: pathname === "/"
    },
    { to: "/", label: "Search", icon: "/images/figma/nav-search.svg", match: false },
    {
      to: "/cart",
      label: "Cart",
      icon: pathname === "/cart" ? "/images/figma/nav-cart-active.svg" : "/images/figma/nav-cart.svg",
      match: pathname === "/cart"
    },
    { to: "/", label: "Profile", icon: "/images/figma/nav-profile.svg", match: false }
  ];

  return (
    <NavShell aria-label="Primary navigation">
      {links.map((link) => (
        <Link
          key={link.label}
          className={link.match ? "bottom-nav__link bottom-nav__link--active" : "bottom-nav__link"}
          to={link.to}
          aria-label={link.label}
        >
          <img src={link.icon} alt="" />
        </Link>
      ))}
    </NavShell>
  );
}

export default BottomNav;
