import { useSelector } from "react-redux";
import { Post, stateStruct } from "../interfaces/user_interface";

import AllCommentShow from "./AllCommentShow";

import PerComment from "./PerComment";

interface PostExtends extends Post {
  show: boolean;
  handleShowCmnt: () => void;
}

export default function RecentComment(props: PostExtends) {
  console.log(props);
  const postInfo = useSelector((state: stateStruct) => state.AllUserPost).find(
    (elem) => elem.post_id === props.post_id
  );

  // console.log(postInfo)
  // console.log(props.show);

  return (
    <div>
      <div className="_timline_comment_main">
        <div className="_previous_comment">
          {props.show ? (
            <div>
              <button
                onClick={props.handleShowCmnt}
                type="button"
                className="_previous_comment_txt"
              >
                Hide all {postInfo?.Comments.length} comments
              </button>
              <AllCommentShow key={"idxComment"} {...props} />
            </div>
          ) : (
            <button
              onClick={props.handleShowCmnt}
              type="button"
              className="_previous_comment_txt"
            >
              {postInfo?.Comments.length === 0 ? (
                <p>No comments yet</p>
              ) : postInfo?.Comments.length > 3 ? (
                <p>View {postInfo.Comments.length - 3} previous comments</p>
              ) : (
                <p>Recent comments</p>
              )}
            </button>
          )}
        </div>
        {(postInfo?.Comments?.length ?? 0) > 0 && !props.show ? (
          postInfo?.Comments.map((val, indx) => {
            if (indx <= 2) {
              return (
                <div className="p-1">
                  <PerComment
                    comment_id={postInfo?.Comments[indx].comment_id || ""}
                    CommentText={postInfo?.Comments[indx].CommentText || ""}
                    commentor_name={
                      postInfo?.Comments[indx].commentor_name || ""
                    }
                    commentor_img={postInfo?.Comments[indx].commentor_img || ""}
                    Replies={postInfo?.Comments[indx].Replies || []}
                    post_id={props.post_id}
                    commentor_id={postInfo?.Comments[indx].commentor_id || ""}
                    like_comment_userList={
                      postInfo?.Comments[indx].like_comment_userList || []
                    }
                  />
                </div>
              );
            }
          })
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
