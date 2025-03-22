import React from "react";
import ProfileSection from "./ProfileSection";
import SocialLinks from "./SocialLinks";

const ExpandedHeader = ({ 
  textColor, 
  index, 
  animation, 
  openModal, 
  showShareMenu, 
  setShowShareMenu, 
  handleShare, 
  isMobile,
  scrollProgress = 0
}) => {
  return (
    <>
      <ProfileSection 
        textColor={textColor} 
        index={index} 
        animation={animation}
        scrollProgress={scrollProgress} 
      />
      
      <SocialLinks 
        textColor={textColor}
        openModal={openModal}
        showShareMenu={showShareMenu}
        setShowShareMenu={setShowShareMenu}
        handleShare={handleShare}
        isMobile={isMobile}
        scrollProgress={scrollProgress}
      />
    </>
  );
};

export default ExpandedHeader;