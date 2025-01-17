"use client";
import { Plus } from "lucide-react";
import ActionTooltip from "@/components/ActionTooltip";
import { useModalStore } from "@/hooks/useModalStore";
const NavigationAction = () => {
  const { onOpen} = useModalStore();
  return (
    <div>
      <ActionTooltip label="Add a Server" side="right" align="center">
        <button onClick={()=>onOpen("createServer")} className="group flex items-center">
          <div
            className="mx-3 h-[48px] w-[48px] flex rounded-[24px] 
          group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center
          bg-background dark:bg-neutral-700 group-hover:bg-emerald-500
          "
          >
            <Plus
              size={25}
              className="text-emerald-500 transition group-hover:text-white"
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};

export default NavigationAction;
