import { createContext } from "react";
import { Post } from "../service/types/posts";

let PostContext = createContext<Post | null>(null);

PostContext.displayName = "PostContext";

export default PostContext;
