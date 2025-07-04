"use client";

import { useEffect, useState } from "react";
import { schedulerApi } from "@/api/scheduler";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Play,
  Pause,
  Trash2,
  Clock,
  Calendar,
  Activity,
} from "lucide-react";

interface ScheduledTask {
  id: string;
  name: string;
  cronExpression: string;
  handler: string;
  isActive: boolean;
  lastRun?: string;
  nextRun?: string;
  createdAt: string;
}

interface CreateTaskForm {
  name: string;
  cronExpression: string;
  handler: string;
  isActive: boolean;
}

const TASK_HANDLERS = [
  { value: "cleanupLogs", label: "清理日志" },
  { value: "sendNotifications", label: "发送通知" },
  { value: "backupData", label: "数据备份" },
  { value: "syncData", label: "数据同步" },
  { value: "generateReports", label: "生成报告" },
];

const CRON_PRESETS = [
  { value: "* * * * *", label: "每分钟" },
  { value: "0 * * * *", label: "每小时" },
  { value: "0 0 * * *", label: "每天午夜" },
  { value: "0 9 * * *", label: "每天上午9点" },
  { value: "0 0 * * 1", label: "每周一午夜" },
  { value: "0 0 1 * *", label: "每月1号午夜" },
];

export default function TasksPage() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<ScheduledTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateTaskForm>({
    name: "",
    cronExpression: "",
    handler: "",
    isActive: true,
  });

  // 获取任务列表
  const fetchTasks = async () => {
    try {
      const response = await schedulerApi.getTasks();
      // 处理新的接口返回格式
      if (response.code === 0) {
        setTasks(response.data.tasks || []);
      } else {
        throw new Error(response.message || "获取任务失败");
      }
    } catch {
      toast({
        variant: "destructive",
        title: "获取任务列表失败",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 创建任务
  const handleCreateTask = async () => {
    if (!createForm.name || !createForm.cronExpression || !createForm.handler) {
      toast({
        variant: "destructive",
        title: "请填写完整信息",
      });
      return;
    }

    try {
      const response = await schedulerApi.createTask(createForm);
      // 处理新的接口返回格式
      if (response.code === 0) {
        toast({
          title: "任务创建成功",
        });
        setIsCreateDialogOpen(false);
        setCreateForm({
          name: "",
          cronExpression: "",
          handler: "",
          isActive: true,
        });
        fetchTasks();
      } else {
        throw new Error(response.message || "创建任务失败");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "创建任务失败",
        description: error instanceof Error ? error.message : "请检查输入信息",
      });
    }
  };

  // 启动任务
  const handleStartTask = async (taskId: string) => {
    try {
      const response = await schedulerApi.startTask(taskId);
      // 处理新的接口返回格式
      if (response.code === 0) {
        toast({
          title: "任务已启动",
        });
        fetchTasks();
      } else {
        throw new Error(response.message || "启动任务失败");
      }
    } catch {
      toast({
        variant: "destructive",
        title: "启动任务失败",
      });
    }
  };

  // 停止任务
  const handleStopTask = async (taskId: string) => {
    try {
      const response = await schedulerApi.stopTask(taskId);
      // 处理新的接口返回格式
      if (response.code === 0) {
        toast({
          title: "任务已停止",
        });
        fetchTasks();
      } else {
        throw new Error(response.message || "停止任务失败");
      }
    } catch {
      toast({
        variant: "destructive",
        title: "停止任务失败",
      });
    }
  };

  // 删除任务
  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("确定要删除这个任务吗？")) {
      return;
    }

    try {
      const response = await schedulerApi.deleteTask(taskId);
      // 处理新的接口返回格式
      if (response.code === 0) {
        toast({
          title: "任务已删除",
        });
        fetchTasks();
      } else {
        throw new Error(response.message || "删除任务失败");
      }
    } catch {
      toast({
        variant: "destructive",
        title: "删除任务失败",
      });
    }
  };

  // 手动执行任务
  const handleExecuteTask = async (taskId: string) => {
    try {
      const response = await schedulerApi.executeTask(taskId);
      // 处理新的接口返回格式
      if (response.code === 0) {
        toast({
          title: "任务执行成功",
        });
        fetchTasks();
      } else {
        throw new Error(response.message || "执行任务失败");
      }
    } catch {
      toast({
        variant: "destructive",
        title: "执行任务失败",
      });
    }
  };

  // 格式化时间
  const formatTime = (timeString?: string) => {
    if (!timeString) return "未运行";
    return new Date(timeString).toLocaleString("zh-CN");
  };

  // 获取状态徽章
  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge variant={isActive ? "default" : "secondary"}>
        {isActive ? "运行中" : "已停止"}
      </Badge>
    );
  };

  // 获取 cron 表达式的可读描述
  const getCronDescription = (cronExpression: string) => {
    const preset = CRON_PRESETS.find((p) => p.value === cronExpression);
    return preset ? preset.label : cronExpression;
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold">我的任务</h1>
            <p className="text-muted-foreground">管理你的定时任务</p>
          </div>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>新建任务</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>创建新任务</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">任务名称</Label>
                <Input
                  id="name"
                  value={createForm.name}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, name: e.target.value })
                  }
                  placeholder="输入任务名称"
                />
              </div>

              <div>
                <Label htmlFor="handler">任务类型</Label>
                <Select
                  value={createForm.handler}
                  onValueChange={(value) =>
                    setCreateForm({ ...createForm, handler: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择任务类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {TASK_HANDLERS.map((handler) => (
                      <SelectItem key={handler.value} value={handler.value}>
                        {handler.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="cronExpression">执行频率</Label>
                <Select
                  value={createForm.cronExpression}
                  onValueChange={(value) =>
                    setCreateForm({ ...createForm, cronExpression: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择执行频率" />
                  </SelectTrigger>
                  <SelectContent>
                    {CRON_PRESETS.map((preset) => (
                      <SelectItem key={preset.value} value={preset.value}>
                        {preset.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={createForm.isActive}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, isActive: e.target.checked })
                  }
                  className="rounded"
                />
                <Label htmlFor="isActive">创建后立即启动</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  取消
                </Button>
                <Button onClick={handleCreateTask}>创建</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 任务统计 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总任务数</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">运行中</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {tasks.filter((task) => task.isActive).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已停止</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {tasks.filter((task) => !task.isActive).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 任务列表 */}
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">暂无任务</h3>
              <p className="text-muted-foreground mb-4">
                创建你的第一个定时任务
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                新建任务
              </Button>
            </CardContent>
          </Card>
        ) : (
          tasks.map((task) => (
            <Card key={task.id}>
              <CardHeader>
                <div className="space-y-3">
                  <div>
                    <CardTitle className="flex items-center space-x-2 mb-2">
                      <span>{task.name}</span>
                      {getStatusBadge(task.isActive)}
                    </CardTitle>
                    <CardDescription>
                      {TASK_HANDLERS.find((h) => h.value === task.handler)
                        ?.label || task.handler}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">
                      执行频率：
                    </span>
                    <span>{getCronDescription(task.cronExpression)}</span>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">
                      最后运行：
                    </span>
                    <span>{formatTime(task.lastRun)}</span>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">
                      创建时间：
                    </span>
                    <span>{formatTime(task.createdAt)}</span>
                  </div>
                </div>

                {/* 操作按钮移到这里，并靠右对齐 */}
                <div className="flex justify-end mt-4 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExecuteTask(task.id)}
                  >
                    立即执行
                  </Button>
                  {task.isActive ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStopTask(task.id)}
                    >
                      <Pause className="h-4 w-4 mr-1" />
                      停止
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStartTask(task.id)}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      启动
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
