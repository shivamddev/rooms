import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import NavigationSideBar from "./navigation/NavigationSideBar";
import ServerSidebar from "./server/ServerSidebar";
const MobileToggle = ({ serverId }: { serverId: string }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="md:hidden" variant={"ghost"} size={"icon"}>
          <Menu className="" />
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"} className="p-0 gap-0 flex">
        <div className="w-[72px]">
          <NavigationSideBar />
        </div>
        <ServerSidebar serverId={serverId}/>
      </SheetContent>
    </Sheet>
  );
};

export default MobileToggle;
