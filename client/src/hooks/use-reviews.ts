import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import type { CreateReviewRequest } from "@shared/schema";

export function useReviews(productId: number) {
  return useQuery({
    queryKey: [api.reviews.list.path, productId],
    queryFn: async () => {
      const url = buildUrl(api.reviews.list.path, { productId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return api.reviews.list.responses[200].parse(await res.json());
    },
    enabled: !!productId,
  });
}

export function useCreateReview(productId: number) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateReviewRequest) => {
      const url = buildUrl(api.reviews.create.path, { productId });
      const res = await fetch(url, {
        method: api.reviews.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create review");
      return api.reviews.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.reviews.list.path, productId] });
      toast({ title: "Sharhingiz qo'shildi!" });
    },
  });
}
