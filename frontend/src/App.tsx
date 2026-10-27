import AppRoutes from "./routes/AppRoutes";
import BackButton from "./components/BackButton";
import NavBar from "./components/NavBar";
import useLoadUser from "./hooks/useLoadUser";
function App() {
  useLoadUser();

  return (
    <main>
      <h1>סקרים בקהילה</h1>
      <NavBar />
      <BackButton />
      <AppRoutes />
    </main>
  );
}

export default App;
