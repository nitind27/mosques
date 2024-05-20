import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Viewed from "./viewed";
import ViewedMe from "./viewedMe";
import ResultsNav from "../navResult";
import Hearted from "./hearted";
import HeartedMe from "./heartedMe";
import Request from "./request";

export default function Interest() {
  const { push } = useRouter();
  const [select, setSelect] = useState("1");
  const [viewSelect, setViewSelect] = useState("");

  useEffect(() => {
    localStorage.setItem("currentNavOption", "interest");

    // Set the default viewSelect based on the select value
    if (select === "1") {
      setViewSelect("3");
    } else if (select === "2") {
      setViewSelect("5");
    }
  }, [select]);



  
  return (
    <div>
      <ResultsNav />
      <div className="interest-container">
        <div className="shade-interest"></div>
        <div className="option-section-interest">
          <div
            className="option-1-interest"
            style={{ color: select === "1" ? "#b52d3b" : "" }}
            onClick={() => setSelect("1")}
          >
            VIEWS
          </div>
          <div
            className="option-2-interest"
            style={{ color: select === "2" ? "#b52d3b" : "" }}
            onClick={() => setSelect("2")}
          >
            FAVOURITE
          </div>
        </div>

        <div className="divider-interest"></div>

        <div className="container-interest">
          {select === "1" ? (
            <div className="container-view-interest">
              <div className="left-container-view-interest">
                <div
                  className="view-text-interest"
                  style={{ color: viewSelect === "3" ? "#b52d3b" : "" }}
                  onClick={() => setViewSelect("3")}
                >
                  Viewed Me
                </div>
                <div
                  className="view-text-interest4 "
                  style={{ color: viewSelect === "4" ? "#b52d3b" : "" }}
                  onClick={() => setViewSelect("4")}
                >
                  Viewed
                </div>
              </div>

              {viewSelect === "3" && <ViewedMe />}
              {viewSelect === "4" && <Viewed />}
            </div>
          ) : select === "2" ? (
            <div className="container-view-interest">
              <div className="left-container-view-interest">
                <div
                  className="view-text-interest"
                  style={{ color: viewSelect === "5" ? "#b52d3b" : "" }}
                  onClick={() => setViewSelect("5")}
                >
                  Favourited Me
                </div>
                <div
                  className="view-text-interest two"
                  style={{ color: viewSelect === "6" ? "#b52d3b" : "" }}
                  onClick={() => setViewSelect("6")}
                >
                  Favourited
                </div>
              </div>
              {viewSelect === "5" && <HeartedMe />}
              {viewSelect === "6" && <Hearted />}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
