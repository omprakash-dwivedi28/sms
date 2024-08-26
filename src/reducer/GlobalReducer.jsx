const GlobalReducer = (state, action) => {
  switch (action.type) {
    case "GET_DEPOT_MASTER_INFO_BEGIN":
      return {
        ...state,
        depot_loding: true,
      };

    case "GET_DEPOT_MASTER_INFO_SUCCESS":
      return {
        ...state,
        depot_loding: false,
        depots: action.payload,
      };
    case "GET_DEPOT_MASTER_INFO_ERROR":
      return {
        ...state,
        depot_loding: false,
        depot_error: true,
      };

    // For skill master data

    case "GET_SKILL_MASTER_INFO_BEGIN":
      return {
        ...state,
        skill_loding: true,
      };

    case "GET_SKILL_MASTER_INFO_SUCCESS":
      return {
        ...state,
        skill_loding: false,
        skills: action.payload,
      };
    case "GET_SKILL_MASTER_INFO_ERROR":
      return {
        ...state,
        skill_loding: false,
        skill_error: true,
      };

    // For gp and level data

    case "GET_GP_MASTER_INFO_BEGIN":
      return {
        ...state,
        gp_loding: true,
      };

    case "GET_GP_MASTER_INFO_SUCCESS":
      return {
        ...state,
        gp_loding: false,
        gps: action.payload,
      };
    case "GET_GP_MASTER_INFO_ERROR":
      return {
        ...state,
        gp_loding: false,
        gp_error: true,
      };

    // For Desg. and level data

    case "GET_DESG_MASTER_INFO_BEGIN":
      return {
        ...state,
        desg_loding: true,
      };

    case "GET_DESG_MASTER_INFO_SUCCESS":
      return {
        ...state,
        desg_loding: false,
        desgs: action.payload,
      };
    case "GET_DESG_MASTER_INFO_ERROR":
      return {
        ...state,
        desg_loding: false,
        desg_error: true,
      };
    default:
      throw new Error(`No Matching "${action.type}" - action type`);
  }
};

export default GlobalReducer;
