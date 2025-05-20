import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type PillRecord = {
    name: string;
    time: string;
    taken: boolean;
};

type ValuePiece = Date | null;
type CalendarValue = ValuePiece | [ValuePiece, ValuePiece];

const dummyData: Record<string, PillRecord[]> = {
    "2025-05-20": [
        { name: "타이레놀", time: "08:00", taken: true },
        { name: "오메가3", time: "20:00", taken: false },
    ],
    "2025-05-21": [
        { name: "비타민D", time: "09:00", taken: true },
    ],
};


const PillsCalendar = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [records, setRecords] = useState<PillRecord[]>([]);

    useEffect(() => {
    const key = selectedDate.toISOString().split("T")[0]; // YYYY-MM-DD
    setRecords(dummyData[key] || []);
    }, [selectedDate]);

    const handleDateChange = (
        value: CalendarValue,
        _event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        const selected = Array.isArray(value) ? value[0] : value;
        if (selected instanceof Date) {
        setSelectedDate(selected);
        }
    };

    return (
    <div className="p-4">
        <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            />
        <div className="mt-6">
        <h2 className="text-xl font-bold">
            {selectedDate.toLocaleDateString()} 복용 기록
        </h2>
        {records.length === 0 ? (
            <p className="text-gray-500 mt-2">복용 기록이 없습니다.</p>
        ) : (
            <ul className="mt-2 space-y-2">
            {records.map((record, idx) => (
                <li key={idx} className="border p-2 rounded shadow-sm">
                <p>💊 {record.name}</p>
                <p>🕒 시간: {record.time}</p>
                <p>
                    ✅ 복용 여부:{" "}
                    <span className={record.taken ? "text-green-600" : "text-red-500"}>
                    {record.taken ? "복용함" : "미복용"}
                    </span>
                    </p>
                </li>
            ))}
            </ul>
        )}
        </div>
    </div>
    );
}

export default PillsCalendar;
