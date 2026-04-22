import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import "./Calendar.css";

export default function Cal() {
  const [value, onChange] = useState(new Date());

  return (
    <div className="Calendar">
      <div className="Calendar__container">
        <main className="Calendar__container__content">
          <Calendar onChange={onChange} showWeekNumbers value={value} />
        </main>
      </div>
    </div>
  );
}
