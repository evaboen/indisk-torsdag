import { useLocation, Navigate } from "react-router-dom";
import { IArrangement, IUserProfile } from "../firebase/dbUtils";
import { NewArrangementFormModal } from "./newArrangementForm";

interface IProps {
  user: IUserProfile;
}

export function EditArrangementPage({ user }: IProps) {
  const location = useLocation();
  const arrangement = location.state?.arrangement as IArrangement | undefined;

  if (!arrangement) {
    return <Navigate to="/arrangements" replace />;
  }

  return <NewArrangementFormModal user={user} arrangement={arrangement} />;
}
