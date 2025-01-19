"use client";

import { useEffect, useState } from "react";
import CreateServerModal from "../modals/CreateServerModal";
import InviteServerModal from "../modals/InviteServerModal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);


  // doing this to prevent the model rendering on server-side
  // to eliminate hydration errors 
  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <CreateServerModal />
      <InviteServerModal />
    </div>
  );
};
