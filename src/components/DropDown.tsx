import {
  DownOutlined,
  LogoutOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Dropdown, Space } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { stateStruct } from "../interfaces/user_interface";
import { logOutUser } from "../features/login/Userslice";
import Swal from "sweetalert2";

export default function DropDown() {
  const current_user = useSelector((state: stateStruct) => state.currentuser);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  async function handleLogout() {
    Swal.fire({
      title: "Are you sure?",
      text: "you will need to login in again!!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, log out!",
      cancelButtonText: "No, stay logged in",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch("http://localhost:3333/logout", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        dispatch(logOutUser());
        Swal.fire("Logged out!", "You have been logged out.", "success");
        navigate("/");
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "You are still logged in.", "info");
      }
    });
  }
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div className="_nav_profile_dropdown_info p-4">
          <div className="_nav_profile_dropdown_image ">
            <div className="_feed_inner_text_area_box_image">
              {current_user.img ? (
                <img src={current_user.img} alt="Image" className="_txt_img" />
              ) : (
                <UserOutlined />
              )}
            </div>
          </div>
          <div className="_nav_profile_dropdown_info_txt">
            <h4 className="_nav_dropdown_title">
              {/* {current_user.email.slice(0, current_user.email.indexOf("@"))} */}
            </h4>
            <a href="/" className="_nav_drop_profile">
              View Profile
            </a>
          </div>
        </div>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: "Settings",
      icon: <SettingOutlined />,
    },

    {
      key: "3",
      icon: <QuestionCircleOutlined />,
      label: "Help And Support",
    },
    {
      key: "4",
      label:
        current_user.email !== "" ? (
          <Button onClick={handleLogout}>Logout</Button>
        ) : (
          <Link to="/">Login</Link>
        ),
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <>
      <div className="flex flex-row bg-white">
        <div className="py-[10px] border-2 border-blue-600 rounded-full">
          <div className="_feed_inner_text_area_box_image">
            {current_user.img ? (
              <img src={current_user.img} alt="Image" className="_txt_img" />
            ) : (
              <UserOutlined style={{ fontSize: "20px" }} />
            )}
          </div>
        </div>
        <Dropdown
          menu={{ items }}
          className="hover:bg-gray-100 p-3 px-3 rounded-e-3xl bg-white"
        >
          <Link to="/" onClick={(e) => e.preventDefault()}>
            <Space>
              {current_user.email
                ? current_user.email.slice(0, current_user.email.indexOf("@"))
                : "login"}
              <DownOutlined />
            </Space>
          </Link>
        </Dropdown>
      </div>
    </>
  );
}
