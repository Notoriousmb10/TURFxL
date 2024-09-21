import React, { useRef, useEffect, useState } from "react";
import { Container, Row, Button } from "reactstrap";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../../assets/images/logo.png";
import { CiSearch } from "react-icons/ci";
import { BsCart3 } from "react-icons/bs";
import { MdMenu } from "react-icons/md";
import { FaCaretDown } from "react-icons/fa"; // Import the arrow icon
import "./header.css";
import { useDispatch } from "react-redux";
import {
  loginStatus as setLoginStatus,
  setUserInfo,
} from "../../redux/actions/userActions";
const nav__links = [
  {
    path: "/home",
    display: "Home",
  },
  {
    path: "/search",
    display: "Search",
  },
  {
    path: "/turfs",
    display: "Turfs",
  },
];

const Header = () => {
  const loginStatus = useSelector((state) => state.loginStatus.isLoggedIn);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const [profilePhoto, setprofilePhoto] = useState(null)
  const [loginStatusState, setloginStatusState] = useState(false)

  const Logout = () => {
    localStorage.clear();
    setloginStatusState(false)
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedUserPhoto = storedUser ? JSON.parse(storedUser).photo : null;
    setprofilePhoto(storedUserPhoto)
    const storedLoginStatus = localStorage.getItem("isLoggedIn");
    setloginStatusState(storedLoginStatus)

  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        headerRef.current.classList.add("sticky__header");
      } else {
        headerRef.current.classList.remove("sticky__header");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const navigateToHome = () => {
    navigate("/")
  }

  return (
    <header className="header" ref={headerRef}>
      <Container>
        <Row>
          <div className="nav__wrapper d-flex align-items-center justify-content-between">
            {/* Logo */}
            <div className="logo">
              <img src={logo} alt="Logo" onClick={navigateToHome}/>
            </div>

            {/* Navigation */}
            <div className="navigation">
              <ul className="menu d-flex align-items-center gap-5">
                {nav__links.map((item, index) => (
                  <li className="nav__item" key={index}>
                    <NavLink
                      to={item.path}
                      className={(navClass) =>
                        navClass.isActive ? "active__link" : ""
                      }
                    >
                      {item.display}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right side buttons and mobile menu */}
            <div className="nav__right d-flex align-items-center gap-4">
              <div className="nav__btns d-flex align-items-center gap-4">
                <div className="p-2 rounded-full cursor-pointer md-plus:text-white md-plus:font-bold active:bg-slate-400 transition-colors duration-2000">
                  <CiSearch />
                </div>
                <div className="p-2 rounded-full cursor-pointer md-plus:text-white md-plus:font-bold active:bg-slate-400 transition-colors duration-2000">
                  <BsCart3 />
                </div>
                {loginStatusState ? (
                  <div
                    className="relative flex items-center gap-2"
                    ref={dropdownRef}
                  >
                    <img
                      src={profilePhoto}
                      alt="User"
                      className="profilepic"
                      onClick={Logout}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "path/to/fallback-image.jpg";
                      }}
                    />
                    {dropdownOpen && (
                      <div className="dropdown">
                        <button onClick={() => navigate("/profile")}>
                          View Profile
                        </button>
                        <button
                          onClick={() => {
                            localStorage.removeItem("user");
                            localStorage.removeItem("isLoggedIn");
                            dispatch(setUserInfo(null));
                            dispatch(setLoginStatus(false));
                            navigate("/login");
                          }}
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Button className="btn secondary__btn">
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button className="btn primary__btn">
                      <Link to="/register">Register</Link>
                    </Button>
                  </>
                )}
              </div>
              <span className="mobile__menu">
                <MdMenu className="ri-menu-line" />
              </span>
            </div>
          </div>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
