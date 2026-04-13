import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function MyPermits() {
    const [permits, setPermits] = useState<any[]>([]);

    useEffect(() => {
        api.get('/permits/mine')
            .then((res) => setPermits(res.data))
            .catch((err) => {
                console.error(err);
                alert('Failed to load permits');
            });
    }, []);

    return (
        <div style={{ padding: 24 }}>
            <h2>My Permit Requests</h2>

            {permits.length === 0 ? (
                <p>No permit requests found.</p>
            ) : (
                permits.map((permit) => (
                    <div
                        key={permit.id}
                        style={{
                            border: '1px solid #ccc',
                            padding: 12,
                            marginBottom: 12,
                            borderRadius: 8,
                        }}
                    >
                        <p><strong>Business Name:</strong> {permit.businessName}</p>
                        <p><strong>Address:</strong> {permit.businessAddress}</p>
                        <p><strong>Purpose:</strong> {permit.purpose}</p>
                        <p><strong>Status:</strong> {permit.status}</p>
                        <p><strong>Remarks:</strong> {permit.adminRemarks ?? 'None'}</p>
                    </div>
                ))
            )}
        </div>
    );
}