import ModeToggle from "@/components/common/ToggleMode";
import { UserButton } from "@clerk/nextjs";


export default function Home() {
  return <div className="flex justify-between items-center">
    <div>Hello</div>
    <UserButton afterSwitchSessionUrl="/" />
    <ModeToggle />
  </div>;
}
