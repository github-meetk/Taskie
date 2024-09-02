import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

//It is function of deciding whether ther route is open for user or not
function OpenRoute({ children }) {
  const { token } = useSelector((state) => state.auth);
  if (token !== null) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}

export default OpenRoute;
