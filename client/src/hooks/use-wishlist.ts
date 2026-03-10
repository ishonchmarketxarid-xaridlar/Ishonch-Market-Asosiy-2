import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useWishlist() {
  return useQuery({
    queryKey: ['/api/wishlist'],
    queryFn: async () => {
      const res = await fetch('/api/wishlist', { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch wishlist");
      return res.json();
    },
  });
}

export function useToggleWishlist() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (productId: number) => {
      const res = await fetch(`/api/wishlist/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to toggle wishlist");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/wishlist'] });
      toast({ 
        title: data.action === 'added' ? "Sevimlilarga qo'shildi" : "Sevimlilardan o'chirildi",
        duration: 2000
      });
    },
  });
}
