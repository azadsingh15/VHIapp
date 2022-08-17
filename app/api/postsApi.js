import client from "./client";
import AsyncStorage from "@react-native-async-storage/async-storage";
const getAll = async (user_id) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await client.get(`/${user_id}/allposts`, {
      headers: {
        authorization: `JWT ${token}`,
      },
    });
    //console.log(response.data);
    if (response.data.success) {
      return response.data.allposts;
    }
  } catch (error) {
    console.log("error while getting all posts", error);
  }
};
const getAllDoctors = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await client.get("/alldoctors", {
      headers: {
        authorization: `JWT ${token}`,
      },
    });
    //console.log(response.data);
    if (response.data.success) {
      return response.data.alldoctors;
    }
  } catch (error) {
    console.log("error while getting all posts", error);
  }
};
const getSingle = async (user_id, post_id) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await client.get(`/${user_id}/post/${post_id}`, {
      headers: {
        authorization: `JWT ${token}`,
      },
    });
    //console.log(response.data);
    //if (response.data.success) {
    return response.data.post;
    //}
  } catch (error) {
    console.log("Error while getting a single post", error);
  }
};
const postDetails = async (display_name, desc) => {
  const token = await AsyncStorage.getItem("token");
  try {
    const postDetailsRes = await client.post(
      "/create-post",
      {
        display_name,
        desc,
      },
      {
        headers: {
          authorization: `JWT ${token}`,
        },
      }
    );
    return postDetailsRes;
  } catch (error) {
    console.log("error inside postDetails method");
  }
};
const postDoc = async (image) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const postDocRes = await client.post(
      "/upload-post",
      {
        image,
      },
      {
        headers: {
          authorization: `JWT ${token}`,
        },
      }
    );
    return postDocRes;
  } catch (error) {
    console.log("error inside postDoc method");
  }
};
const updateDetails = async () => {
  const token = await AsyncStorage.getItem("token");
  try {
    const postDetailsRes = await client.post(
      "/update-post",
      {
        _id,
        display_name,
        desc,
        image,
      },
      {
        headers: {
          authorization: `JWT ${token}`,
        },
      }
    );
    return postDetailsRes;
  } catch (error) {
    console.log("error inside postDetails method");
  }
};
export default {
  getAll,
  getSingle,
  postDetails,
  postDoc,
  updateDetails,
  getAllDoctors,
};
