import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/CustomCalendar.css";
import pill_c from "../assets/free-icon-pill-5405609.png";
import pill_t from "../assets/free-icon-tablet-7038906.png";
import { fetchUserPillRecords } from "../api/pillApi";
import { Card } from "../components/ui/card";

type PillRecord = {
  pillId: string;
  name: string;
  intakeTime: string;
  pillType: "pill" | "supplement";
  intakeDateTime: string;
};

type ValuePiece = Date | null;
type CalendarValue = ValuePiece | [ValuePiece, ValuePiece];

const PillsCalendar: React.FC = () => {
  const [userId, setUserId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [records, setRecords] = useState<PillRecord[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.id) {
          setUserId(parsed.id);
        }
      } catch (error) {
        console.error("유저 파싱 오류", error);
      }
    }
  }, []);

  useEffect(() => {
    if (userId) loadUserPillRecords();
  }, [selectedDate, userId]);

    const loadUserPillRecords = async () => {
    try {
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
        const day = String(selectedDate.getDate()).padStart(2, "0");
        const dateStr = `${year}-${month}-${day}`;
        const userRecords = await fetchUserPillRecords(userId, dateStr);
        setRecords(userRecords);
    } catch (err) {
        console.error("복용 기록 불러오기 실패", err);
    }
    };

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
            if (view === "month") {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return date > today;
            }
            return false;
          }}
          tileClassName={({ date, view }) => {
            if (view === "month") {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              if (date > today) {
                return "future-date";
              }
            }
            return undefined;
          }}
          tileContent={({ date, view }) => {
            if (view !== "month") return undefined;
            const isSelected = date.toDateString() === selectedDate.toDateString();
            const baseClass = "text-[16px] m-[4px]";
            const colorClass =
              date.getDay() === 0
                ? "text-red-500"
                : date.getDay() === 6
                ? "text-blue-500"
                : "text-[#333]";
            return (
              <span className={`${baseClass} ${colorClass} ${isSelected ? "" : ""}`}>
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
        {records.length === 0 ? (
          <p className="text-gray-500 mt-2">복용 기록이 없습니다.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {records.map((record, idx) => (
              <Card key={idx} className="cursor-pointer">
                <div className="flex justify-between px-6 py-4 items-center">
                  <div className="flex items-center gap-4">
                    <img src={record.pillType=="supplement"?pill_c:pill_t} alt="pill" className="w-10 h-10" />
                    <div>
                      <p className="font-semibold">{record.name}</p>
                      <p className="text-sm text-gray-600">
                        복용 시간: {record.intakeTime}
                      </p>
                      <p className="text-sm text-gray-500">
                        기록 시간:{" "}
                        {new Date(record.intakeDateTime).toLocaleTimeString("ko-KR")}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PillsCalendar;
