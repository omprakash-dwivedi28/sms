import React, { useEffect, useReducer, useContext, createContext } from "react";
import GlobalReducer from "../reducer/GlobalReducer";

const initialState = {
  // for depot init
  depot_loding: false,
  depots: null,
  depot_error: false,

  //for skill master init

  skill_loading: false,
  skills: null,
  skill_error: false,

  //for subskill master init

  subskill_loading: false,
  subskills: null,
  subskill_error: false,

  //for qualification init

  quali_loading: false,
  qualifications: null,
  quali_error: false,

  //for gp and levels master init

  gp_loading: false,
  gps: null,
  gp_error: false,

  //for desg. and levels master init

  desg_loading: false,
  desgs: null,
  desg_error: false,
};

const GlobalContext = createContext();
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(GlobalReducer, initialState);

  const fetchDepotInfo = async () => {
    // console.log("data");

    dispatch({ type: "GET_DEPOT_MASTER_INFO_BEGIN" });
    try {
      const response = await fetch(`https://railwaymcq.com/sms/Depot_info.php`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      // console.log(data);
      dispatch({ type: "GET_DEPOT_MASTER_INFO_SUCCESS", payload: data });
    } catch (error) {
      console.error("Error fetching DEPOT_MASTER info:", error);
      dispatch({ type: "GET_DEPOT_MASTER_INFO_ERROR" });
    }
  };
  const fetchSkillMaster = async () => {
    // console.log("skill data");

    dispatch({ type: "GET_SKILL_MASTER_INFO_BEGIN" });
    try {
      const response = await fetch(
        `https://railwaymcq.com/sms/skill_master.php`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      // console.log(data);
      dispatch({ type: "GET_SKILL_MASTER_INFO_SUCCESS", payload: data });
    } catch (error) {
      console.error("Error fetching SKILL_MASTER info:", error);
      dispatch({ type: "GET_SKILL_MASTER_INFO_ERROR" });
    }
  };
  //END OF SKILL MASTER
  const fetchsubSkillMaster = async () => {
    // console.log("skill data");

    dispatch({ type: "GET_SUBSKILL_MASTER_INFO_BEGIN" });
    try {
      const subskill_flag = true;
      const response = await fetch(
        `https://railwaymcq.com/sms/skill_master.php?subskill_flag=${subskill_flag}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      // console.log(data);
      dispatch({ type: "GET_SUBSKILL_MASTER_INFO_SUCCESS", payload: data });
    } catch (error) {
      console.error("Error fetching SUBSKILL_MASTER info:", error);
      dispatch({ type: "GET_SUBSKILL_MASTER_INFO_ERROR" });
    }
  };

  const fetchQuaification = async () => {
    // console.log("skill data");
    const edu_flag = true;
    dispatch({ type: "GET_QUALI_MASTER_INFO_BEGIN" });
    try {
      const response = await fetch(
        `https://railwaymcq.com/sms/gp_level.php?edu_flag=${edu_flag}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      // console.log(data);
      dispatch({ type: "GET_QUALI_MASTER_INFO_SUCCESS", payload: data });
    } catch (error) {
      console.error("Error fetching QUALI_MASTER info:", error);
      dispatch({ type: "GET_QUALI_MASTER_INFO_ERROR" });
    }
  };

  const fetchGPMaster = async () => {
    // console.log("skill data");

    dispatch({ type: "GET_GP_MASTER_INFO_BEGIN" });
    try {
      const response = await fetch(`https://railwaymcq.com/sms/gp_level.php`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      // console.log(data);
      dispatch({ type: "GET_GP_MASTER_INFO_SUCCESS", payload: data });
    } catch (error) {
      console.error("Error fetching SKILL_MASTER info:", error);
      dispatch({ type: "GET_GP_MASTER_INFO_ERROR" });
    }
  };

  const fetchDESGMaster = async () => {
    const desg_flag = true;
    dispatch({ type: "GET_DESG_MASTER_INFO_BEGIN" });
    try {
      const response = await fetch(
        `https://railwaymcq.com/sms/gp_level.php?desg_flag=${desg_flag}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      dispatch({ type: "GET_DESG_MASTER_INFO_SUCCESS", payload: data });
    } catch (error) {
      console.error("Error fetching DESG_MASTER info:", error);
      dispatch({ type: "GET_DESG_MASTER_INFO_ERROR" });
    }
  };

  useEffect(() => {
    fetchDepotInfo();
    fetchSkillMaster();
    fetchsubSkillMaster();
    fetchGPMaster();
    fetchDESGMaster();
    fetchQuaification();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        ...state,
        fetchDepotInfo,
        fetchSkillMaster,
        fetchsubSkillMaster,
        fetchGPMaster,
        fetchDESGMaster,
        fetchQuaification,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
export { GlobalContext };
