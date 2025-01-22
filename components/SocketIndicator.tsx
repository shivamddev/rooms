"use client";
import { useSocket } from "./providers/socket-provider";
import { Badge } from "./ui/badge";
const SocketIndicator = ({}) => {
  const isConnected = useSocket();
//   console.log(`isConnected==`, isConnected);

  if (!isConnected?.isConnected) {
    return (
      <Badge
        variant={"outline"}
        className="bg-yellow-600 text-white border-none"
      >
        Fallback : Polling every 1s
      </Badge>
    );
  }
  return (
    <Badge
      variant={"outline"}
      className="bg-emerald-600 text-white border-none"
    >
      Live : Real Time updates
    </Badge>
  );
};

export default SocketIndicator;
