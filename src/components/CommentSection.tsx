import { KeyboardEvent, useState } from "react";
import { allPost, stateStruct } from "../interfaces/user_interface";
import { useDispatch, useSelector } from "react-redux";
import { AddComment } from "../features/login/Userslice";
import Swal from "sweetalert2";
import conf from "../conf/conf";

type CommentSectionProps = {
  allComment: any[];
  setAllComment: React.Dispatch<React.SetStateAction<any[]>>;
  postData: allPost;
};

export default function CommentSection({
  allComment,
  setAllComment,
  postData,
}: CommentSectionProps) {
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const dispatch = useDispatch();
  const current_user = useSelector((state: stateStruct) => state.currentuser);

  function handleSubmit() {
    if (comment.trim() === "") {
      Swal.fire({
        title: "Empty comment",
        text: "Please write something before posting a comment",
        icon: "warning",
      });
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);

    // Post the comment
    fetch(`${conf.apiUrl}/commentpost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        userId: current_user.id,
        postId: postData.postId,
        commentText: comment,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to post comment");
        }
        return res.json();
      })
      .then(() => {
        // After successful post, fetch updated comments
        return fetch(`${conf.apiUrl}/posts/${postData.postId}/comments`, {
          method: "GET",
          credentials: "include",
        });
      })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch comments");
        }
        return res.json();
      })
      .then((res) => {
        // Update comments list without hiding open replies
        setAllComment(res.data);

        // Clear the comment input
        setComment("");

        // Optional: Dispatch to Redux if needed
        // dispatch(AddComment({ post_id: postData.postId, CommentText: comment }));
      })
      .catch((error) => {
        console.error("Error handling comment:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to post your comment. Please try again.",
          icon: "error",
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  function handleEnterKey(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div>
      <div className="_feed_inner_timeline_cooment_area">
        <div className="_feed_inner_comment_box">
          <form
            className="_feed_inner_comment_box_form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="_feed_inner_comment_box_content">
              <div className="_feed_inner_comment_box_content_image">
                <img
                  src={current_user.img}
                  alt=""
                  className="_comment_img rounded-2xl"
                />
              </div>
              <div className="_feed_inner_comment_box_content_txt">
                <textarea
                  onKeyDown={handleEnterKey}
                  onChange={(e) => setComment(e.target.value)}
                  value={comment}
                  className="form-control _comment_textarea"
                  placeholder="Write a comment"
                  id="floatingTextarea2"
                  disabled={isSubmitting}
                ></textarea>
              </div>
            </div>
            <div className="_feed_inner_comment_box_icon">
              <button
                type="button"
                disabled
                className="_feed_inner_comment_box_icon_btn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill="#000"
                    fillOpacity=".46"
                    fillRule="evenodd"
                    d="M13.167 6.534a.5.5 0 01.5.5c0 3.061-2.35 5.582-5.333 5.837V14.5a.5.5 0 01-1 0v-1.629C4.35 12.616 2 10.096 2 7.034a.5.5 0 011 0c0 2.679 2.168 4.859 4.833 4.859 2.666 0 4.834-2.18 4.834-4.86a.5.5 0 01.5-.5zM7.833.667a3.218 3.218 0 013.208 3.22v3.126c0 1.775-1.439 3.22-3.208 3.22a3.218 3.218 0 01-3.208-3.22V3.887c0-1.776 1.44-3.22 3.208-3.22zm0 1a2.217 2.217 0 00-2.208 2.22v3.126c0 1.223.991 2.22 2.208 2.22a2.217 2.217 0 002.208-2.22V3.887c0-1.224-.99-2.22-2.208-2.22z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button
                type="button"
                disabled
                className="_feed_inner_comment_box_icon_btn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill="#000"
                    fillOpacity=".46"
                    fillRule="evenodd"
                    d="M10.867 1.333c2.257 0 3.774 1.581 3.774 3.933v5.435c0 2.352-1.517 3.932-3.774 3.932H5.101c-2.254 0-3.767-1.58-3.767-3.932V5.266c0-2.352 1.513-3.933 3.767-3.933h5.766zm0 1H5.101c-1.681 0-2.767 1.152-2.767 2.933v5.435c0 1.782 1.086 2.932 2.767 2.932h5.766c1.685 0 2.774-1.15 2.774-2.932V5.266c0-1.781-1.089-2.933-2.774-2.933zm.426 5.733l.017.015.013.013.009.008.037.037c.12.12.453.46 1.443 1.477a.5.5 0 11-.716.697S10.73 8.91 10.633 8.816a.614.614 0 00-.433-.118.622.622 0 00-.421.225c-1.55 1.88-1.568 1.897-1.594 1.922a1.456 1.456 0 01-2.057-.021s-.62-.63-.63-.642c-.155-.143-.43-.134-.594.04l-1.02 1.076a.498.498 0 01-.707.018.499.499 0 01-.018-.706l1.018-1.075c.54-.573 1.45-.6 2.025-.06l.639.647c.178.18.467.184.646.008l1.519-1.843a1.618 1.618 0 011.098-.584c.433-.038.854.088 1.19.363zM5.706 4.42c.921 0 1.67.75 1.67 1.67 0 .92-.75 1.67-1.67 1.67-.92 0-1.67-.75-1.67-1.67 0-.921.75-1.67 1.67-1.67zm0 1a.67.67 0 10.001 1.34.67.67 0 00-.002-1.34z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {comment.trim() !== "" && (
                <button
                  type="submit"
                  className="_feed_inner_comment_box_icon_btn bg-blue-500 text-white rounded px-3 py-1 ml-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Posting..." : "Post"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
