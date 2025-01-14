"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import ActionTooltip from "../ActionTooltip";
import { useParams, useRouter } from "next/navigation";

interface NavigationItemProps {
  id: string;
  name: string;
  imageUrl: string;
}
const NavigationItem = ({ id, name, imageUrl }: NavigationItemProps) => {
  const router = useRouter();
  const params = useParams();
    console.log(`id =`, id);
  console.log(`params`, params);
  const onClickHandler = () => {
    router.push(`/servers/${id}`);
  };
  return (
    <ActionTooltip label={name} side="right" align="center">
      <button onClick={onClickHandler} className="group relative flex items-center">
        <div
          className={cn(
            "absolute top-4 left-0 bg-primary rounded-r-full transition-all w-[4px]",
            params?.id !== id && "group-hover:h-[20px]",
            params?.id === id ? "h-[36px]" : "h-[8px]"
          )}
        >
          <div
            className={cn(
              " relative group flex mx-3 size-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
              params?.id !== id &&
                "bg-primary/10 text-primary rounded-[16px]"
            )}
          >
            <Image src={imageUrl} alt="server-image" fill priority className="" />
          </div>
        </div>
      </button>
    </ActionTooltip>
  );
};

export default NavigationItem;
