import { useState } from "react";
import { CommentWPostId, stateStruct } from "../interfaces/user_interface";
import ReplySection from "./ReplySection";
import AllReply from "./AllReply";
import { Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AddLikeToComment } from "../features/login/Userslice";
import { UseSelector } from "react-redux";

export default function PerComment(props: CommentWPostId) {
  const dispatch = useDispatch();

  const { commentor_img, commentor_name, CommentText, Replies } = props;
  const [reply, setReply] = useState<boolean>(false);
  const current_user = useSelector((state: stateStruct) => state.currentuser);
  const userLikedBefore = props.like_comment_userList.some(
    (user) => user.user_name === current_user.email
  );

  const [like, setlike] = useState<boolean>(userLikedBefore ? true : false);

  function handleReply() {
    setReply(!reply);
  }

  function handleLike() {
    // console.log(props.like_comment_userList);
    setlike(!like);
    dispatch(
      AddLikeToComment({
        liker_id: current_user.email,
        comment_id: props.comment_id,
      })
    );
  }

  return (
    <div className="flex items-start space-x-4 p-4 border-b border-gray-100 bg-gray-100 rounded-2xl">
      <div>
        <img
          src={commentor_img}
          alt={commentor_name}
          className="w-10 h-10 rounded-full object-cover"
        />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center">
          <h4 className="font-semibold text-sm text-gray-900">
            {commentor_name}
          </h4>
        </div>
        <p className="text-gray-700 text-sm">{CommentText}</p>
        <div className="mt-2">
          {reply ? (
            <>
              <AllReply replies={props.Replies} />
              <Button
                onClick={handleReply}
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                Hide Replies
              </Button>
              <ReplySection {...props} />
            </>
          ) : (
            <div className="flex flex-row gap-2">
              <button
                onClick={handleLike}
                className={`text-blue-600 text-sm font-medium hover:underline  ${
                  like ? "font-bold" : "font-normal"
                }    `}
              >
                {props.like_comment_userList.length} {like ? "likes" : "like"}
              </button>
              <button
                onClick={handleReply}
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                Reply
              </button>

              <button
                onClick={handleReply}
                className="text-blue-600 text-sm hover:underline font-bold"
              >
                {Replies.length} Replies
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
