import NavigationSideBar from "@/components/navigation/NavigationSideBar";

const ServerLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="h-full md:flex w-[72px] z-30 fixed inset-y-0 flex-col max-md:hidden">
        <NavigationSideBar />
      </div>
      <main className="h-full md:pl-[72px]">{children}</main>
    </div>
  );
};

export default ServerLayout;
