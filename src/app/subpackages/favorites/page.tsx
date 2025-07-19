"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Star, Trash2, ExternalLink } from "lucide-react";
import { CATEGORIES, LINK_OPTIONS } from "./const";
import { favoritesApi, Favorite, CreateFavoriteParams } from "@/api/favorites";

export default function FavoritesPage() {
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [favoriteToDelete, setFavoriteToDelete] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState<CreateFavoriteParams>({
    title: "",
    category: "文本",
    url: "",
  });

  // 获取链接选项
  const [linkOptions, setLinkOptions] = useState(LINK_OPTIONS["文本"]);

  // 当分类变化时更新链接选项
  useEffect(() => {
    setLinkOptions(
      LINK_OPTIONS[createForm.category as keyof typeof LINK_OPTIONS] || [],
    );
    // 重置链接选择
    if (
      createForm.url &&
      !LINK_OPTIONS[createForm.category as keyof typeof LINK_OPTIONS]?.some(
        (option) => option.value === createForm.url,
      )
    ) {
      setCreateForm((prev) => ({ ...prev, url: "" }));
    }
  }, [createForm.category]);

  // 当链接变化时自动设置标题
  useEffect(() => {
    if (createForm.url) {
      const selectedOption = linkOptions.find(
        (option) => option.value === createForm.url,
      );
      if (selectedOption && !createForm.title) {
        setCreateForm((prev) => ({ ...prev, title: selectedOption.label }));
      }
    }
  }, [createForm.url, linkOptions]);

  // 获取收藏列表
  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await favoritesApi.getFavorites();
      if (response.code === 0) {
        setFavorites(response.data.favorites);
      } else {
        toast({
          variant: "destructive",
          title: "获取收藏列表失败",
          description: response.message,
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "获取收藏列表失败",
        description: "请检查网络连接",
      });
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    fetchFavorites();
  }, []);

  // 添加收藏
  const handleAddFavorite = async () => {
    if (!createForm.title || !createForm.url) {
      toast({
        variant: "destructive",
        title: "请填写完整信息",
      });
      return;
    }

    try {
      const response = await favoritesApi.createFavorite(createForm);
      if (response.code === 0) {
        setFavorites([response.data.favorite, ...favorites]);
        setIsCreateDialogOpen(false);
        setCreateForm({
          title: "",
          category: "文本",
          url: "",
        });
        toast({
          title: "添加成功",
        });
      } else {
        toast({
          variant: "destructive",
          title: "添加失败",
          description: response.message,
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "添加失败",
        description: "请检查网络连接",
      });
    }
  };

  // 打开删除确认对话框
  const openDeleteDialog = (id: string) => {
    setFavoriteToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // 删除收藏
  const handleDeleteFavorite = async () => {
    if (!favoriteToDelete) return;
    
    try {
      const response = await favoritesApi.deleteFavorite(favoriteToDelete);
      if (response.code === 0) {
        setFavorites(favorites.filter((item) => item.id !== favoriteToDelete));
        toast({
          title: "删除成功",
        });
      } else {
        toast({
          variant: "destructive",
          title: "删除失败",
          description: response.message,
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "删除失败",
        description: "请检查网络连接",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setFavoriteToDelete(null);
    }
  };

  // 打开链接
  const handleOpenLink = (url: string) => {
    window.open(url, "_blank");
  };

  // 获取分类图标
  const getCategoryIcon = (category: string) => {
    const categoryObj = CATEGORIES.find((c) => c.value === category);
    if (categoryObj) {
      const Icon = categoryObj.icon;
      return <Icon className="h-4 w-4" />;
    }
    return null;
  };

  // 页面UI部分
  return (
    <div className="flex flex-col h-[100vh]">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-medium">我的常用</h1>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span>添加</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>添加常用</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              {/* 标题 */}
              <div className="space-y-2">
                <Label htmlFor="title">标题</Label>
                <Input
                  id="title"
                  value={createForm.title}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, title: e.target.value })
                  }
                  placeholder="输入标题"
                />
              </div>

              {/* 分类 */}
              <div className="space-y-2">
                <Label htmlFor="category">分类</Label>
                <Select
                  value={createForm.category}
                  onValueChange={(value) =>
                    setCreateForm({ ...createForm, category: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="选择分类" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center gap-2">
                          <category.icon className="h-4 w-4" />
                          <span>{category.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 链接 */}
              <div className="space-y-2">
                <Label htmlFor="url">链接</Label>
                <Select
                  value={createForm.url}
                  onValueChange={(value) =>
                    setCreateForm({ ...createForm, url: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="选择链接" />
                  </SelectTrigger>
                  <SelectContent>
                    {linkOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full" onClick={handleAddFavorite}>
                添加
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="h-48 bg-gray-100/60 animate-pulse rounded-xl overflow-hidden shadow-sm"
              ></div>
            ))}
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {favorites.map((favorite) => (
              <Card 
                key={favorite.id} 
                className="flex flex-col h-48 group hover:shadow-md transition-all duration-300 overflow-hidden border-gray-100 hover:border-gray-200 hover:-translate-y-1 relative"
              >
                {/* 添加卡片背景渐变效果 */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <CardHeader className="pb-0 px-4 pt-4 flex-shrink-0 space-y-2 relative z-10">
                  <div className="flex justify-between items-start gap-2">
                    <div className="overflow-hidden flex-1">
                      <CardTitle className="text-base font-medium truncate">
                        {favorite.title}
                      </CardTitle>
                      <CardDescription className="text-xs truncate mt-1 text-gray-500">
                        {favorite.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-grow flex items-center justify-center p-3 relative z-10">
                  <Button
                    variant="ghost"
                    className="w-full h-full rounded-lg hover:bg-gray-50/80 flex items-center justify-center group-hover:text-primary transition-colors"
                    onClick={() => handleOpenLink(favorite.url)}
                  >
                    <ExternalLink className="h-5 w-5 transition-transform group-hover:scale-110 duration-200" />
                    <span className="ml-1.5 text-sm font-medium">访问</span>
                  </Button>
                </CardContent>
                
                <CardFooter className="pt-0 pb-3 px-4 flex justify-between items-center relative z-10">
                  {/* 优化分类标签样式 */}
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 text-xs flex-shrink-0 bg-gray-50/80 backdrop-blur-sm group-hover:bg-primary/5 transition-all duration-200 border-gray-100 group-hover:border-primary/20 py-1"
                  >
                    <span className="text-gray-500 group-hover:text-primary/70 transition-colors">
                      {getCategoryIcon(favorite.category)}
                    </span>
                    <span className="hidden sm:inline text-gray-600 group-hover:text-gray-700 transition-colors">
                      {CATEGORIES.find((c) => c.value === favorite.category)
                        ?.label || favorite.category}
                    </span>
                  </Badge>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 opacity-70 hover:opacity-100"
                    onClick={() => openDeleteDialog(favorite.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 py-12">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-full mb-5 shadow-inner">
              <Star className="h-14 w-14 text-gray-300" />
            </div>
            <p className="text-gray-600 font-medium text-lg">暂无常用项目</p>
            <p className="text-gray-400 text-sm mt-2 max-w-xs text-center">添加您常用的功能，方便快速访问</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-8 gap-2 border-dashed hover:border-solid hover:bg-primary/5 transition-all duration-200 px-5 py-2 h-auto"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span>添加第一个</span>
            </Button>
          </div>
        )}
      </div>

      {/* 删除确认对话框 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-sm mx-auto rounded-xl border-gray-100 shadow-lg">
          <AlertDialogHeader className="pb-2">
            <AlertDialogTitle className="text-center text-lg font-medium">确认删除</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-gray-500">
              您确定要删除这个收藏吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 pt-2">
            <AlertDialogCancel 
              onClick={() => setFavoriteToDelete(null)}
              className="mt-0 w-full sm:w-auto border-gray-200 hover:bg-gray-50 hover:text-gray-700 transition-colors"
            >
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              className="w-full sm:w-auto bg-red-500 hover:bg-red-600 transition-colors"
              onClick={handleDeleteFavorite}
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
