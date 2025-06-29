import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const ModernCalendar = ({ selectedDate, onChange, onClose, maxDate }) => {
    const calendarRef = useRef(null);
    const [view, setView] = useState('days'); // 'days', 'months', 'years'
    const [viewDate, setViewDate] = useState(selectedDate ? new Date(selectedDate) : new Date());

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);
    
    const changeMonth = (offset) => setViewDate(current => new Date(current.getFullYear(), current.getMonth() + offset, 1));
    const changeYear = (offset) => setViewDate(current => new Date(current.getFullYear() + offset, current.getMonth(), 1));
    const changeYearDecade = (offset) => setViewDate(current => new Date(current.getFullYear() + (offset * 10), current.getMonth(), 1));

    const handleDayClick = (day) => {
        const selected = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        // Format to YYYY-MM-DD
        const year = selected.getFullYear();
        const month = String(selected.getMonth() + 1).padStart(2, '0');
        const dayOfMonth = String(selected.getDate()).padStart(2, '0');
        onChange(`${year}-${month}-${dayOfMonth}`);
        onClose();
    }

    const handleMonthClick = (monthIndex) => {
        setViewDate(new Date(viewDate.getFullYear(), monthIndex, 1));
        setView('days');
    }

    const handleYearClick = (year) => {
        setViewDate(new Date(year, viewDate.getMonth(), 1));
        setView('months');
    }

    const renderDaysView = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        let grid = [];

        for (let i = 0; i < firstDayOfMonth; i++) {
            grid.push(<div key={`blank-${i}`} />);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(year, month, day);
            const isSelected = selectedDate && new Date(selectedDate).toDateString() === currentDate.toDateString();
            const isToday = new Date().toDateString() === currentDate.toDateString();
            const isDisabled = maxDate && currentDate > new Date(maxDate);
            
            grid.push(
                <button 
                    key={day} 
                    disabled={isDisabled} 
                    onClick={() => handleDayClick(day)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full text-sm transition-all duration-200 
                        ${isDisabled ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-purple-500/30'}
                        ${isToday ? 'border border-purple-400' : ''}
                        ${isSelected ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold' : ''}
                    `}
                >{day}</button>
            );
        }
        return grid;
    };

    const renderMonthsView = () => monthNames.map((month, index) => (
        <button key={month} onClick={() => handleMonthClick(index)}
            className="p-2 h-12 flex items-center justify-center rounded-lg text-sm transition-colors duration-200 hover:bg-purple-500/30 text-slate-300">
            {month.substring(0, 3)}
        </button>
    ));

    const renderYearsView = () => {
        const startYear = Math.floor(viewDate.getFullYear() / 10) * 10;
        let years = [];
        for (let i = 0; i < 12; i++) {
            years.push(
                <button key={startYear + i - 1} onClick={() => handleYearClick(startYear + i - 1)}
                    className={`p-2 h-12 flex items-center justify-center rounded-lg text-sm transition-colors duration-200 hover:bg-purple-500/30 ${i===0 || i===11 ? 'text-slate-500':'text-slate-300'}`}>
                    {startYear + i - 1}
                </button>
            );
        }
        return years;
    };

    return (
        <div ref={calendarRef} className="absolute top-full mt-2 w-full max-w-xs bg-slate-800 border border-slate-700 rounded-2xl p-4 z-50 shadow-2xl">
            <div className="flex items-center justify-between mb-4 text-white">
                <button onClick={() => view === 'days' ? changeMonth(-1) : view === 'months' ? changeYear(-1) : changeYearDecade(-1)} className="p-2 rounded-full hover:bg-white/10"><ChevronLeft className="w-5 h-5"/></button>
                <div className="flex gap-2">
                    {view === 'days' && <button className="font-bold text-lg hover:text-purple-400" onClick={() => setView('months')}>{monthNames[viewDate.getMonth()]}</button>}
                    <button className="font-bold text-lg hover:text-purple-400" onClick={() => setView('years')}>
                        {view === 'years' 
                            ? `${Math.floor(viewDate.getFullYear() / 10) * 10 - 1}-${Math.floor(viewDate.getFullYear() / 10) * 10 + 10}` 
                            : viewDate.getFullYear()}
                    </button>
                </div>
                <button onClick={() => view === 'days' ? changeMonth(1) : view === 'months' ? changeYear(1) : changeYearDecade(1)} className="p-2 rounded-full hover:bg-white/10"><ChevronRight className="w-5 h-5"/></button>
            </div>
            
            {view === 'days' && <>
                <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-400 mb-2">
                    {daysOfWeek.map(day => <div key={day} className="w-10">{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1">{renderDaysView()}</div>
            </>}
            {view === 'months' && <div className="grid grid-cols-4 gap-2">{renderMonthsView()}</div>}
            {view === 'years' && <div className="grid grid-cols-4 gap-2">{renderYearsView()}</div>}
        </div>
    );
};

export default ModernCalendar;