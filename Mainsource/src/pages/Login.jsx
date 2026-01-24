import login_image from "../assets/login_image.svg";
import login_img_pss from "../assets/login_img_pss.png";
import { SlLock } from "react-icons/sl";
import { useNavigate } from "react-router-dom";
import medics_logo from "../assets/medics_logo.svg";
import Footer from "../components/Footer";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { LuUser } from "react-icons/lu";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../Config";
import axiosInstance from "../axiosConfig.js";
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
  let navigate = useNavigate();

  // function onCLickLogin() {
  //   navigate("/dashboard");

  //   window.scrollTo({
  //     top: 0,
  //     behavior: "instant",
  //   });
  // }

  const [error, setError] = useState({});
  let [requiredError, setRequiredError] = useState("");
  let [adminError, setAdminError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [captchaValue, setCaptchaValue] = useState(null);

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
    console.log("Captcha value:", value);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // function onCLickLogin() {
  // const onCLickLogin = async (e) => {
  //   setError("");
  //   e.preventDefault();
  //   try {
  //     // Make API request to login
  //     const response = await axios.post(`${API_URL}/api/auth/login`, formData);
  //     console.log(response);
  //     if (response.data && response.data.token) {
  //       const data = response.data;
  //       console.log(data.user);
  //       // Store user data and token
  //       localStorage.setItem("hrmsuser", JSON.stringify(data.user)); // Corrected: JSON.stringify
  //       Cookies.set("token", data.token, { path: "/" }); // Corrected: path adjusted

  //       // Navigate to the dashboard
  //       console.log("login redirect..");

  //       navigate("/dashboard", { replace: true }); // 'replace' avoids adding to history stack
  //       window.location.reload();
  //       console.log("hello");
  //       // Scroll to the top of the page
  //       window.scrollTo({
  //         top: 0,
  //         behavior: "instant",
  //       });
  //     }else if (response.data && response.data.message) {

  //     }

  //     else {
  //       setError({ general: "Login failed, token not found." });
  //     }
  //   } catch (err) {
  //     console.log(err.response.data);
  //     if (err.response) {
  //       setError(err.response.data);
  //     } else {
  //       setError({ general: "An unexpected error occurred." });
  //     }
  //   }
  // };
  const onCLickLogin = async (e) => {
    e.preventDefault();

    //     if (!captchaValue) {
    //   setRequiredError("Please verify that you are not a robot");
    //   return;
    // }
    setRequiredError("");
    setError("");

    try {
      console.log("API_URL", API_URL);
      console.log("formData", formData);

      const response = await axios.post(`${API_URL}api/login`, formData);

      // const response = await axiosInstance.get(`${API_URL}api/student/list`);
      console.log("response.......", response);

      if (response.data && response.data) {
        const data = response.data;

        // Store user data and token

        localStorage.setItem("pss_dateformat", JSON.stringify(data));

        localStorage.setItem("pssuser", JSON.stringify(data.user));
        // Cookies.set("token", data.token, { path: "/" });
        // localStorage.setItem("admin_token", data.token);
        // localStorage.setItem("loginTime", Date.now());
        //  Redirect based on backend response
        navigate(data.redirect || "/job-form", { replace: true });

        // Optional refresh
        window.scrollTo({ top: 0, behavior: "instant" });
        window.location.reload();
      } else {
        console.log("error", response);
        setError({ general: "Login failed, token not found." });
      }
    } catch (err) {
      console.log(err.response?.data || err);
      setError(
        err.response?.data || { general: "An unexpected error occurred." },
      );
    }
  };

  // settings api

  const [faviconPreview, setFaviconPreview] = useState("");
  const [logoPreview, setLogoPreview] = useState("");

  console.log("logoPreview", logoPreview);

  const fetchSettings = async () => {
    try {
      const res = await axiosInstance.get(`${API_URL}api/settings`);

      console.log("Fetch Settings Response:", res);
      if (res.data?.data) {
        const data = res.data.data;

        setFaviconPreview(data.fav_icon ? `${API_URL}${data.fav_icon}` : "");
        setLogoPreview(data.site_logo ? `${API_URL}${data.site_logo}` : "");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleKeyUp = (event) => {
    setError("");
  };

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle password visibility state
  };
  const activeClass = "underline font-bold text-blue-600";
  const inactiveClass = "hover:underline";
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <div className="flex  items-center justify-center pt-3">
          {/* <img
            src="/pssAgenciesLogo.svg"
            alt="PSS Logo"
            className="w-40 md:w-72 h-auto mx-auto mb-2 md:mt-7"
          /> */}

          <img
            src={logoPreview ? logoPreview : "/pssAgenciesLogo.svg"}
            alt="PSS Logo"
            className="w-40 md:w-40 h-auto mx-auto mb-2 md:mt-7"
          />
          {/* <h1 className="font-bold text-2xl md:text-4xl text-blue-500">PSS</h1> */}
        </div>

        <div className="flex items-center flex-wrap-reverse justify-center mt-20 md:mt-5 ">
          <div className="lg:basis-[50%] flex flex-col items-center justify-center gap-3">
            <p className="text-black font-semibold text-xl md:text-2xl">
              ADMIN LOGIN
            </p>

            <div className="w-full max-w-sm flex items-center gap-3 bg-[#F8F9FB] px-5 py-4 rounded-xl shadow-sm border border-gray-200">
              <LuUser className="text-2xl text-gray-500" />
              <input
                type="text"
                placeholder="Username"
                name="email"
                id="email"
                onChange={handleInputChange}
                className="bg-transparent w-full outline-none text-black placeholder-gray-500"
                onKeyUp={handleKeyUp}
              />
            </div>
            {error?.email && (
              <p className="text-red-500 text-sm mt-1">{error.email}</p>
            )}

            {/* Password Field */}
            <div className="relative w-full max-w-sm flex items-center gap-3 bg-[#F8F9FB] px-5 py-4 mt-4 rounded-xl shadow-sm border border-gray-200">
              <SlLock className="text-2xl text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                id="password"
                onChange={handleInputChange}
                className="bg-transparent w-full outline-none text-black placeholder-gray-500"
                onKeyUp={handleKeyUp}
              />
              <span
                onClick={togglePasswordVisibility}
                className="absolute right-4 cursor-pointer text-gray-600"
              >
                {showPassword ? (
                  <FaEye className="text-xl" />
                ) : (
                  <FaEyeSlash className="text-xl" />
                )}
              </span>
            </div>

            {error && (
              <p className="text-red-500 text-sm mt-1">{error.message}</p>
            )}

            {/* <div className="recaptacha-login ">
              <ReCAPTCHA
                // sitekey="6Lf_dIMrAAAAAAAZI8KS0KRRyRk7NzMNRyXdgtfv" //live site keydcsddsdsddsdsd


                sitekey="6LcendQqAAAAAEjG8NDVrTcYBiFZG1M24ILVt9cn" //local site key

                onChange={handleCaptchaChange}
              />
            </div>
            {requiredError && (
              <p className="text-red-500 text-sm text-start">
                {requiredError}
              </p>
            )} */}

            <button
              onClick={onCLickLogin}
              // disabled={!captchaValue}
              className="font-bold mt-3 text-sm bg-gradient-to-r from-[#91ee7c] to-[#1ea600] px-10 py-5 rounded-2xl text-white hover:scale-105 duration-300 transition-all"
              // className={`${
              //     captchaValue
              //       ? "bg-gradient-to-r from-[#91ee7c] to-[#1ea600] text-white"
              //       : "bg-gray-300 text-gray-700"
              //   } font-semibold mt-3 text-sm  px-8 py-3 rounded-full  hover:scale-105 duration-300 `}
            >
              Login Now
            </button>
          </div>

          <div className="basis-[50%]  ">
            {/* <img src={login_image} alt="" /> */}
            <img src={login_img_pss} alt="" className="h-[500px] " />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
