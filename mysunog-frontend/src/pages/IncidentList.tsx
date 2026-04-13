import { useEffect, useState } from 'react';
import { api } from '../services/api';

type Incident = {
    id: number;
    incidentDate: string;
    incidentTime: string;
    barangay: string;
    cause?: string;
    latitude: number;
    longitude: number;
    estimatedDamage?: number;
    casualties?: number;
    injuries?: number;
    propertyType?: string;
    remarks?: string;
};

export default function IncidentList() {
    const [incidents, setIncidents] = useState<Incident[]>([]);

    useEffect(() => {
        api.get('/incidents')
            .then((res) => setIncidents(res.data))
            .catch((err) => {
                console.error(err);
                alert('Failed to load incidents');
            });
    }, []);

    return (
        <div style={{ padding: '24px' }}>
            <h2>Fire Incidents</h2>

            {incidents.length === 0 ? (
                <p>No incidents found.</p>
            ) : (
                incidents.map((incident) => (
                    <div
                        key={incident.id}
                        style={{
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            padding: '16px',
                            marginBottom: '12px',
                        }}
                    >
                        <p><strong>Date:</strong> {incident.incidentDate}</p>
                        <p><strong>Time:</strong> {incident.incidentTime}</p>
                        <p><strong>Barangay:</strong> {incident.barangay}</p>
                        <p><strong>Cause:</strong> {incident.cause || 'N/A'}</p>
                        <p><strong>Damage:</strong> {incident.estimatedDamage ?? 0}</p>
                        <p><strong>Casualties:</strong> {incident.casualties ?? 0}</p>
                        <p><strong>Injuries:</strong> {incident.injuries ?? 0}</p>
                        <p><strong>Property Type:</strong> {incident.propertyType || 'N/A'}</p>
                        <p><strong>Remarks:</strong> {incident.remarks || 'N/A'}</p>
                    </div>
                ))
            )}
        </div>
    );
}