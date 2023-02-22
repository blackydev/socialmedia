import { createContext } from "react";
import { EncodedToken } from "../service/types/users";

let UserContext = createContext<EncodedToken | null>(null);

UserContext.displayName = "UserContext";

export default UserContext;
