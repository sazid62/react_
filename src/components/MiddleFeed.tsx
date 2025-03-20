
import DailyStatus from "./DailyStatus";
import MessengerCircle from "./MessngerCircle";
import PostFromHere from "./PostFromHere";
import { Post, stateStruct } from "../interfaces/user_interface";
import { useSelector } from "react-redux";
import PernewsAndRecentComment from "./PernewsAndRecentComment";

export default function MiddleFeed() {
  const post = useSelector((state: stateStruct) => state.AllUserPost).filter((elem)=>elem.post_id !== '');
  post.reverse();
  const current_user = useSelector((state:stateStruct)=>state.currentuser)
  return (
    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 m-auto">
      <div className="_layout_middle_wrap _layout_middle_padding">
        <div className="_layout_middle_inner">
          <DailyStatus />

          <MessengerCircle />

          <PostFromHere />
          {/* ekta post er jonno ekta  */}
          {post.map((elem:Post, index) => (
            (elem.isHidden === false || elem.user_id === current_user.id) && <PernewsAndRecentComment key={index} {...elem} />
          ))}
        </div>
      </div>
    </div>
  );
}
