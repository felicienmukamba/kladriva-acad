"use client";

import React, { useEffect, useState } from "react";
import { Bell, Check } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu"; // Assuming these exist or will be adapted
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { pusherClient } from "@/lib/pusher";
import { cn } from "@/lib/utils";
import { markNotificationAsRead } from "@/lib/actions/notifications";
import { toast } from "sonner";

export function NotificationBell({ userId, initialNotifications }: { userId: string, initialNotifications: any[] }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    if (!userId) return;

    const channel = pusherClient.subscribe(`notifications_${userId}`);
    
    channel.bind("new-notification", (newNotification: any) => {
      setNotifications(prev => [newNotification, ...prev]);
      toast.info(newNotification.title, {
        description: newNotification.body,
        action: newNotification.link ? {
          label: "Voir",
          onClick: () => window.location.href = newNotification.link
        } : undefined
      });
    });

    return () => {
      pusherClient.unsubscribe(`notifications_${userId}`);
    };
  }, [userId]);

  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-primary/10 group transition-all">
          <Bell className="w-5 h-5 group-hover:text-primary" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-white border-2 border-background animate-in zoom-in duration-300">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-2 rounded-2xl border-border/50 bg-card/80 backdrop-blur-xl shadow-apple animate-in slide-in-from-top-2 duration-300">
        <DropdownMenuLabel className="px-4 py-3 border-b border-border/50 mb-2">
           <h4 className="font-bold text-sm">Notifications</h4>
        </DropdownMenuLabel>
        
        <div className="max-h-96 overflow-y-auto space-y-1">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-xs">
              Aucune notification pour le moment.
            </div>
          ) : (
            notifications.map((n) => (
              <DropdownMenuItem 
                key={n.id} 
                className={cn(
                  "p-3 rounded-xl cursor-pointer flex flex-col items-start gap-1 transition-colors",
                  !n.isRead ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/50"
                )}
                onClick={() => n.link && (window.location.href = n.link)}
              >
                <div className="flex justify-between w-full">
                  <span className={cn("text-xs font-bold", !n.isRead ? "text-primary" : "text-foreground")}>
                    {n.title}
                  </span>
                  {!n.isRead && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleMarkAsRead(n.id); }}
                      className="h-5 w-5 rounded-full hover:bg-primary/20 flex items-center justify-center"
                      title="Marquer comme lu"
                      aria-label="Marquer comme lu"
                    >
                      <Check className="w-3 h-3 text-primary" />
                    </button>
                  )}
                </div>
                {n.body && <p className="text-[11px] text-muted-foreground line-clamp-2">{n.body}</p>}
                <span className="text-[10px] text-muted-foreground/60 mt-1">
                  {new Date(n.createdAt).toLocaleDateString()}
                </span>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
