import React, { useEffect, useState, useMemo } from "react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const formatHours = (h) => (h > 12 ? h - 12 : h === 0 ? 12 : h);
const pad = (n) => (n < 10 ? "0" + n : n);

const Clock = React.memo(() => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const time = useMemo(() => {
    return {
      day: DAYS[now.getDay()],
      month: MONTHS[now.getMonth()],
      date: now.getDate(),
      hours: formatHours(now.getHours()),
      minutes: pad(now.getMinutes()),
      seconds: pad(now.getSeconds()),
      amPm: now.getHours() >= 12 ? "PM" : "AM",
    };
  }, [now]);

  return (
    <div>
      <h3>{time.day}, {time.month} {time.date}</h3>
      <h2>{time.hours}:{time.minutes}:{time.seconds} {time.amPm}</h2>
    </div>
  );
});

export default Clock;
