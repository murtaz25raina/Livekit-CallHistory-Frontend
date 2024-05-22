import { FC } from "react";
import InputBox from "./InputBox/InputBox";
import Header from "./Header/Header";
import Messages from "../MessageView/Messages/Messages";
import { TypingIndicatorProvider } from "../../providers/TypingIndicatorProvider";
import { useModel } from "providers/useModalProvider";
import RoomSettingModel from "components/RoomSettingModal/RoomSettingModal";
import VoiceCallModal from "../Call/VoiceCallModal/VoiceCallModal";
import { useMatrixSync } from "providers/CallProvider";
import VideoCallModal from "components/VideoCall/VideoCall";
import { useSelector } from "react-redux";
import { selectCallState } from "redux/stores/callingDetails/callingDetails";

const RoomView: FC = () => {
  const { roomSettingModalIsOpen } = useModel();
  const { callState } = useMatrixSync();
  // console.log("isCalling: ",isCalling)

  return (
    <TypingIndicatorProvider>
      {callState !== null && <VoiceCallModal />}
      {roomSettingModalIsOpen && <RoomSettingModel />}
      <Header />
      <Messages />
      <InputBox />
    </TypingIndicatorProvider>
  );
};

export default RoomView;
