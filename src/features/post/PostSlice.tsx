import { createSlice, nanoid } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import { Comment, Post } from "../../interfaces/user_interface";

const posts = JSON.parse(
  localStorage.getItem("allPosts") ||
    '[{"post_id":"","user_id":"","isHidden":false,"postText":"","countReact":[{"reactor_id":""}],"Comments":[{"comment_id":"", "commentor_id":"","CommentText":"","commentor_name":"","commentor_img":"","Replies":[{"reply_id":"", "replier_id":"","ReplyText":"","replier_img":"","replier_name":""}]}]}]'
);

const initialState = {
  AllUserPost: posts,
};

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    AddReact: (state, action) => {
      const { post_id, currentuser } = action.payload;
      if (currentuser.id === "") {
        Swal.fire({
          title: "please login to react!!",
          icon: "info",
        });
        return;
      }
      const idx = state.AllUserPost.findIndex(
        (elem: Post) => elem.post_id === post_id
      );
      if (idx !== -1) {
        const user_alrdy_reacted = state.AllUserPost[idx].countReact.findIndex(
          (elem: { reactor_id: string }) =>
            elem.reactor_id === currentuser.id
        );
        if (user_alrdy_reacted !== -1) {
          const updatedReactions = state.AllUserPost[idx].countReact.filter(
            (elem: { reactor_id: string }) =>
              elem.reactor_id !== currentuser.id
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
            { reactor_id: currentuser.id },
          ],
        };

        state.AllUserPost = [
          ...state.AllUserPost.slice(0, idx),
          temp,
          ...state.AllUserPost.slice(idx + 1),
        ];
      }

      localStorage.setItem("allPosts", JSON.stringify(state.AllUserPost));
    },
    AddComment: (state, action) => {
      const { post_id, CommentText, currentuser } = action.payload;
      if (currentuser.id === "") {
        Swal.fire({
          title: "please login to comment!!",
          icon: "info",
        });
        return;
      }
      const idx = state.AllUserPost.findIndex(
        (post: Post) => post.post_id === post_id
      );

      if (idx !== -1) {
        const newComment = {
          comment_id: nanoid(),
          commentor_id: currentuser.id,
          CommentText: CommentText,
          commentor_name: currentuser.email.slice(
            0,
            currentuser.email.indexOf("@")
          ),
          commentor_img: currentuser.img,
          Replies: [],
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
    },
    AddPost: (state, action) => {
      const { postText, currentuser } = action.payload;
      if (currentuser.id === "") {
        Swal.fire({
          title: "please login to create post!!",
          icon: "info",
        });
        return;
      }

      const newPost = {
        post_id: nanoid(),
        user_id: currentuser.id,
        postText: postText,
        isHidden: false,
        countReact: [],
        Comments: [],
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
    },
    AddReply: (state, action) => {
      const { post_id, comment_id, replyText, replier_img, replier_name, currentuser } = action.payload;
      if (currentuser.email === "") {
        return;
      }

      const pIdx = state.AllUserPost.findIndex((post: Post) => post.post_id === post_id);

      if (pIdx !== -1) {
        const post = state.AllUserPost[pIdx];
        const cIdx = post.Comments.findIndex((comment: Comment) => comment.comment_id === comment_id);

        if (cIdx !== -1) {
          const comment = post.Comments[cIdx];

          const newReply = {
            reply_id: nanoid(),
            replier_id: currentuser.id,
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
        }
      }
    },
    DeletePost: (state, action) => {
      const { post_id, currentuser } = action.payload;

      const pIdx = state.AllUserPost.findIndex((post: Post) => post.post_id === post_id);

      if (pIdx !== -1) {
        const post = state.AllUserPost[pIdx];

        if (post.user_id === currentuser.id) {
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
      const { post_id, currentuser } = action.payload;

      const pIdx = state.AllUserPost.findIndex((post: Post) => post.post_id === post_id);

      if (pIdx !== -1) {
        const post = state.AllUserPost[pIdx];

        if (post.user_id === currentuser.id) {
          const temp = {
            ...post,
            isHidden: !post.isHidden,
          };

          state.AllUserPost = [
            ...state.AllUserPost.slice(0, pIdx),
            temp,
            ...state.AllUserPost.slice(pIdx + 1),
          ];

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
      const { post_id, newText, currentuser } = action.payload;

      const pIdx = state.AllUserPost.findIndex((post: Post) => post.post_id === post_id);

      if (pIdx !== -1) {
        const post = state.AllUserPost[pIdx];

        if (post.user_id === currentuser.id) {
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
  AddReact,
  AddComment,
  AddPost,
  AddReply,
  DeletePost,
  HidePost,
  EditPost,
} = postSlice.actions;
export default postSlice.reducer;