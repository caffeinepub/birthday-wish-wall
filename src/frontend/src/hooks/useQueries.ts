import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

export interface Wish {
  username: string;
  message: string;
  timestamp: bigint;
}

export function useGetAllWishes() {
  const { actor, isFetching } = useActor();
  return useQuery<Wish[]>({
    queryKey: ["wishes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllWishes();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10000,
  });
}

export function useSubmitWish() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      username,
      message,
    }: { username: string; message: string }) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.submitWish({ username, message });
      if (result.__kind__ === "error") throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishes"] });
    },
  });
}
