import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";

const Dashboard = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.user) return navigate("/login");
  }, [auth.user]);

  return (
    <section>
      <h1>Dashboard</h1>
    </section>
  );
};

export default Dashboard;
