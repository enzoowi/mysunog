import { useEffect, useState } from 'react';
import { api } from '../services/api';

type DashboardSummary = {
    totalIncidents: number;
    totalEstimatedDamage: number;
    totalCasualties: number;
    totalInjuries: number;
    barangayCounts: Record<string, number>;
};

export default function IncidentDashboard() {
    const [summary, setSummary] = useState<DashboardSummary | null>(null);

    useEffect(() => {
        api.get('/incidents/dashboard-summary')
            .then((res) => setSummary(res.data))
            .catch((err) => {
                console.error(err);
                alert('Failed to load dashboard summary');
            });
    }, []);

    if (!summary) {
        return <div style={{ padding: '24px' }}>Loading dashboard...</div>;
    }

    return (
        <div style={{ padding: '24px' }}>
            <h2>Incident Dashboard</h2>

            <p><strong>Total Incidents:</strong> {summary.totalIncidents}</p>
            <p><strong>Total Estimated Damage:</strong> ₱{summary.totalEstimatedDamage}</p>
            <p><strong>Total Casualties:</strong> {summary.totalCasualties}</p>
            <p><strong>Total Injuries:</strong> {summary.totalInjuries}</p>

            <h3>Incidents by Barangay</h3>
            {Object.keys(summary.barangayCounts).length === 0 ? (
                <p>No data yet.</p>
            ) : (
                Object.entries(summary.barangayCounts).map(([barangay, count]) => (
                    <p key={barangay}>
                        <strong>{barangay}:</strong> {count}
                    </p>
                ))
            )}
        </div>
    );
}