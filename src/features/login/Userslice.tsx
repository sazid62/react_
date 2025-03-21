import { createSlice, nanoid } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import { Comment, Post, userStruct } from "../../interfaces/user_interface";

const user = JSON.parse(
  localStorage.getItem("current_user") || '{"id":"","email":""}'
);
const users = JSON.parse(
  localStorage.getItem("userinfo") ||
    '[{"id":"1","email":"sajid@gmail.com","password":"1234","img":"https://i.pravatar.cc/48?u=118834"}]'
);

const posts = JSON.parse(
  localStorage.getItem("allPosts") ||
    '[{"post_time" : "", "post_id":"","user_id":"","isHidden":false,"postText":"","countReact":[{"reactor_id":""}],"Comments":[{  "like_comment_userList" : [{"user_name" : ""}]   ,                    "comment_id":"", "commentor_id":"","CommentText":"","commentor_name":"","commentor_img":"","Replies":[{"reply_id":"", "replier_id":"","ReplyText":"","replier_img":"","replier_name":""}]}]}]'
);
const initialState = {
  user_info: users,
  currentuser: {
    id: user.id,
    email: user.email,
    img: user.img,
  },
  AllUserPost: posts,
  ShowComment: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      const { email, password } = action.payload;
      const find = state.user_info.find((elem: userStruct) => {
        if (elem.password === password && elem.email === email) {
          return elem;
        }
      });
      //  console.log("i am in loginuser slice", action.payload.password);
      if (find) {
        state.currentuser = find;
        localStorage.setItem("current_user", JSON.stringify(find));
        Swal.fire({
          title: `Welcome ${state.currentuser.email}`,
          text: "click OK to continue!",
          icon: "success",
        });
      } else {
        Swal.fire({
          title: `Wrong username or password!!`,
          text: "Login failed!",
          icon: "error",
        });
        // console.log(state.currentuser.username);
        // alert('successed')
      }
    },
    logOutUser: (state) => {
      state.currentuser = { id: "", email: "", img: "" };
      localStorage.removeItem("current_user");
    },
    AddUser: (state, action) => {
      const { email, password } = action.payload;
      const idx = state.user_info.findIndex(
        (elem: userStruct) => elem.email === email
      );
      if (idx === -1) {
        const newuser = {
          id: nanoid(),
          email: email,
          password: password,
          img:
            "https://i.pravatar.cc/48?u=115" +
            String(Math.floor(Math.random() * 1000)),
        };
        state.user_info.push(newuser);
        Swal.fire({
          title: "user created succesfully!!",
          icon: "success",
        });
        state.currentuser = {
          id: newuser.id,
          email: newuser.email,
          img: newuser.img,
        };
        localStorage.setItem("current_user", JSON.stringify(state.currentuser));
      } else {
        Swal.fire({
          title: "user email already exist",
          icon: "warning",
        });
        return;
      }
      localStorage.setItem("userinfo", JSON.stringify(state.user_info));
    },
    AddReact: (state, action) => {
      if (state.currentuser.id === "") {
        Swal.fire({
          title: "please login to react!!",
          icon: "info",
        });
        return;
      }
      const { post_id } = action.payload;
      console.log(post_id);
      const idx = state.AllUserPost.findIndex(
        (elem: Post) => elem.post_id === post_id
      );
      if (idx !== -1) {
        const user_alrdy_reacted = state.AllUserPost[idx].countReact.findIndex(
          (elem: { reactor_id: string }) =>
            elem.reactor_id === state.currentuser.id
        );
        if (user_alrdy_reacted !== -1) {
          const updatedReactions = state.AllUserPost[idx].countReact.filter(
            (elem: { reactor_id: string }) =>
              elem.reactor_id !== state.currentuser.id
          );

          const temp = {
            ...state.AllUserPost[idx],
            countReact: updatedReactions,
          };

          state.AllUserPost = [
            ...state.AllUserPost.slice(0, idx),
            temp,
            ...state.AllUserPost.slice(idx + 1),
          ];
          return;
        }

        const temp = {
          ...state.AllUserPost[idx],
          countReact: [
            ...state.AllUserPost[idx].countReact,
            { reactor_id: state.currentuser.id },
          ],
        };

        state.AllUserPost = [
          ...state.AllUserPost.slice(0, idx),
          temp,
          ...state.AllUserPost.slice(idx + 1),
        ];
      }

      localStorage.setItem("allPosts", JSON.stringify(state.AllUserPost));
      console.log(state.AllUserPost);
    },
    AddComment: (state, action) => {
      if (state.currentuser.id === "") {
        Swal.fire({
          title: "please login to comment!!",
          icon: "info",
        });
        return;
      }
      const { post_id, CommentText } = action.payload;
      const idx = state.AllUserPost.findIndex(
        (post: Post) => post.post_id === post_id
      );

      if (idx !== -1) {
        const newComment = {
          comment_id: nanoid(),
          commentor_id: state.currentuser.id,
          CommentText: CommentText,
          commentor_name: state.currentuser.email.slice(
            0,
            state.currentuser.email.indexOf("@")
          ),
          commentor_img: state.currentuser.img,
          Replies: [],
          like_comment_userList: [],
        };

        const temp = {
          ...state.AllUserPost[idx],
          Comments: [...state.AllUserPost[idx].Comments, newComment],
        };

        state.AllUserPost = [
          ...state.AllUserPost.slice(0, idx),
          temp,
          ...state.AllUserPost.slice(idx + 1),
        ];
        localStorage.setItem("allPosts", JSON.stringify(state.AllUserPost));
      }
      //   console.log(state.AllUserPost[idx]);
    },

    AddLikeToComment: (state, action) => {
      const { liker_id, comment_id } = action.payload;

      if (state.currentuser.id === "") {
        Swal.fire({
          title: "Please login to like a comment!",
          icon: "info",
        });
        return;
      }

      state.AllUserPost.forEach((post) => {
        post.Comments.forEach((comment) => {
          if (comment.comment_id === comment_id) {
            const likedIndex = comment.like_comment_userList.findIndex(
              (user) => user.user_name === state.currentuser.email
            );

            if (likedIndex !== -1) {
              // Unlike the comment (remove user from like list)
              comment.like_comment_userList.splice(likedIndex, 1);
            } else {
              // Like the comment (add user to like list)
              comment.like_comment_userList.push({
                user_name: state.currentuser.email,
              });
            }
          }
        });
      });

      localStorage.setItem("allPosts", JSON.stringify(state.AllUserPost));
    },
    AddPost: (state, action) => {
      if (state.currentuser.id === "") {
        Swal.fire({
          title: "please login to create post!!",
          icon: "info",
        });
        return;
      }

      const { postText } = action.payload;
      const newPost = {
        post_id: nanoid(),
        user_id: state.currentuser.id,
        postText: postText,
        isHidden: false,
        countReact: [],
        Comments: [],
        post_time: Date.now(),
      };

      state.AllUserPost = [...state.AllUserPost, newPost];
      localStorage.setItem("allPosts", JSON.stringify(state.AllUserPost));
      Swal.fire({
        title: "Posted",
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      // console.log(state.AllUserPost)
    },

    AddReply: (state, action) => {
      const { post_id, comment_id, replyText, replier_img, replier_name } =
        action.payload;

      const pIdx = state.AllUserPost.findIndex(
        (post: Post) => post.post_id === post_id
      );
      if (state.currentuser.email === "") {
        return;
      }

      if (pIdx !== -1) {
        const post = state.AllUserPost[pIdx];
        const cIdx = post.Comments.findIndex(
          (comment: Comment) => comment.comment_id === comment_id
        );

        if (cIdx !== -1) {
          const comment = post.Comments[cIdx];

          const newReply = {
            reply_id: nanoid(),
            replier_id: state.currentuser.id,
            ReplyText: replyText,
            replier_img: replier_img,
            replier_name: replier_name,
          };

          const updatedComment = {
            ...comment,
            Replies: [...comment.Replies, newReply],
          };

          const temp = {
            ...post,
            Comments: [
              ...post.Comments.slice(0, cIdx),
              updatedComment,
              ...post.Comments.slice(cIdx + 1),
            ],
          };

          state.AllUserPost = [
            ...state.AllUserPost.slice(0, pIdx),
            temp,
            ...state.AllUserPost.slice(pIdx + 1),
          ];

          localStorage.setItem("allPosts", JSON.stringify(state.AllUserPost));
          console.log(state.AllUserPost);
        }
      }
    },
    DeletePost: (state, action) => {
      const { post_id } = action.payload;

      const pIdx = state.AllUserPost.findIndex(
        (post: Post) => post.post_id === post_id
      );

      if (pIdx !== -1) {
        const post = state.AllUserPost[pIdx];

        if (post.user_id === state.currentuser.id) {
          state.AllUserPost = [
            ...state.AllUserPost.slice(0, pIdx),
            ...state.AllUserPost.slice(pIdx + 1),
          ];

          localStorage.setItem("allPosts", JSON.stringify(state.AllUserPost));
          Swal.fire({
            title: "Post deleted successfully!",
            icon: "success",
          });
        } else {
          Swal.fire({
            title: "You are not authorized!",
            icon: "error",
          });
        }
      }
    },
    HidePost: (state, action) => {
      const { post_id } = action.payload;

      const pIdx = state.AllUserPost.findIndex(
        (post: Post) => post.post_id === post_id
      );
      console.log(post_id);
      if (pIdx !== -1) {
        const post = state.AllUserPost[pIdx];
        console.log(post);
        if (post.user_id === state.currentuser.id) {
          const temp = {
            ...post,
            isHidden: !post.isHidden,
          };

          state.AllUserPost = [
            ...state.AllUserPost.slice(0, pIdx),
            temp,
            ...state.AllUserPost.slice(pIdx + 1),
          ];
          console.log(temp);
          localStorage.setItem("allPosts", JSON.stringify(state.AllUserPost));
        } else {
          Swal.fire({
            title: "You are not authorized!!",
            icon: "error",
          });
        }
      }
    },
    EditPost: (state, action) => {
      const { post_id, newText } = action.payload;

      const pIdx = state.AllUserPost.findIndex(
        (post: Post) => post.post_id === post_id
      );

      if (pIdx !== -1) {
        const post = state.AllUserPost[pIdx];

        if (post.user_id === state.currentuser.id) {
          const updted = {
            ...post,
            postText: newText,
          };

          state.AllUserPost = [
            ...state.AllUserPost.slice(0, pIdx),
            updted,
            ...state.AllUserPost.slice(pIdx + 1),
          ];

          localStorage.setItem("allPosts", JSON.stringify(state.AllUserPost));
        } else {
          Swal.fire({
            title: "You are not authorized",
            icon: "error",
          });
        }
      }
    },
  },
});

export const {
  loginUser,
  logOutUser,
  AddUser,
  AddComment,
  AddPost,
  AddReact,
  AddReply,
  DeletePost,
  HidePost,
  EditPost,
  AddLikeToComment,
} = userSlice.actions;
export default userSlice.reducer;
