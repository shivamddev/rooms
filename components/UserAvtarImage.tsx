import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvtarImageProps {
  src? : string;
  className?: string;
}

const UserAvtarImage = ({ src, className }: UserAvtarImageProps) => {
  return <Avatar className={cn("size-7 md:size-10", className)}>
    <AvatarImage src={src}  />
  </Avatar>;
};

export default UserAvtarImage;
