import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useWishlist(userId?: number) {
  return useQuery({
    queryKey: ['/api/wishlist', userId],
    queryFn: async () => {
      const url = userId ? `/api/wishlist/${userId}` : '/api/wishlist';
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch wishlist");
      return res.json();
    },
  });
}

export function useToggleWishlist() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ productId, userId, action }: { productId: number; userId?: number; action: 'add' | 'remove' }) => {
      const res = await fetch(`/api/wishlist/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, userId }),
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Failed to ${action} wishlist`);
      return res.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/wishlist'] });
      toast({ 
        title: data.action === 'added' ? "Sevimlilarga qo'shildi" : "Sevimlildan o'chirildi",
        duration: 2000
      });
    },
  });
}
