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

  useEffect(() => {
    localStorage.setItem("currentNavOption", "interest");
  }, []);

  return (
    <div>
      <ResultsNav />
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
        <div
          className="option-2-interest"
          style={{ color: select === "3" ? "#b52d3b" : "" }}
          onClick={() => setSelect("3")}
        >
          REQUESTS
        </div>
      </div>
      <div className="container-interest">
        {select === "1" ? (
          <div className="container-view-interest">
            <div className="left-container-view-interest">
              <div className="view-text-interest">Viewed Me</div>
              <ViewedMe />
            </div>
            <div className="divider-interest"></div>
            <div className="left-container-view-interest">
              <div className="view-text-interest">Viewed</div>
              <Viewed />
            </div>
          </div>
        ) : select === "2" ? (
          <div className="container-view-interest">
            <div className="left-container-view-interest">
              <div className="view-text-interest">Favourited Me</div>
              <HeartedMe />
            </div>
            <div className="divider-interest"></div>
            <div className="left-container-view-interest">
              <div className="view-text-interest">Favourited</div>
              <Hearted />
            </div>
          </div>
        ) : (
          <div className="container-view-interest">
            <div className="left-container-view-interest">
              <div className="view-text-interest">Requests</div>
              <Request />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
