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

  //for quata and levels master init

  quata_loading: false,
  quata: null,
  quata_error: false,

  //for desg. and levels master init

  desg_loading: false,
  desgs: null,
  desg_error: false,

  zone_division_loading: false,
  zone_division: null,
  zone_division_error: false,

  deptt_loading: false,
  deptt_division: null,
  deptt_division_error: false,

  appmode_loading: false,
  appmode: null,
  appmode_error: false,

  community_loading: false,
  community: null,
  community_error: false,

  section_loading: false,
  sections: null,
  section_error: false,
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

  const fetchQuata = async () => {
    // console.log("skill data");
    const quata_flag = true;
    dispatch({ type: "GET_QUATA_MASTER_INFO_BEGIN" });
    try {
      const response = await fetch(
        `https://railwaymcq.com/sms/gp_level.php?quata_flag=${quata_flag}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      // console.log(data);
      dispatch({ type: "GET_QUATA_MASTER_INFO_SUCCESS", payload: data });
    } catch (error) {
      console.error("Error fetching QUATA_MASTER info:", error);
      dispatch({ type: "GET_QUATA_MASTER_INFO_ERROR" });
    }
  };

  const fetchSection = async () => {
    // console.log("skill data");
    const section_flag = true;
    dispatch({ type: "GET_SECTION_MASTER_INFO_BEGIN" });
    try {
      const response = await fetch(
        `https://railwaymcq.com/sms/gp_level.php?section_flag=${section_flag}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      // console.log(data);
      dispatch({ type: "GET_SECTION_MASTER_INFO_SUCCESS", payload: data });
    } catch (error) {
      console.error("Error fetching SECTION_MASTER info:", error);
      dispatch({ type: "GET_SECTION_MASTER_INFO_ERROR" });
    }
  };
  const fetchCommunity = async () => {
    // console.log("skill data");
    const community_flag = true;
    dispatch({ type: "GET_COMMUNITY_MASTER_INFO_BEGIN" });
    try {
      const response = await fetch(
        `https://railwaymcq.com/sms/gp_level.php?community_flag=${community_flag}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      // console.log(data);
      dispatch({ type: "GET_COMMUNITY_MASTER_INFO_SUCCESS", payload: data });
    } catch (error) {
      console.error("Error fetching QUALI_MASTER info:", error);
      dispatch({ type: "GET_COMMUNITY_MASTER_INFO_ERROR" });
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

  const fetchAppMode = async () => {
    const mode_flag = true;
    dispatch({ type: "GET_APPMODE_MASTER_INFO_BEGIN" });
    try {
      const response = await fetch(
        `https://railwaymcq.com/sms/gp_level.php?mode_flag=${mode_flag}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      dispatch({ type: "GET_APPMODE_MASTER_INFO_SUCCESS", payload: data });
    } catch (error) {
      console.error("Error fetching DESG_MASTER info:", error);
      dispatch({ type: "GET_APPMODE_MASTER_INFO_ERROR" });
    }
  };

  const fetchZoneDivision = async () => {
    // const desg_flag = true;
    dispatch({ type: "GET_ZONE_DIVISION_MASTER_INFO_BEGIN" });
    try {
      const response = await fetch(
        `https://railwaymcq.com/sms/zone_division_api.php`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      dispatch({
        type: "GET_ZONE_DIVISION_MASTER_INFO_SUCCESS",
        payload: data,
      });
    } catch (error) {
      console.error("Error fetching DESG_MASTER info:", error);
      dispatch({ type: "GET_ZONE_DIVISION_MASTER_INFO_ERROR" });
    }
  };
  const fetchDeptt = async () => {
    // const desg_flag = true;
    dispatch({ type: "GET_DEPTT_MASTER_INFO_BEGIN" });
    try {
      const response = await fetch(`https://railwaymcq.com/sms/deptt_api.php`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      dispatch({
        type: "GET_DEPTT_MASTER_INFO_SUCCESS",
        payload: data,
      });
    } catch (error) {
      console.error("Error fetching DESG_MASTER info:", error);
      dispatch({ type: "GET_DEPTT_MASTER_INFO_ERROR" });
    }
  };

  useEffect(() => {
    fetchDepotInfo();
    fetchSkillMaster();
    fetchsubSkillMaster();
    fetchGPMaster();
    fetchDESGMaster();
    fetchQuaification();
    fetchZoneDivision();
    fetchDeptt();
    fetchAppMode();
    fetchCommunity();
    fetchQuata();
    fetchSection();
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
        fetchZoneDivision,
        fetchDeptt,
        fetchAppMode,
        fetchCommunity,
        fetchQuata,
        fetchSection,
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
