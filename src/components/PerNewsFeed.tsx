import { useEffect, useRef, useState } from "react";
import { Post, stateStruct } from "../interfaces/user_interface";
import { useDispatch, useSelector } from "react-redux";
import {
  AddReact,
  DeletePost,
  EditPost,
  HidePost,
} from "../features/login/Userslice";
import {
  ArrowRightOutlined,
  LikeFilled,
  LikeOutlined,
} from "@ant-design/icons";
import CommentSection from "./CommentSection";
import RecentComment from "./RecentComment";
import Swal from "sweetalert2";

interface PostExtends extends Post {
  show: boolean;
  handleShowCmnt: () => void;
}

export default function PerNewsFeed(props: PostExtends) {
  const [isDropShow, setIsDropShow] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const handleButtonClick = () => {
    setIsDropShow((prev) => !prev);
  };
  //Node is an interface from which a number of DOM API object types inherit.
  // It allows those types to be treated similarly; for example,
  // inheriting the same set of methods, or being tested in the same way.
  const handleMouseDown = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setIsDropShow(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  useEffect(() => {
    const notifyDropdown = document.querySelector<HTMLDivElement>(
      "#_notify_drop" + props.post_id
    );
    if (notifyDropdown) {
      if (isDropShow) {
        notifyDropdown.classList.add("show");
        //  console.log("shown");
      } else {
        notifyDropdown.classList.remove("show");
        console.log("hidden");
      }
    }
  }, [isDropShow, props]);

  const post_user = useSelector((state: stateStruct) => state.user_info).find(
    (elem) => elem.id === props.user_id
  );
  // console.log(props)
  const dispatch = useDispatch();
  const postInfo = useSelector((state: stateStruct) => state.AllUserPost).find(
    (elem) => elem.post_id === props.post_id
  );
  const allUser = useSelector((state: stateStruct) => state.user_info);
  const current_user = useSelector((state: stateStruct) => state.currentuser);
  // console.log(postInfo)
  const check_user = postInfo?.countReact.findIndex(
    (elem) => elem.reactor_id === current_user.id
  );

  function reactHandler() {
    dispatch(AddReact({ post_id: props.post_id }));
    //  alert('reacted');
  }
  function Handlehide() {
    dispatch(
      HidePost({
        post_id: props.post_id,
      })
    );
    console.log("we are in webpage  " + props.post_id);
  }
  function handleDelete() {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this post?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          DeletePost({
            post_id: props.post_id,
          })
        );
      }
    });
  }

  const [EditAble, setEditAble] = useState<boolean>(false);
  const [newText, setNewtext] = useState<string>("");
  // console.log(EditAble);

  function handleEdit() {
    // alert(props.post_id)
    setNewtext(props.postText);
    setEditAble(!EditAble);
  }

  function handleEditSubmit() {
    dispatch(
      EditPost({
        post_id: props.post_id,
        newText: newText,
      })
    );
    setEditAble(!EditAble);
  }

  const handleShowAllUserWhoLike = () => {
    const allReactorID = postInfo?.countReact.map(
      (eachReactor) => eachReactor.reactor_id
    );

    console.log(allReactorID);
    console.log(allUser);
    const allReactorUsername = allUser
      .filter((user) => allReactorID?.includes(user.id))
      .map((user) => user.email);
    const userListHtml =
      allReactorUsername.length > 0
        ? `<ul style="text-align: left; padding-left: 20px;">
            ${allReactorUsername.map((name) => `<li>~ ${name}</li>`).join("")}
           </ul>`
        : "<p style='color: gray;'>No users have liked this yet.</p>";
    // console.log(allReactorUsername);
    Swal.fire({
      title: "Users Who Liked",
      html: userListHtml,

      showCancelButton: false,
      confirmButtonText: "Close",
    });
  };

  return (
    <body>
      <div>
        <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
          <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
            <div className="_feed_inner_timeline_post_top">
              <div className="_feed_inner_timeline_post_box">
                <div className="_feed_inner_timeline_post_box_image">
                  <img src={post_user?.img} alt="" className="_post_img" />
                </div>
                <div className="_feed_inner_timeline_post_box_txt">
                  <h4 className="_feed_inner_timeline_post_box_title">
                    {post_user?.email.slice(0, post_user?.email.indexOf("@"))}
                  </h4>
                  <p className="_feed_inner_timeline_post_box_para flex flex-row">
                    {Math.floor((Date.now() - props.post_time) / 1000 / 60) >= 1
                      ? `${Math.floor(
                          (Date.now() - props.post_time) / 1000 / 60
                        )} minute ago`
                      : "few second ago"}
                    <p className="text-blue-600 font-bold">
                      {props.isHidden ? "Private" : "Public"}
                    </p>
                  </p>
                </div>
              </div>
              <div className="_feed_inner_timeline_post_box_dropdown">
                <div className="_feed_timeline_post_dropdown">
                  <button
                    id={`_notify_btn${props.post_id}`}
                    className="_feed_timeline_post_dropdown_link"
                    ref={buttonRef}
                    onClick={handleButtonClick}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="4"
                      height="17"
                      fill="none"
                      viewBox="0 0 4 17"
                    >
                      <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
                      <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
                      <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
                    </svg>
                  </button>
                </div>
                {/* drop down soro */}
                {/* <button >Tggle Dropdown</button> */}
                <div
                  ref={dropdownRef}
                  id="_notify_drop"
                  className={`_feed_timeline_dropdown _timeline_dropdown ${
                    isDropShow ? "show" : ""
                  }`}
                >
                  <ul className="_feed_timeline_dropdown_list">
                    <li className="_feed_timeline_dropdown_item">
                      <a href="#0" className="_feed_timeline_dropdown_link">
                        <span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            fill="none"
                            viewBox="0 0 18 18"
                          >
                            <path
                              stroke="#1890FF"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="1.2"
                              d="M14.25 15.75L9 12l-5.25 3.75v-12a1.5 1.5 0 011.5-1.5h7.5a1.5 1.5 0 011.5 1.5v12z"
                            />
                          </svg>
                        </span>
                        Save Post
                      </a>
                    </li>
                    <li className="_feed_timeline_dropdown_item">
                      <a href="#0" className="_feed_timeline_dropdown_link">
                        <span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="22"
                            fill="none"
                            viewBox="0 0 20 22"
                          >
                            <path
                              fill="#377DFF"
                              fill-rule="evenodd"
                              d="M7.547 19.55c.533.59 1.218.915 1.93.915.714 0 1.403-.324 1.938-.916a.777.777 0 011.09-.056c.318.284.344.77.058 1.084-.832.917-1.927 1.423-3.086 1.423h-.002c-1.155-.001-2.248-.506-3.077-1.424a.762.762 0 01.057-1.083.774.774 0 011.092.057zM9.527 0c4.58 0 7.657 3.543 7.657 6.85 0 1.702.436 2.424.899 3.19.457.754.976 1.612.976 3.233-.36 4.14-4.713 4.478-9.531 4.478-4.818 0-9.172-.337-9.528-4.413-.003-1.686.515-2.544.973-3.299l.161-.27c.398-.679.737-1.417.737-2.918C1.871 3.543 4.948 0 9.528 0zm0 1.535c-3.6 0-6.11 2.802-6.11 5.316 0 2.127-.595 3.11-1.12 3.978-.422.697-.755 1.247-.755 2.444.173 1.93 1.455 2.944 7.986 2.944 6.494 0 7.817-1.06 7.988-3.01-.003-1.13-.336-1.681-.757-2.378-.526-.868-1.12-1.851-1.12-3.978 0-2.514-2.51-5.316-6.111-5.316z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </span>
                        Turn On Notification
                      </a>
                    </li>
                    {current_user.id === post_user?.id ? (
                      <div>
                        <li className="_feed_timeline_dropdown_item">
                          <button
                            onClick={Handlehide}
                            className="_feed_timeline_dropdown_link"
                          >
                            <span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                fill="none"
                                viewBox="0 0 18 18"
                              >
                                <path
                                  stroke="#1890FF"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="1.2"
                                  d="M14.25 2.25H3.75a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V3.75a1.5 1.5 0 00-1.5-1.5zM6.75 6.75l4.5 4.5M11.25 6.75l-4.5 4.5"
                                />
                              </svg>
                            </span>
                            {props.isHidden ? "unhide" : "hide"}
                          </button>
                        </li>
                        <li className="_feed_timeline_dropdown_item">
                          <button
                            onClick={handleEdit}
                            className="_feed_timeline_dropdown_link"
                          >
                            <span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                fill="none"
                                viewBox="0 0 18 18"
                              >
                                <path
                                  stroke="#1890FF"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="1.2"
                                  d="M8.25 3H3a1.5 1.5 0 00-1.5 1.5V15A1.5 1.5 0 003 16.5h10.5A1.5 1.5 0 0015 15V9.75"
                                />
                                <path
                                  stroke="#1890FF"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="1.2"
                                  d="M13.875 1.875a1.591 1.591 0 112.25 2.25L9 11.25 6 12l.75-3 7.125-7.125z"
                                />
                              </svg>
                            </span>
                            Edit Post
                          </button>
                        </li>
                        <li className="_feed_timeline_dropdown_item">
                          <a
                            onClick={handleDelete}
                            href="#0"
                            className="_feed_timeline_dropdown_link"
                          >
                            <span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                fill="none"
                                viewBox="0 0 18 18"
                              >
                                <path
                                  stroke="#1890FF"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="1.2"
                                  d="M2.25 4.5h13.5M6 4.5V3a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0112 3v1.5m2.25 0V15a1.5 1.5 0 01-1.5 1.5h-7.5a1.5 1.5 0 01-1.5-1.5V4.5h10.5zM7.5 8.25v4.5M10.5 8.25v4.5"
                                />
                              </svg>
                            </span>
                            Delete Post
                          </a>
                        </li>
                      </div>
                    ) : (
                      <></>
                    )}
                  </ul>
                </div>
                {/* drop down ses*/}
              </div>
            </div>

            {EditAble ? (
              <div className="bg-gray-100 p-1 my-2 rounded-lg flex flex-col items-start gap-1">
                <textarea
                  value={newText}
                  onChange={(e) => setNewtext(e.target.value)}
                  className="_feed_inner_timeline_post_input h-16 w-[100%] rounded-lg p-2"
                />
                <button
                  onClick={handleEditSubmit}
                  className="_feed_inner_timeline_post_submit"
                >
                  <div className="text-blue-600 font-bold bg-gray-200 p-2 rounded-2xl hover:bg-gray-300">
                    Done
                    <ArrowRightOutlined />
                  </div>
                </button>
              </div>
            ) : (
              <h4 className="_feed_inner_timeline_post_title">
                {props.postText}
              </h4>
            )}

            <div className="_feed_inner_timeline_image">
              <img src="timeline_img.png" alt="" className="_time_img" />
            </div>
          </div>
          <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
            <div className="">
              <button className="mx-1 flex flex-row items-center gap-1">
                <p className="font-bold text-blue-600">
                  {Number(postInfo?.countReact.length)}
                </p>
                <h1 onClick={handleShowAllUserWhoLike}> Likes</h1>
              </button>
            </div>
            <div className="_feed_inner_timeline_total_reacts_txt">
              <p className="_feed_inner_timeline_total_reacts_para1">
                <a onClick={props.handleShowCmnt} href="#0">
                  <span>{postInfo?.Comments.length}</span> Comment
                </a>
              </p>
              <p className="_feed_inner_timeline_total_reacts_para2">
                <span>0</span> Share
              </p>
            </div>
          </div>
          <div className="_feed_inner_timeline_reaction">
            {check_user === -1 ? (
              <button
                onClick={reactHandler}
                className="_feed_inner_timeline_reaction_emoji _feed_reaction flex flex-col"
              >
                <span className="_feed_inner_timeline_reaction_link">
                  {" "}
                  <span>
                    <LikeOutlined style={{ fontSize: "20px" }} />
                  </span>
                </span>
                Like
              </button>
            ) : (
              <button
                onClick={reactHandler}
                className="bg-white _feed_inner_timeline_reaction_emoji _feed_reaction  _feed_reaction_active flex flex-col"
              >
                <span className="_feed_inner_timeline_reaction_link">
                  {" "}
                  <span>
                    <LikeFilled style={{ color: "blue", fontSize: "20px" }} />
                  </span>
                </span>
                Like
              </button>
            )}

            <button
              onClick={props.handleShowCmnt}
              className="_feed_inner_timeline_reaction_comment _feed_reaction"
            >
              <span className="_feed_inner_timeline_reaction_link">
                {" "}
                <span>
                  <svg
                    className="_reaction_svg"
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="21"
                    fill="none"
                    viewBox="0 0 21 21"
                  >
                    <path
                      stroke="#000"
                      d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z"
                    />
                    <path
                      stroke="#000"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6.938 9.313h7.125M10.5 14.063h3.563"
                    />
                  </svg>
                  Comment
                </span>
              </span>
            </button>
            <button className="_feed_inner_timeline_reaction_share _feed_reaction">
              <span className="_feed_inner_timeline_reaction_link">
                {" "}
                <span>
                  <svg
                    className="_reaction_svg"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="21"
                    fill="none"
                    viewBox="0 0 24 21"
                  >
                    <path
                      stroke="#000"
                      stroke-linejoin="round"
                      d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z"
                    />
                  </svg>
                  Share
                </span>
              </span>
            </button>
          </div>
          <CommentSection {...props} />
          <RecentComment {...props} />
        </div>
      </div>
    </body>
  );
}
