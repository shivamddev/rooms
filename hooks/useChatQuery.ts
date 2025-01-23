// import qs from "query-string";

// import { useInfiniteQuery } from "@tanstack/react-query";
// import { useSocket } from "@/components/providers/socket-provider";

// interface ChatQueryProps {
//   queryKey: string;
//   apiUrl: string;
//   paramKey: "channelId" | "conversationId";
//   paramValue: string;
// }

// export const useChatQuery = ({
//   queryKey,
//   apiUrl,
//   paramKey,
//   paramValue,
// }: ChatQueryProps) => {
//   const { isConnected } = useSocket();
 

//   const fetchMessages = async ({ pageParam = undefined }) => {
//     const url = qs.stringifyUrl(
//       {
//         url: apiUrl,
//         query: {
//           cursor: pageParam,
//           [paramKey]: paramValue,
//         },
//       },
//       { skipNull: true }
//     );
//     const res = await fetch(url);
//     console.log(`res==`, res);
//     return res.json();
//   };

//   const { data, status, fetchNextPage, hasNextPage, isFetchingNextPage } =
//     useInfiniteQuery({
//       queryKey: [queryKey],
//       queryFn: fetchMessages,
//       getNextPageParam: (lastPage) => lastPage?.nextCursor,
//       refetchInterval: isConnected ? false : 1000,
//     });

//   return {
//     data,
//     status,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//   };
// };


import qs from "query-string";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSocket } from "@/components/providers/socket-provider";

interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
}

export const useChatQuery = ({
  queryKey,
  apiUrl,
  paramKey,
  paramValue,
}: ChatQueryProps) => {
  const { isConnected } = useSocket();

  const fetchMessages = async ({ pageParam = 0 }) => {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParam.toString(),
          [paramKey]: paramValue,
        },
      },
      { skipNull: true }
    );
    const res = await fetch(url);
    console.log(`res==`, res);
    return res.json();
  };

  const { data, status, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: fetchMessages,
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      refetchInterval: isConnected ? false : 1000,
    });
    
  return {
    data,
    status,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};

