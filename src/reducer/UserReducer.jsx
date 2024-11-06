const UserReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      const userData = action.payload;
      return {
        ...state,
        user: userData,
      };
    case "SET_USER_LOGOUT":
      // userData = action.payload;
      return {
        ...state,
        user: null,
      };
    case "SET_ADMIN_DASHBOARD_DATA": {
      console.log(action.payload.defaultPath);
      return {
        ...state,
        dashboardData: {
          activeBtn: action.payload.activeBtn,
          minNmax: action.payload.minNmax,
          defaultPath: action.payload.defaultPath,
        },
      };
    }
    default:
      throw new Error(`No Matching "${action.type}" - action type`);
  }
};

export default UserReducer;
