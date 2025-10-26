import React, { useContext } from "react";
import { Button } from "../ui/button";
import { Gem, Crown, ArrowLeft } from "lucide-react";
import { SignInButton, useAuth, UserButton, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserDetailContext } from "../../../context/UserDetailContext";

const Header = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const {userDetail,setUserDetail} = useContext(UserDetailContext);
  console.log("Current location:", location.pathname);
  const auth = useAuth();
  const hasPremiumAccess = auth?.has ? auth.has({plan:'unlimited'}) : false;
  console.log("User has premium access:", hasPremiumAccess);

  // Show back button on specific routes (not on home or dashboard root)
  const showBackButton = location.pathname !== "/" && 
                         location.pathname !== "/dashboard" && 
                         user;

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="flex items-center justify-between px-10 shadow-md h-16">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="text-slate-600 hover:text-primary hover:bg-primary/5 transition-all cursor-pointer group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Button>
          )}
          <img src="/logo.png" alt="Logo" className="w-12 h-12 cursor-pointer" onClick={() => navigate("/")} />
        </div>
        {!user ? (
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/pricing")}
              className="relative text-slate-700 hover:text-primary font-medium px-4 py-2 rounded-lg transition-all duration-200 hover:bg-primary/5 hover:scale-105 border border-transparent hover:border-primary/20 shadow-sm hover:shadow-md cursor-pointer"
            >
              <span className="relative z-10">💎 Pricing</span>
            </Button>
            <SignInButton mode="modal">
              <Button className="cursor-pointer hover:scale-105 transition-transform duration-300">Get Started</Button>
            </SignInButton>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            {!hasPremiumAccess && (
              <Button 
                variant="ghost" 
                onClick={() => navigate("/pricing")}
                className="relative text-slate-700 hover:text-primary font-medium px-4 py-2 rounded-lg transition-all duration-200 hover:bg-primary/5 hover:scale-105 border border-transparent hover:border-primary/20 shadow-sm hover:shadow-md cursor-pointer"
              >
                <span className="relative z-10">💎 Pricing</span>
              </Button>
            )}
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: {
                    width: "35px",
                    height: "35px",
                  },
                },
              }}
            />
            {location.pathname.includes("dashboard") && !hasPremiumAccess ? (
              <div className="flex gap-2 items-center p-2 px-3 bg-orange-100 rounded-full">
                <Gem/> {userDetail?.credits || 0} Credits
              </div>
            ) : location.pathname.includes("dashboard") && hasPremiumAccess ? (
              <div className="flex gap-2 items-center p-2 px-3 bg-linear-to-r from-amber-100 to-yellow-100 rounded-full border border-amber-300">
                <Crown className="w-4 h-4 text-amber-600"/> <span className="font-semibold text-amber-700">Premium</span>
              </div>
            ) : !location.pathname.includes("dashboard") ? (
              <Button onClick={() => navigate("/dashboard")} className="cursor-pointer hover:scale-105 transition-transform duration-300">
                Go to dashboard
              </Button>
            ) : null}
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
