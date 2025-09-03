import api from "../../services/api";

interface Props {
  username: string;
}

// Follow user
export const CreateFollow = async (username: string) => {
  try {
    const res = await api.post(`/api/users/follow/${username}/`);
    if (res.status !== 201) {
      alert("Something went wrong");
    }
  } catch (err) {
    alert(err);
  }
};

// Unfollow user
export const Unfollow = async (username: string) => {
  try {
    const res = await api.post(`/api/users/unfollow/${username}/`);
    if (res.status !== 204) {
      alert("Something went wrong");
    }
  } catch (err) {
    alert(err);
  }
};
