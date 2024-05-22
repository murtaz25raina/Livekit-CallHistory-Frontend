import React, { memo, useState } from 'react';
import { FaUserEdit } from 'react-icons/fa';
import { IoIosNotifications, IoIosSettings } from 'react-icons/io';

const ModalSidebar = ({ whoIsClicked, setWhoIsClicked }: any) => {
  return (
    <div className="space-y-1">
      <div
        className={`flex gap-x-2 py-1 px-3 cursor-pointer rounded-md ${
          whoIsClicked === 'General' && 'bg-[rgb(114,105,239)] text-white'
        } hover:bg-[rgb(114,105,239)] hover:text-white font-[PublicSans]`}
        onClick={() => {
          setWhoIsClicked('General');
        }}
      >
        <IoIosSettings className="w-7 h-7" />
        <span>General</span>
      </div>
      {/* <div
        className={`flex gap-x-2 py-1 px-3 cursor-pointer rounded-md ${
          whoIsClicked === 'Notification' && 'bg-[rgb(114,105,239)] text-white'
        } hover:bg-[rgb(114,105,239)] hover:text-white font-[PublicSans]`}
        onClick={() => {
          setWhoIsClicked('Notification');
        }}
      >
        <IoIosNotifications className="w-7 h-7" />
        <span>Notification</span>
      </div> */}
      <div
        className={`flex gap-x-2 py-1 px-3 cursor-pointer rounded-md ${
          whoIsClicked === 'Notification' && 'bg-[rgb(114,105,239)] text-white'
        } hover:bg-[rgb(114,105,239)] hover:text-white font-[PublicSans]`}
        onClick={() => {
          setWhoIsClicked('User-Edit');
        }}
      >
        <FaUserEdit className="w-7 h-7" />
        <span>Users</span>
      </div>
    </div>
  );
};

export default memo(ModalSidebar);
