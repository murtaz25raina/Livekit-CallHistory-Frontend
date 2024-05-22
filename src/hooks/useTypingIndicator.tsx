import { MatrixClient } from "matrix-js-sdk";
import { useMemo, useRef } from "react";
import { toast } from "react-toastify";

type TypingIndicatorProps = (typing: boolean) => void;

const TYPING_TIMEOUT_MS = 5000;

export const useTypingIndicator = (
  mx: MatrixClient,
  roomId: string
): TypingIndicatorProps => {
  const statusSentTsRef = useRef<number>(0);

  const sendTypingStatus: TypingIndicatorProps = useMemo(() => {
    statusSentTsRef.current = 0;
    return (typing) => {
      if (typing) {
        mx.sendTyping(roomId, true, TYPING_TIMEOUT_MS)
          .then((response) => {
            console.log(response);
          })
          .catch((errors: any) => {
            console.log("Errors", errors);
            toast.error("You are no longer a member");
            if (errors.errcode === "M_FORBIDDEN") {
              window.alert("No longer a member of this group kindly leave !");
            }
          });
        const sentTs = Date.now();
        statusSentTsRef.current = sentTs;

        setTimeout(() => {
          if (statusSentTsRef.current === sentTs) {
            mx.sendTyping(roomId, false, TYPING_TIMEOUT_MS);
            statusSentTsRef.current = 0;
          }
        }, TYPING_TIMEOUT_MS);
        return;
      } else {
        mx.sendTyping(roomId, false, TYPING_TIMEOUT_MS);
        statusSentTsRef.current = 0;
      }
    };
  }, [mx, roomId]);

  return sendTypingStatus;
};
