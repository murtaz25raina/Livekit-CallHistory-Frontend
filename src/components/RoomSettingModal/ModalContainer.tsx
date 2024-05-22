import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { EventType, RoomMember } from "matrix-js-sdk";
import { MdDelete } from "react-icons/md";
import cluster from "cluster";
import { selectCurrentRoomState } from "redux/stores/currentRoom/currentRoomSlice";
import { useSelector } from "react-redux";
import { useClientContext } from "providers/ClientProvider";
import RoomProfile from "components/RoomProfile/roomProfile";

const ModalContainer = (whoIsClicked: any) => {
  const { client } = useClientContext();
  const { currentRoomId } = useSelector(selectCurrentRoomState);
  const [isGeneral, setIsGeneral] = useState(true);
  const getRoom = client?.getRoom(currentRoomId);
  const [members, setMembers] = useState<RoomMember[] | undefined>();
  const [participants, setParticipants] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const defaultValues = {
    roomName: getRoom?.normalizedName,
    roomAvatar: "",
  };

  const methods = useForm({
    defaultValues,
  });

  // Set Room Avator
  const setRoomAvatar = async (roomId: any, avatarFile: any) => {
    const { content_uri: uri }: any = await client?.uploadContent(
      avatarFile[0]
    );
    await client?.sendStateEvent(
      currentRoomId,
      EventType.RoomAvatar,
      { url: uri },
      ""
    );
  };

  const { errors } = methods.formState as { errors: any };

  const resetClickHandler = () => {
    methods.reset({
      roomName: "",
      roomAvatar: "",
    });
  };

  const handlePartcipant = (event: any) => {
    setInputValue(event.target.value);
  };

  const handleAddParticipants = () => {
    setParticipants([...participants, inputValue]);
    setInputValue("");
  };

  useEffect(() => {
    whoIsClicked.whoIsClicked === "General"
      ? setIsGeneral(true)
      : setIsGeneral(false);
    getMember();
    let user = client
      ?.getRoom(currentRoomId)
      ?.getMembers()
      .filter((member) => member.userId === client?.getUserId());
    if (user) {
      console.log(user[0].powerLevel);
      if (user[0].powerLevel === 100) {
        setIsAdmin(true);
      }
    }
  }, [currentRoomId, whoIsClicked]);

  const getMember = () => {
    let members = client?.getRoom(currentRoomId)?.getMembers();
    members = members?.filter((member) => member.membership === "join");
    setMembers(members);
  };

  const deleteUser = (userId: any) => {
    client
      ?.kick(currentRoomId, userId, "Not a member anymore")
      .then(async (response) => {
        console.log(response);
      })
      .catch((errors) => {
        console.log(errors.error);
      });
    console.log(client?.getRoom(currentRoomId)?.getMembers());
  };

  const handleAddUser = () => {
    participants.map((user, index) => {
      client
        ?.invite(currentRoomId, user, "New member")
        .then((response) => {
          console.log(response);
          getMember();
          setInputValue("");
          setParticipants([]);
        })
        .catch((errors) => {
          console.log(errors.error);
          getMember();
          setInputValue("");
          setParticipants([]);
        });
    });
  };

  const submitClickHandler = async (data: any) => {
    try {
      if (!client) {
        throw new Error("Matrix client not initialized");
      }
      if (!data.roomName || !data.roomAvatar) {
        throw new Error("Missing required fields: roomName or roomAvatar");
      }
      await client.setRoomName(currentRoomId, data.roomName);
      console.log("Room name updated successfully!");
      await setRoomAvatar(currentRoomId, data.roomAvatar);
      console.log("Room avatar set successfully!");
    } catch (error) {
      console.error("Error setting room avatar:", error);
    }
  };

  return (
    <div className="w-full">
      {isGeneral && (
        <form
          onSubmit={methods.handleSubmit(submitClickHandler)}
          className="w-full"
        >
          <div className="border p-2 rounded-md w-full space-y-3">
            <div className="space-y-4">
              <div className="flex flex-col gap-y-2">
                <label htmlFor="Room Name" className="font-[PublicSans]">
                  Room Name :
                </label>
                {isAdmin && (
                  <input
                    type="text"
                    title="room name"
                    {...methods.register("roomName", {
                      required: { value: true, message: "Room is required" },
                    })}
                    className="border py-1 px-2 focus:border-indigo-400 outline-none rounded-md text-[#656d77] font-[PublicSans]"
                  />
                )}
                {!isAdmin && (
                  <input
                    type="text"
                    title="room name"
                    value={getRoom?.normalizedName}
                    className="border py-1 px-2 focus:border-indigo-400 outline-none rounded-md text-[#656d77] font-[PublicSans]"
                    readOnly
                  />
                )}
              </div>
              <div className="flex flex-col gap-y-2">
                <label className="">Change Avatar :</label>
                <div className="w-full flex justify-center items-center">
                  <label className="flex flex-col items-center justify-center border-2 border-gray-300 rounded-full cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 font-[PublicSans]">
                    {/* Image */}
                    <RoomProfile roomId={currentRoomId} className="w-24 h-24" />
                    {/* Input button */}
                    <input
                      title="room image"
                      type="file"
                      className="hidden"
                      {...methods.register("roomAvatar")}
                    />
                  </label>
                </div>
              </div>
            </div>
            <div className="w-full flex">
              {isAdmin && (
                <button
                  type="submit"
                  className="py-1 px-12 bg-[#7269ef] text-white hover:bg-[#6056ee] rounded-md font-[PublicSans]"
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </form>
      )}
      {!isGeneral && (
        <div className="border p-2 rounded-md w-full space-y-3">
          <div className="space-y-4">
            <div className="flex flex-row justify-between">
              {members && (
                <div className="col-span-2">
                  <label
                    htmlFor="members"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Room Members
                  </label>
                  <ul className=" w-[254px] text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    {members?.map((member) => (
                      <li
                        key={member.userId}
                        className="my-2 w-full px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600"
                      >
                        <div className="flex items-center gap-4">
                          <svg
                            className="absolute w-6 h-6 text-blue-400 "
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          <div className="font-medium dark:text-white ms-10">
                            <div className="flex flex-row mt-2">
                              <span className=" min-w-[150px]">
                                {member.name.toUpperCase()}{" "}
                              </span>
                              {isAdmin && member.powerLevel !== 100 && (
                                <MdDelete
                                  className="text-red-600 w-6 h-6 mb-2"
                                  onClick={() => deleteUser(member.userId)}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {isAdmin && (
                <div className="">
                  <form>
                    <div className="p-6 space-y-6">
                      <input
                        type="text"
                        placeholder="Enter Participants"
                        className="py-2 indent-3 border outline-none border-[#ddd] focus:border-indigo-400 w-full rounded font-[PublicSans]"
                        value={inputValue}
                        onChange={handlePartcipant}
                      />
                      <button
                        data-modal-hide="default-modal"
                        type="button"
                        className="text-white bg-[#7269ef] transition-all duration-200 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        onClick={() => {
                          handleAddParticipants();
                        }}
                      >
                        Add Participant
                      </button>
                      <ul>
                        {participants.map((value: any, index: number) => (
                          <li key={index}>{value}</li>
                        ))}
                      </ul>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
          <div className="w-full flex justify-between">
            {/* <button
              type="submit"
              className="py-1 px-12 bg-[#7269ef] text-white hover:bg-[#6056ee] rounded-md font-[PublicSans]"
            >
              Save
            </button> */}
            {isAdmin && (
              <button
                type="submit"
                onClick={() => handleAddUser()}
                className="py-1 px-12 bg-[#7269ef] text-white hover:bg-[#6056ee] rounded-md font-[PublicSans]"
              >
                Add user
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalContainer;
