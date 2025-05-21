import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/custom-calendar.css';
import pill_c from "../assets/free-icon-pill-5405609.png";
import pill_t from "../assets/free-icon-tablet-7038906.png";
import { fetchPills, createPill } from "../api/pillApi";
import { Card } from "../components/ui/card";

type PillRecord = {
    name: string;
    time: string;
    taken: boolean;
    takeTime?: string;  // 실제 복용 시간 (선택적)
};

interface Pill {
    _id: string;
    name: string;
    description: string;
}

type ValuePiece = Date | null;
type CalendarValue = ValuePiece | [ValuePiece, ValuePiece];



const dummyData: Record<string, PillRecord[]> = {
    "2025-05-20": [
        { name: "타이레놀", time: "08:00", taken: true , takeTime:"복용시간" },
        { name: "오메가3", time: "20:00", taken: false, takeTime:"복용시간" },
    ],
    "2025-05-21": [
        { name: "비타민D", time: "09:00", taken: true, takeTime:"복용시간" },
    ],
};


const PillsCalendar : React.FC  = () => {
    const [userName, setUserName] = useState<string>("");
    const [pills, setPills] = useState<Pill[]>([]);
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [userId, setUserId] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [records, setRecords] = useState<PillRecord[]>([]);

    const navigate = useNavigate();
    
    // 사용자 데이터 불러오기
    useEffect(() => {
        // localStorage에서 로그인된 사용자 정보 가져오기
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
        try {
            const parsed = JSON.parse(storedUser);
            console.log(parsed);
            if (parsed.id) {
            setUserId(parsed.id);
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
        }
        }
    }, []);
    
    useEffect(() => {
        loadPills();
        }, []);
    
        const loadPills = async () => {
        try {
            const data = await fetchPills();
            
            // undefined인 description을 빈 문자열로 처리
            const normalized: Pill[] = data.map((p) => ({
            _id: p._id,
            name: p.name,
              description: p.description ?? "",  // description이 undefined인 경우 빈 문자열로 처리
            }));
            
            setPills(normalized);
        } catch (error) {
            console.error("Failed to load pills", error);
        }
        };

    // 날짜 선택
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
        <div className="w-full">
        <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        className="w-full px-4 sm:px-8"
        locale="ko-KR"
        calendarType="gregory"
        tileDisabled={({ date, view }) => {
            if (view === 'month') {
            const now = new Date();
            return date.getMonth() !== now.getMonth();
            }
            return false;
        }}

        tileContent={({ date, view }) => {
    if (view !== 'month') return null;

    const day = date.getDay();
    const isSelected = date.toDateString() === selectedDate.toDateString();

    const baseClass = 'text-[16px] m-[4px]';
    const colorClass = day === 0
      ? 'text-red-500'
      : day === 6
      ? 'text-blue-500'
      : 'text-[#333]';

    // ✅ selectedDate일 경우 Tailwind로 완전한 커스터마이징
    const selectedClass = isSelected
      ? 'bg-[#58D68D] text-black rounded-full px-[6px] py-[2px] font-semibold'
      : '';

    return (
      <span className={`${baseClass} ${colorClass} ${selectedClass}`}>
        {date.getDate()}
      </span>
    );
  }}
        />

        </div>
        <div className="mt-6">
        <h2 className="text-xl font-bold">
            {selectedDate.toLocaleDateString()} 복용 기록
        </h2>
        {/* {records.length === 0 ? (
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
        )} */}
            <div>
            {pills.map((pill) => (
                <Card
                    key={pill._id}
                    className="mb-5"
                    onClick={() => navigate(`/pills/${pill._id}`)}
                >
                    <div className="flex items-center justify-between px-6 ">
                        <div className="flex-shrink-0 m-4">
                            <img src={pill_c} alt="약 캡슐 아이콘" className="w-12" />
                        </div>
                        <div className="flex flex-col items-start justify-center ml-4 flex-grow">
                            <h4 className="font-semibold">{pill.name}</h4>
                            <h5>복용시간 08:00</h5>
                            <h6>{pill.description}</h6>
                        </div>
                    </div>
                        <div className="flex justify-between px-8 pt-8 pb-2">
                        <img src={pill_c} alt="약 캡슐 아이콘" className="w-12" />
                        <img src={pill_c} alt="약 캡슐 아이콘" className="w-12" />
                        </div>
                </Card>
            ))}
        </div>
        </div>
    </div>
    );
}

export default PillsCalendar;
