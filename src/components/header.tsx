import User from "../interfaces/user";
import { ReactComponent as Logo } from "../assets/imgs/LogoShadow.svg";
import { Link } from "react-router-dom";
import { BASE_API } from "../constants";

interface Props {
  user?: User;
}

const Header: React.FC<Props> = ({ user }) => {
  return (
    <header className="fixed top-0 z-10 flex h-16 w-full items-center justify-between bg-primary-600 px-16 shadow-sm">
      <div className="flex items-center space-x-12">
        <div className="flex items-center space-x-2">
          <Logo className="h-14" />
          <h4 className="h4 text-white">Embattled</h4>
        </div>
        <Link to={"/rooms"} className="h5 text-white">
          Home
        </Link>
        <Link to={"/armybuilder"} className="h5 text-white">
          Armybuilder
        </Link>
      </div>
      {user ? (
        <div className="flex items-center space-x-3">
          <h5 className="h5 text-white">{user.name}</h5>
          <img
            className="h-12 w-12 rounded-full"
            src={BASE_API + `auth/profile/${user.name}`}
            alt=""
          />
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <Link to={"/signIn"} className="h6 text-primary-50">
            Sign In
          </Link>
          <Link
            to={"/signUp"}
            className="h6 rounded bg-primary-50 p-2 text-primary-900"
          >
            Sign Up
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
