import React, { useState, useEffect } from "react";

export default function UserProfile({ user }) {
  const [profileUrl, setProfileUrl] = useState<string>(user.photoURL);

  const handleProfilePhotoError = () => {
    setProfileUrl("/images/defaultprofileimage.jpg");
  };
  
  return (
    <div className="mt-5 bg-[#28272A] w-11/12 h-52 rounded-lg self-center px-2 gap-3">
      <img
        className="w-24 md:w-32 h-32 rounded-full self-center mx-auto mt-[-24px] border-[#18181A] border-8"
        src={profileUrl}
        onError={handleProfilePhotoError}
      />

      <div className="flex flex-col text-center">
        <h1 className="text-white text-4xl">{user.displayName}</h1>

        <p className="text-neutral-400  hover:underline underline-offset-2">
          <i>@{user.username}</i>
        </p>
      </div>
    </div>
  );
}
