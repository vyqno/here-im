"use client";

import React, { useMemo, useState } from "react";

// Premium dual-month pickup calendar (matches the storefront design).
// Greys out past dates and closed weekdays; one tap selects a date.
//
// closedWeekdays uses JS getDay(): 0=Sun … 6=Sat. HERE I'M is open
// Wed–Sun, so Mon(1) and Tue(2) are closed by default. This is a prop
// (not hardcoded business logic) so it can later be fed from the
// business_hours table.

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
];

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function startOfMonth(year: number, month: number): Date {
  return new Date(year, month, 1);
}

interface MonthGridProps {
  year: number;
  month: number; // 0-indexed
  value: string;
  minISO: string;
  maxISO: string;
  closedWeekdays: number[];
  onSelect: (iso: string) => void;
}

function MonthGrid({ year, month, value, minISO, maxISO, closedWeekdays, onSelect }: MonthGridProps) {
  const first = startOfMonth(year, month);
  const leadingBlanks = first.getDay(); // 0..6
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div style={{ flex: 1, minWidth: 248 }}>
      <div style={{
        textAlign: "center",
        fontFamily: "'Instrument Sans', sans-serif",
        fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.08em",
        color: "#0d0c0b", marginBottom: 18,
      }}>
        {MONTHS[month]} {year}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px 0" }}>
        {WEEKDAYS.map((w) => (
          <div key={w} style={{
            textAlign: "center", fontSize: "0.6rem", fontWeight: 600,
            letterSpacing: "0.05em", color: "#9a958d", paddingBottom: 8,
            fontFamily: "'Instrument Sans', sans-serif",
          }}>
            {w}
          </div>
        ))}

        {cells.map((day, i) => {
          if (day === null) return <div key={`b${i}`} />;
          const iso = toISODate(new Date(year, month, day));
          const weekday = new Date(year, month, day).getDay();
          const isPast = iso < minISO;
          const isFuture = iso > maxISO;
          const isClosed = closedWeekdays.includes(weekday);
          const disabled = isPast || isFuture || isClosed;
          const selected = iso === value;

          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              onClick={() => !disabled && onSelect(iso)}
              style={{
                aspectRatio: "1",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: selected ? "#0d0c0b" : "transparent",
                color: selected ? "#fff" : disabled ? "#cccccc" : "#0d0c0b",
                border: "none", borderRadius: "50%",
                fontSize: "0.8rem",
                fontFamily: "'Instrument Sans', sans-serif",
                cursor: disabled ? "default" : "pointer",
                transition: "background 0.15s ease, color 0.15s ease",
              }}
              onMouseEnter={(e) => { if (!disabled && !selected) e.currentTarget.style.background = "#f5f5f5"; }}
              onMouseLeave={(e) => { if (!selected) e.currentTarget.style.background = "transparent"; }}
              aria-label={iso}
              aria-pressed={selected}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export interface PickupCalendarProps {
  value: string;
  onChange: (iso: string) => void;
  /** JS getDay() values that are closed. Default: Mon & Tue. */
  closedWeekdays?: number[];
}

export default function PickupCalendar({
  value,
  onChange,
  closedWeekdays = [],
}: PickupCalendarProps) {
  const today = useMemo(() => new Date(), []);
  const minISO = toISODate(today);
  const maxISO = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 45);
    return toISODate(d);
  }, [today]);

  // Left month being viewed; the right panel shows the following month.
  const [view, setView] = useState(() => ({
    year: today.getFullYear(),
    month: today.getMonth(),
  }));

  const atFloor =
    view.year === today.getFullYear() && view.month === today.getMonth();

  const shift = (delta: number) =>
    setView((v) => {
      const d = new Date(v.year, v.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });

  const right = new Date(view.year, view.month + 1, 1);

  const arrowStyle = (hidden: boolean): React.CSSProperties => ({
    background: "none", border: "none",
    cursor: hidden ? "default" : "pointer",
    color: hidden ? "#d8d3c9" : "#0d0c0b",
    padding: 4, lineHeight: 0,
  });

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 12px 48px rgba(13,12,11,0.18)",
        padding: "24px 28px 28px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        width: "min(680px, calc(100vw - 32px))",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* nav row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <button type="button" onClick={() => !atFloor && shift(-1)} disabled={atFloor} style={arrowStyle(atFloor)} aria-label="Previous month">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button type="button" onClick={() => shift(1)} style={arrowStyle(false)} aria-label="Next month">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>

      <div style={{ display: "flex", gap: 36 }}>
        <MonthGrid
          year={view.year} month={view.month}
          value={value} minISO={minISO} maxISO={maxISO} closedWeekdays={closedWeekdays}
          onSelect={onChange}
        />
        <div style={{ width: 1, background: "#eceae5" }} />
        <MonthGrid
          year={right.getFullYear()} month={right.getMonth()}
          value={value} minISO={minISO} maxISO={maxISO} closedWeekdays={closedWeekdays}
          onSelect={onChange}
        />
      </div>
    </div>
  );
}
