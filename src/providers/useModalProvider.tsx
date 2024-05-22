import React, {
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

interface ClientContextType {
  isRoomCreateModelOpen: boolean;
  roomSettingModalIsOpen: boolean;
  setIsRoomCreateModelOpen: React.Dispatch<SetStateAction<boolean>>;
  setRoomSettingModalIsOpen: React.Dispatch<SetStateAction<boolean>>;
}

const ModelContext = createContext<ClientContextType | null>(null);

export const UseModelProvider = ({ children }: { children: ReactNode }) => {
  const [isRoomCreateModelOpen, setIsRoomCreateModelOpen] = useState(false);
  const [roomSettingModalIsOpen, setRoomSettingModalIsOpen] = useState(false);

  return (
    <ModelContext.Provider
      value={{
        isRoomCreateModelOpen,
        roomSettingModalIsOpen,
        setIsRoomCreateModelOpen,
        setRoomSettingModalIsOpen,
      }}
    >
      {children}
    </ModelContext.Provider>
  );
};

export function useModel() {
  const context = useContext(ModelContext);
  if (!context) {
    throw new Error("useClient must be used within a ClientProvider");
  }
  return context;
}
