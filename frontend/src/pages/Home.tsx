import NavBar from "./NavBar";
import Aside from "./SideBar";
import Posts from "./Posts";

export interface Post {
  id: number;
  title: string;
  photo: string;
  about: string;
  post: string;
  is_published: boolean;
  author: string;
  time: string;
  likes: number[];
}

const Home = () => {
  return (
    <div>
      <NavBar />
      <Aside />
      <Posts />
    </div>
  );
};

export default Home;
