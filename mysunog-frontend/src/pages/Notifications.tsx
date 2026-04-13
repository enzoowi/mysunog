import { useEffect, useState } from 'react';
import { api } from '../services/api';

type NotificationItem = {
    id: number;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
};

export default function Notifications() {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchNotifications() {
        try {
            setLoading(true);
            const res = await api.get('/notifications/my');
            setNotifications(res.data);
        } catch (error) {
            console.error(error);
            alert('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    }

    async function markAsRead(id: number) {
        try {
            await api.patch(`/notifications/${id}/read`);
            fetchNotifications();
        } catch (error) {
            console.error(error);
            alert('Failed to mark notification as read');
        }
    }

    async function markAllAsRead() {
        try {
            await api.patch('/notifications/read-all');
            fetchNotifications();
        } catch (error) {
            console.error(error);
            alert('Failed to mark all notifications as read');
        }
    }

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <div style={{ padding: '24px' }}>
            <h2>Notifications</h2>

            <button
                onClick={markAllAsRead}
                style={{ marginBottom: '16px', padding: '8px 12px' }}
            >
                Mark All as Read
            </button>

            {loading ? (
                <p>Loading notifications...</p>
            ) : notifications.length === 0 ? (
                <p>No notifications found.</p>
            ) : (
                notifications.map((notification) => (
                    <div
                        key={notification.id}
                        style={{
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            padding: '16px',
                            marginBottom: '12px',
                            backgroundColor: notification.isRead ? '#f5f5f5' : '#eaf7ff',
                        }}
                    >
                        <p><strong>{notification.title}</strong></p>
                        <p>{notification.message}</p>
                        <p>
                            <small>
                                {new Date(notification.createdAt).toLocaleString()}
                            </small>
                        </p>
                        <p>
                            Status:{' '}
                            <strong>{notification.isRead ? 'Read' : 'Unread'}</strong>
                        </p>

                        {!notification.isRead && (
                            <button
                                onClick={() => markAsRead(notification.id)}
                                style={{ marginTop: '8px', padding: '8px 12px' }}
                            >
                                Mark as Read
                            </button>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}