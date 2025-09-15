import NavBar from "./NavBar";
import Posts from "../Posts/Posts";
import type { User } from "../../App";

export interface Post {
  id: number;
  title: string;
  photo: string;
  about: string;
  post: string;
  is_published: boolean;
  time: string;
  likes: number[];
  profile: User;
  comments_count: number;
}

const Home = () => {
  return (
    <div>
      <NavBar />
      <Posts />
    </div>
  );
};

export default Home;
