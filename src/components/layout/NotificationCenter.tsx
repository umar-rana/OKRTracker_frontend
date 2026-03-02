"use client";

import { useNotificationStore } from "@/store/notifications";
import { Bell, CheckCheck, Info, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Notification } from "@/types";

export function NotificationCenter() {
    const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        fetchNotifications();
        // Poll every 1 minute
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const getIcon = (type: string) => {
        switch (type) {
            case 'risk_identified': return <AlertTriangle className="text-rag-red" size={16} />;
            case 'objective_submitted': return <Info className="text-secondary" size={16} />;
            case 'objective_approved': return <CheckCircle className="text-rag-green" size={16} />;
            case 'objective_rejected': return <XCircle className="text-rag-red" size={16} />;
            default: return <Bell size={16} />;
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-400 hover:text-primary transition-colors rounded-full hover:bg-gray-100"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rag-red text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-xl z-50 overflow-hidden">
                        <div className="p-3 border-b flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-bold text-sm text-text-primary uppercase tracking-wider">Notifications</h3>
                            <button
                                onClick={() => markAllAsRead()}
                                className="text-primary hover:text-primary-hover text-[10px] font-bold uppercase flex items-center gap-1"
                            >
                                <CheckCheck size={12} />
                                Mark all read
                            </button>
                        </div>

                        <div className="max-h-[400px] overflow-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-400 text-xs">
                                    No notifications yet.
                                </div>
                            ) : (
                                notifications.map((n) => (
                                    <div
                                        key={n.id}
                                        onClick={() => {
                                            if (!n.is_read) markAsRead(n.id);
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            "p-3 border-b last:border-0 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3",
                                            !n.is_read && "bg-primary/5"
                                        )}
                                    >
                                        <div className="mt-1 shrink-0">{getIcon(n.type)}</div>
                                        <div>
                                            <p className="font-bold text-sm text-text-primary leading-tight mb-1">{n.title}</p>
                                            <p className="text-xs text-text-secondary line-clamp-2">{n.body}</p>
                                            <span className="text-[10px] text-gray-400 mt-2 block">
                                                {new Date(n.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-2 border-t text-center bg-gray-50/50">
                            <button className="text-[10px] font-bold uppercase text-gray-400 hover:text-text-primary transition-colors">
                                View all activity
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
