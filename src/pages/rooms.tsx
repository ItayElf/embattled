import Header from "../components/header";
import useCurrentUser from "../hooks/useCurrentUser";

export default function Rooms() {
  const user = useCurrentUser(true);
  return (
    <>
      <Header user={user} />
    </>
  );
}
