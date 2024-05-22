import environment from "environments/environments";
import { useClientContext } from "providers/ClientProvider";

const RoomProfile = ({ roomId, className }: any) => {
  const { client } = useClientContext();
  const getRoom = client?.getRoom(roomId);
  const roomName = getRoom?.normalizedName;
  const str = roomName;
  const firstLetter = str?.charAt(0).toUpperCase();

  // Get Room Avatar
  const getAvatar = getRoom?.getAvatarUrl(environment.baseURL, 30, 30, "crop");
  return (
    <>
      {getAvatar ? (
        <div className={`flex justify-center items-center ${className}`}>
          <img
            src={getAvatar}
            alt="avator"
            className="object-contain w-full h-full rounded-full"
          />
        </div>
      ) : (
        <div
          className={`${className} rounded-full bg-[#e3e1fc] flex justify-center items-center`}
        >
          <span className="font-bold text-base">{firstLetter}</span>
        </div>
      )}
    </>
  );
};

export default RoomProfile;

{
  /* <span className="text-[rgb(114,105,239)] text-base font-bold font-[PublicSans]"> */
}
