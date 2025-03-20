import { useState } from "react";
import { CommentWPostId } from "../interfaces/user_interface";
import ReplySection from "./ReplySection";
import AllReply from "./AllReply";
import { Button } from "antd";

export default function PerComment(props: CommentWPostId) {
  const { commentor_img, commentor_name, CommentText,Replies } = props;
  const [reply, setReply] = useState<boolean>(false);
  // console.log(reply);
  function handleReply() {
    setReply(!reply);
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
