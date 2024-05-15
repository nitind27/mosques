import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import RedSearchIcon from "../../../../public/nav/redSearch";
import SearchIcon from "../../../../public/nav/searchsvg";
import MessageIcon from "../../../../public/nav/messageIconsvg";
import RedMessageIcon from "../../../../public/nav/redMsgs";

export default function AdminNav() {
  const { data: session } = useSession();
  const { t, i18n } = useTranslation("global");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [logout, setLogout] = useState(false);
  const [selected, setSelected] = useState("search");
  const { push } = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const email1 = localStorage.getItem("email");
      const user1 = localStorage.getItem("username");

      if (!email1 || !user1) {
        push("/Pagess/sign/signIn/signIn");
      } else {
        setEmail(email1);
        setUsername(user1);
      }

      const currentNavOption = localStorage.getItem("currentNavOption");
      if (currentNavOption) {
        setSelected(currentNavOption);
      }
    };
    fetchData();
  }, [push]);

  const shiftToMessages = () => {
    push("/Pagess/admin/messagesAdmin");
  };

  const shiftToSearch = () => {
    push("/Pagess/admin/adminResult");
  };

  const changeNavOption = (option) => {
    setSelected(option);
    localStorage.setItem("currentNavOption", option);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    localStorage.removeItem("token");

    if (session) {
      await signOut("google");
    }
    push("/Pagess/HomePage/home");
  };

  return (
    <div style={{ zIndex: "1" }}>
      <div className="navbar-parent-container-navResult" style={{ margin: "10px" }}>
        <div className="navbar-logo-navResult" onClick={() => push("/Pagess/HomePage/home")}>
          <span style={{ color: "#358fa1" }}>{t("nav.first")}</span>
          <span style={{ color: "#b52d3b" }}>{t("nav.second")}</span>
        </div>
        <div className="svg-container-navResult">
          <div
            className="search-navResult"
            onClick={() => {
              localStorage.setItem("turn", 1);
              shiftToSearch();
              changeNavOption("search");
            }}
          >
            {selected === "search" ? <RedSearchIcon /> : <SearchIcon />}
          </div>
          <div
            className="message-navResult"
            onClick={() => {
              localStorage.setItem("turn", 0);
              shiftToMessages();
              changeNavOption("messages");
            }}
          >
            {selected === "messages" ? <RedMessageIcon /> : <MessageIcon />}
          </div>
        </div>
        <div className="account-navResult" onClick={() => setLogout(!logout)}>
          {username}
        </div>
      </div>
      {logout && (
        <div className="logout-container-navResult">
          <button className="logout-btn-navResult" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
