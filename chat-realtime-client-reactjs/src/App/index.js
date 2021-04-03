import {useRoutes} from "react-router-dom";
import routes from "../routes";
import 'react-toastify/dist/ReactToastify.css';
export default function App() {
  const routing = useRoutes(routes);
    return (
      <div className="App">
        {routing}
      </div>
    );
}