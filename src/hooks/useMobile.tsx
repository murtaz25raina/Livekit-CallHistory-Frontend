import { useState, Dispatch, SetStateAction, useEffect } from "react";

interface MobileState {
  isMobile: boolean;
}

interface MobileActions {
  setMobileState: Dispatch<SetStateAction<boolean>>;
}

const useMobile = (): MobileState & MobileActions => {
  const [isMobile, setMobileState] = useState(false);

  const checkScreenWidth = () => {
    setMobileState(window.innerWidth <= 768);
  };

  useEffect(() => {
    checkScreenWidth();
    const handleResize = () => {
      checkScreenWidth();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return {
    isMobile,
    setMobileState,
  };
};

export default useMobile;
