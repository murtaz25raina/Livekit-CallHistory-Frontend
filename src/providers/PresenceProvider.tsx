import { createContext, useContext, FC, useEffect, ReactNode } from "react";
import { ClientEvent, MatrixEvent } from "matrix-js-sdk";
import { useClientContext } from "./ClientProvider";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux/app/store";
import {
  selectPresenceState,
  setPresence,
} from "../redux/stores/presence/presenceSlice";

interface PresenceContextProps {
  presence: string[];
}

interface ChildrenProp {
  children: ReactNode;
}

const PresenceContext = createContext<PresenceContextProps | undefined>(
  undefined
);

const PresenceProvider: FC<ChildrenProp> = ({ children }) => {
  const { client } = useClientContext();
  const dispatch = useDispatch<AppDispatch>();
  const { presence } = useSelector(selectPresenceState);

  useEffect(() => {
    if (!client) return;
    const handlePresenceChange = (event: MatrixEvent | undefined) => {
      if (!event || event.getType() !== "m.presence") return;

      const presenceValue = event.getContent().presence;
      const userId = event.getSender() as string;

      dispatch(setPresence({ userId, presenceValue }));
    };

    client.on(ClientEvent.Event, handlePresenceChange);

    return () => {
      client.off(ClientEvent.Event, handlePresenceChange);
    };
  }, [client, dispatch]);

  return (
    <PresenceContext.Provider value={{ presence }}>
      {children}
    </PresenceContext.Provider>
  );
};

const usePresenceContext = (): PresenceContextProps => {
  const context = useContext(PresenceContext);
  if (!context) {
    throw new Error(
      "usePresenceContext must be used within a PresenceProvider"
    );
  }
  return context;
};

export { PresenceProvider, usePresenceContext };
