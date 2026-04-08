import { useMemo } from "react";

export default function Calendar({ expenses = [], selectedDate, onDateSelect }) {
  const today = new Date();
  const currentMonth = new Date(selectedDate || today.toISOString().split("T")[0]);
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Calculate expense totals by date
  const expensesByDate = useMemo(() => {
    const map = {};
    expenses.forEach((exp) => {
      map[exp.date] = (map[exp.date] || 0) + exp.amount;
    });
    return map;
  }, [expenses]);

  const handlePrevMonth = () => {
    const newDate = new Date(year, month - 1, 1);
    onDateSelect(newDate.toISOString().split("T")[0]);
  };

  const handleNextMonth = () => {
    const newDate = new Date(year, month + 1, 1);
    onDateSelect(newDate.toISOString().split("T")[0]);
  };

  const handleDateClick = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    onDateSelect(dateStr);
  };

  const monthName = new Date(year, month).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const selectedDateStr = selectedDate || today.toISOString().split("T")[0];
  const [selYear, selMonth, selDay] = selectedDateStr.split("-").map(Number);
  const isCurrentMonth = selYear === year && selMonth === month + 1;
  const selectedDayNum = isCurrentMonth ? selDay : -1;

  // Build calendar grid
  const days = [];
  
  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      dateStr: `${year}-${String(month).padStart(2, "0")}-${String(daysInPrevMonth - i).padStart(2, "0")}`,
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    days.push({
      day,
      isCurrentMonth: true,
      dateStr,
      hasExpense: !!expensesByDate[dateStr],
      total: expensesByDate[dateStr] || 0,
    });
  }

  // Next month days
  const remainingDays = 42 - days.length;
  for (let day = 1; day <= remainingDays; day++) {
    days.push({
      day,
      isCurrentMonth: false,
      dateStr: `${year}-${String(month + 2).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    });
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevMonth}
            className="p-1 hover:bg-slate-800 rounded-lg transition-all text-slate-400 hover:text-slate-300"
          >
            ←
          </button>
          <h3 className="text-sm font-semibold text-slate-300">{monthName}</h3>
          <button
            onClick={handleNextMonth}
            className="p-1 hover:bg-slate-800 rounded-lg transition-all text-slate-400 hover:text-slate-300"
          >
            →
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-center text-[10px] font-semibold text-slate-500 py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => {
            const isSelected = day.isCurrentMonth && day.day === selectedDayNum;
            const hasExpense = day.isCurrentMonth && day.hasExpense;
            const isTodayDate = day.dateStr === today.toISOString().split("T")[0];

            return (
              <button
                key={`${day.dateStr}-${idx}`}
                onClick={() => day.isCurrentMonth && handleDateClick(day.day)}
                disabled={!day.isCurrentMonth}
                className={`
                  aspect-square rounded-lg text-xs font-medium transition-all p-0.5 flex flex-col items-center justify-center relative
                  ${!day.isCurrentMonth ? "text-slate-700 opacity-40 cursor-default" : ""}
                  ${isSelected ? "bg-blue-600 text-white" : ""}
                  ${isTodayDate && !isSelected ? "border border-emerald-500 text-emerald-400" : ""}
                  ${hasExpense && !isSelected ? "bg-slate-800 text-orange-400" : ""}
                  ${day.isCurrentMonth && !isSelected && !isTodayDate && !hasExpense ? "hover:bg-slate-800 text-slate-300" : ""}
                `}
                title={hasExpense && day.isCurrentMonth ? `₹${Math.round(day.total)}` : ""}
              >
                <span className="block">{day.day}</span>
                {hasExpense && !isSelected && (
                  <span className="text-[7px] text-orange-400 absolute bottom-0.5">●</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="text-[10px] text-slate-500 space-y-1 mt-3 pt-3 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 bg-blue-600 rounded"></span>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 bg-slate-800 rounded text-orange-400">●</span>
          <span>Has expenses</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 border border-emerald-500 rounded"></span>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}
