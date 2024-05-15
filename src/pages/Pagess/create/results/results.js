import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../AppContext";
import ResultNav from "./navResult";
import Filters from "./filters";
import Search from "./search";
import { useRouter } from "next/navigation";
import MenuIcon from "../../../../../public/search/menuIconSvg";

export default function Results() {
  const { genderContext, setGenderContext } = useContext(AppContext);
  const { aboutmeContext, setAboutmeContext } = useContext(AppContext);
  const { personalContext, setPersonalContext } = useContext(AppContext);
  const { religonContext, setReligonContext } = useContext(AppContext);
  const { push } = useRouter();

  //------------------Checks for token----------------
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token === null && !token) {
      console.log("token not found");
      push("/Pagess/sign/signIn/signIn");
    } else {
      console.log("Token found!");
    }
  }, []);
  //------------------^^^^^^^^^^^^^^^----------------

  //-------------If screen is mobile--------------

  const [screenMobile, setScreenMobile] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 764) {
        setScreenMobile(true);
      } else {
        setScreenMobile(false);
        setShowMenu(false);
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //---------------^^^^^^^^^^^^^^^----------------

  return (
    <form>
      <div className="parent-result">
        <ResultNav />
        <div className="box-parent-result">
          <div className="filters-parent-container-result">
            {screenMobile ? (
              <div className="menu-icon-parent-result">
                <div
                  onClick={() => {
                    setShowMenu(!showMenu);
                  }}
                  className="menu-icon-parent-result"
                >
                  {" "}
                  <MenuIcon />
                </div>

                {showMenu && (
                  <div className="second-parent-filter-result">
                    <Filters />
                  </div>
                )}
              </div>
            ) : (
              <div>
                <Filters />
              </div>
            )}
          </div>
          <div className="search-parent-result">
            {/* Do not remove this div*/}
            <Search />
          </div>
        </div>
      </div>
    </form>
  );
}
