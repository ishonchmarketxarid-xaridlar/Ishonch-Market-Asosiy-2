import { useState } from "react";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/use-products";
import { useOrders, useUpdateOrderStatus, useDeleteOrder } from "@/hooks/use-orders";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Trash2, Edit, Plus, Package, ShoppingCart } from "lucide-react";
import type { Product, Order } from "@shared/schema";

export default function Admin() {
  const { data: products } = useProducts();
  const { data: orders } = useOrders();
  
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  
  const updateOrderStatus = useUpdateOrderStatus();
  const deleteOrder = useDeleteOrder();

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [productForm, setProductForm] = useState({
    titleUz: '', titleRu: '', descriptionUz: '', descriptionRu: '', 
    price: 0, originalPrice: undefined, discountPercent: undefined,
    imageUrl: '', category: '', isPopular: false, isHot: false, isNew: false, isSale: false
  });

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setProductForm({ ...p });
    setIsProductModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setProductForm({ titleUz: '', titleRu: '', descriptionUz: '', descriptionRu: '', price: 0, originalPrice: undefined, discountPercent: undefined, imageUrl: '', category: '', isPopular: false, isHot: false, isNew: false, isSale: false });
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct.mutate({ id: editingProduct.id, ...productForm }, {
        onSuccess: () => setIsProductModalOpen(false)
      });
    } else {
      createProduct.mutate(productForm, {
        onSuccess: () => setIsProductModalOpen(false)
      });
    }
  };

  return (
    <Layout>
      <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold font-display mb-2">Admin Panel</h1>
        <p className="text-muted-foreground mb-8">Sayt ma'lumotlarini boshqarish</p>

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="w-full h-14 p-1 bg-secondary rounded-2xl mb-8">
            <TabsTrigger value="products" className="flex-1 rounded-xl text-base data-[state=active]:shadow-sm">
              <Package className="w-4 h-4 mr-2" /> Mahsulotlar
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex-1 rounded-xl text-base data-[state=active]:shadow-sm">
              <ShoppingCart className="w-4 h-4 mr-2" /> Buyurtmalar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <div className="flex justify-end mb-4">
              <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openCreateModal} className="rounded-xl h-11"><Plus className="w-4 h-4 mr-2" /> Mahsulot Qo'shish</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingProduct ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot'}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleProductSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nomi (UZ)</Label>
                        <Input required value={productForm.titleUz} onChange={e => setProductForm({...productForm, titleUz: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Nomi (RU)</Label>
                        <Input required value={productForm.titleRu} onChange={e => setProductForm({...productForm, titleRu: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Tavsif (UZ)</Label>
                        <Input required value={productForm.descriptionUz} onChange={e => setProductForm({...productForm, descriptionUz: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Tavsif (RU)</Label>
                        <Input required value={productForm.descriptionRu} onChange={e => setProductForm({...productForm, descriptionRu: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Narxi (UZS)</Label>
                        <Input type="number" required value={productForm.price} onChange={e => setProductForm({...productForm, price: parseInt(e.target.value) || 0})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Asl Narxi (UZS)</Label>
                        <Input type="number" placeholder="Chegirma uchun" value={productForm.originalPrice || ''} onChange={e => setProductForm({...productForm, originalPrice: e.target.value ? parseInt(e.target.value) : undefined})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Chegirma %</Label>
                        <Input type="number" min="0" max="100" placeholder="0-100" value={productForm.discountPercent || ''} onChange={e => setProductForm({...productForm, discountPercent: e.target.value ? parseInt(e.target.value) : undefined})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Kategoriya</Label>
                        <Input required value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label>Rasm URL</Label>
                        <Input required value={productForm.imageUrl} onChange={e => setProductForm({...productForm, imageUrl: e.target.value})} placeholder="https://..." />
                      </div>
                      
                      <div className="col-span-2 space-y-3 bg-secondary/50 p-4 rounded-xl border border-border">
                        <div className="flex items-center justify-between">
                          <Label className="text-base cursor-pointer">Mashhur (HOT)</Label>
                          <Switch checked={productForm.isPopular} onCheckedChange={c => setProductForm({...productForm, isPopular: c})} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-base cursor-pointer">Yangi (NEW)</Label>
                          <Switch checked={productForm.isNew} onCheckedChange={c => setProductForm({...productForm, isNew: c})} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-base cursor-pointer">Chegirma (SALE)</Label>
                          <Switch checked={productForm.isSale} onCheckedChange={c => setProductForm({...productForm, isSale: c})} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-base cursor-pointer">Qiziq (HOT - eski label)</Label>
                          <Switch checked={productForm.isHot} onCheckedChange={c => setProductForm({...productForm, isHot: c})} />
                        </div>
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-12 mt-4" disabled={createProduct.isPending || updateProduct.isPending}>
                      Saqlash
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-secondary/50 text-muted-foreground uppercase">
                    <tr>
                      <th className="px-6 py-4">Mahsulot</th>
                      <th className="px-6 py-4">Narx</th>
                      <th className="px-6 py-4">Kategoriya</th>
                      <th className="px-6 py-4 text-right">Amallar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {products?.map(p => (
                      <tr key={p.id} className="hover:bg-secondary/20 transition-colors">
                        <td className="px-6 py-4 font-medium flex items-center gap-2">
                          <img src={p.imageUrl} className="w-10 h-10 rounded object-cover" alt="" />
                          <div className="flex flex-col gap-1">
                            {p.titleUz}
                            <div className="flex gap-1">
                              {p.isPopular && <span className="text-[10px] bg-destructive text-white px-2 py-0.5 rounded-full">HOT</span>}
                              {p.isNew && <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full">NEW</span>}
                              {p.isSale && <span className="text-[10px] bg-orange-500 text-white px-2 py-0.5 rounded-full">SALE</span>}
                              {p.isHot && <span className="text-[10px] bg-green-500 text-white px-2 py-0.5 rounded-full">HOT!</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            {p.discountPercent && p.originalPrice ? (
                              <>
                                <span className="line-through text-muted-foreground text-xs">{new Intl.NumberFormat().format(p.originalPrice)}</span>
                                <span className="font-bold">{new Intl.NumberFormat().format(p.price)}</span>
                              </>
                            ) : (
                              <span>{new Intl.NumberFormat().format(p.price)}</span>
                            )}
                            {p.ratingCount > 0 && <span className="text-xs text-muted-foreground">⭐ {parseFloat(p.ratingAverage?.toString() || '0').toFixed(1)} ({p.ratingCount})</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 capitalize">{p.category}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <Button variant="outline" size="icon" onClick={() => openEditModal(p)}><Edit className="w-4 h-4 text-blue-500" /></Button>
                          <Button variant="outline" size="icon" onClick={() => {
                            if(confirm("Rostdan ham o'chirasizmi?")) deleteProduct.mutate(p.id);
                          }}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
               {orders?.map(order => (
                 <div key={order.id} className="bg-card p-5 rounded-2xl border border-border shadow-sm flex flex-col">
                   <div className="flex justify-between items-start mb-4 pb-4 border-b border-border/50">
                     <div>
                       <div className="font-bold text-lg mb-1">{order.customerName}</div>
                       <div className="text-muted-foreground text-sm">{order.customerPhone}</div>
                       <div className="text-muted-foreground text-sm mt-1 bg-secondary inline-block px-2 py-1 rounded">{order.customerAddress}</div>
                     </div>
                   </div>
                   
                   <div className="space-y-2 mb-4 flex-1">
                     <div className="text-xs font-semibold text-muted-foreground uppercase">Mahsulotlar:</div>
                     {/* items is jsonb, parse if needed but schema maps it to object array */}
                     {((order.items as any) || []).map((item: any, idx: number) => (
                       <div key={idx} className="flex justify-between text-sm">
                         <span>Item #{item.productId} x {item.quantity}</span>
                         <span className="font-medium">{item.price * item.quantity} UZS</span>
                       </div>
                     ))}
                   </div>
                   
                   <div className="flex justify-between items-center font-bold text-lg mb-4 pt-4 border-t border-border/50">
                     <span>Jami:</span>
                     <span className="text-primary">{new Intl.NumberFormat().format(order.totalAmount)} UZS</span>
                   </div>
                   
                   <div className="flex gap-2 mt-auto">
                     <Select value={order.status} onValueChange={(val) => updateOrderStatus.mutate({id: order.id, status: val})}>
                       <SelectTrigger className="flex-1 rounded-xl h-10">
                         <SelectValue placeholder="Status" />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="pending">Kutilmoqda</SelectItem>
                         <SelectItem value="confirmed">Tasdiqlandi</SelectItem>
                         <SelectItem value="shipping">Yetkazilmoqda</SelectItem>
                         <SelectItem value="delivered">Yetkazildi</SelectItem>
                         <SelectItem value="cancelled">Bekor qilindi</SelectItem>
                       </SelectContent>
                     </Select>
                     
                     <Button variant="destructive" size="icon" className="shrink-0 h-10 w-10 rounded-xl" onClick={() => {
                        if(confirm("Buyurtmani o'chirasizmi?")) deleteOrder.mutate(order.id);
                     }}>
                       <Trash2 className="w-4 h-4" />
                     </Button>
                   </div>
                 </div>
               ))}
               {orders?.length === 0 && <div className="col-span-full py-10 text-center text-muted-foreground">Buyurtmalar yo'q</div>}
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
