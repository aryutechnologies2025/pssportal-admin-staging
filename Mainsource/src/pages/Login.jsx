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
    <div className="min-h-screen flex flex-col">
  {/* Top Logo */}
  <div className="flex items-center justify-center py-4 md:py-6">
    <img
      src={logoPreview ? logoPreview : "/pssAgenciesLogo.svg"}
      alt="PSS Logo"
      className="w-32 sm:w-36 md:w-40 h-auto"
    />
  </div>

  {/* Middle Content */}
  <div className="flex-1 flex flex-col-reverse md:flex-row items-center justify-center gap-8 px-4 md:px-10">
    {/* Form */}
    <div className="w-full md:w-1/2 flex flex-col items-center justify-center gap-3 md:gap-6">
      <p className="text-black font-semibold text-lg sm:text-xl md:text-2xl">
        ADMIN LOGIN
      </p>

      <div className="w-full max-w-sm flex items-center gap-3 bg-[#F8F9FB] px-4 py-3 rounded-xl shadow-sm border border-gray-200">
        <LuUser className="size-5 text-gray-500" />
        <input
          type="text"
          placeholder="Username"
          name="email"
          onChange={handleInputChange}
          className="bg-transparent w-full outline-none text-sm sm:text-base"
        />
      </div>

      <div className="relative w-full max-w-sm flex items-center gap-3 bg-[#F8F9FB] px-4 py-3 rounded-xl shadow-sm border border-gray-200">
        <SlLock className="size-5 text-gray-500" />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          name="password"
          onChange={handleInputChange}
          className="bg-transparent w-full outline-none text-sm sm:text-base"
        />
        <span
          onClick={togglePasswordVisibility}
          className="absolute right-4 cursor-pointer text-gray-600"
        >
          {showPassword ? <FaEye /> : <FaEyeSlash />}
        </span>
      </div>

      {error?.message && (
        <p className="text-red-500 text-sm text-center">{error.message}</p>
      )}

      <button
        onClick={onCLickLogin}
        className="w-[60%] sm:w-[50%] md:w-[40%] lg:w-[30%] font-bold mt-4 bg-gradient-to-r from-[#91ee7c] to-[#1ea600] px-6 py-3 md:py-4 rounded-xl text-white hover:scale-105 transition"
      >
        Login Now
      </button>
    </div>

    {/* Image */}
    <div className="hidden md:flex w-full md:w-1/2 justify-center">
      <img
        src={login_img_pss}
        alt="login"
        className="w-[80%] max-w-md h-auto"
      />
    </div>
  </div>

  {/* Footer */}
  <Footer />
</div>


  );
};

export default Login;
