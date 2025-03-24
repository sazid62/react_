import { FormEvent } from "react";
import { loginUser } from "../features/login/Userslice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { stateStruct } from "../interfaces/user_interface";

export default function LoginTemp() {
  const dispatch = useDispatch();
  const current_user = useSelector((state: stateStruct) => state.currentuser);
  const navigate = useNavigate();
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    dispatch(
      loginUser({
        email: email,
        password: password,
      })
    );

    //  console.log(current_user)
  }
  if (current_user.email !== "") {
    navigate("/home");
  }
  return (
    <div>
      <section className="_social_login_wrapper _layout_main_wrapper">
        <div className="_shape_one">
          <img
            src="./src/assets/images/shape1.svg"
            alt=""
            className="_shape_img"
          />
          <img
            src="./src/assets/images/dark_shape.svg"
            alt=""
            className="_dark_shape"
          />
        </div>
        <div className="_shape_two">
          <img
            src="./src/assets/images/shape2.svg"
            alt=""
            className="_shape_img"
          />
          <img
            src="./src/assets/images/dark_shape1.svg"
            alt=""
            className="_dark_shape _dark_shape_opacity"
          />
        </div>
        <div className="_shape_three">
          <img
            src="./src/assets/images/shape3.svg"
            alt=""
            className="_shape_img"
          />
          <img
            src="./src/assets/images/dark_shape2.svg"
            alt=""
            className="_dark_shape _dark_shape_opacity"
          />
        </div>
        <div className="_social_login_wrap">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
                <div className="_social_login_left">
                  <div className="_social_login_left_image">
                    <img
                      src="https://i.ibb.co.com/10MBCsz/login.png"
                      alt="Image"
                      className="_left_img"
                    />
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
                <div className="_social_login_content">
                  <div className="_social_login_left_logo _mar_b28">
                    <img src="logo.svg" alt="Image" className="_left_logo" />
                  </div>
                  <p className="_social_login_content_para _mar_b8">
                    Welcome back
                  </p>
                  <h4 className="_social_login_content_title _titl4 _mar_b50">
                    Login to your account
                  </h4>
                  <button
                    type="button"
                    className="_social_login_content_btn _mar_b40"
                  >
                    <img src="google.svg" alt="Image" className="_google_img" />{" "}
                    <span>Or sign-in with google</span>
                  </button>
                  <div className="_social_login_content_bottom_txt _mar_b40">
                    <span>Or</span>
                  </div>
                  <form onSubmit={handleSubmit} className="_social_login_form">
                    <div className="row">
                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <div className="_social_login_form_input _mar_b14">
                          <label className="_social_login_label _mar_b8">
                            Email
                          </label>
                          <input
                            required
                            name="email"
                            type="email"
                            className="form-control _social_login_input"
                          />
                        </div>
                      </div>
                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <div className="_social_login_form_input _mar_b14">
                          <label className="_social_login_label _mar_b8">
                            Password
                          </label>
                          <input
                            required
                            name="password"
                            type="password"
                            className="form-control _social_login_input"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
                        <div className="form-check _social_login_form_check">
                          <input
                            className="form-check-input _social_login_form_check_input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault2"
                            defaultChecked
                          />
                          <label
                            className="form-check-label _social_login_form_check_label"
                            htmlFor="flexRadioDefault2"
                          >
                            Remember me
                          </label>
                        </div>
                      </div>
                      <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
                        <div className="_social_login_form_left">
                          <p className="_social_login_form_left_para">
                            Forgot password?
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
                        <div className="_social_login_form_btn _mar_t40 _mar_b60">
                          <button
                            type="submit"
                            className="_social_login_form_btn_link _btn1"
                          >
                            Login now
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                  <div className="row">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_login_bottom_txt">
                        <p className="_social_login_bottom_txt_para">
                          Don't have an account?{" "}
                          <Link
                            to="/register"
                            onClick={() => {
                              const navigate = useNavigate();
                              navigate("/regiser");
                            }}
                          >
                            Create New Account
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <script src="./src/assets/js/bootstrap.bundle.min.js"></script>
    </div>
  );
}
