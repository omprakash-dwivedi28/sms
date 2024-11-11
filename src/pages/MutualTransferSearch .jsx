import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";

function MutualTransferSearch() {
  const { logoutUser, user, setUser } = useContext(UserContext);
  return (
    <div>
      {console.log(user)}
      <h1>Hear you can find your mutual acording to your profile</h1>
    </div>
  );
}

export default MutualTransferSearch;
