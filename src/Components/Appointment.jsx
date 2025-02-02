import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TableCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import Domain from '../Constans/Domain';

const Appointment = () => {
  const { doctorId } = useParams();
  const [currentDay, setCurrentDay] = useState(new Date());
  const [timeSelected, setTimeSelected] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleDayClick = (day) => {
    setCurrentDay(day);
    setTimeSelected(false); // Reset time selection on day change
  };

  const handleTimeSelect = (index) => {
    setCurrentIndex(index);
    setTimeSelected(true);
  };

  const handleAppointment = async () => {
    setIsLoading(true);
    setError(null);
    
    const appointmentDate = format(currentDay, 'yyyy-MM-dd') + 'T' + (currentIndex + 9) + ':00:00';
    const url = `${Domain.resoureseUrl()}/api/Appointment`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          DoctorId: doctorId,
          PatientId: "71c7d19b-93ef-42de-a43c-7a2178dd6d48", // Replace with actual patient ID
          AppointmentDate: appointmentDate,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        navigate(`/success`, { state: responseData }); // Pass response to success page
      } else {
        const errorData = await response.json();
        setError(`Error: ${errorData.message || 'Failed to book appointment'}`);
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-5">
      <h1 className="text-3xl font-semibold mb-5">Book Appointment with Doctor</h1>
      <TableCalendar
        onChange={handleDayClick}
        value={currentDay}
      />
      <div className="grid grid-cols-4 gap-5 my-5">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            onClick={() => handleTimeSelect(index)}
            className={`flex items-center justify-center h-16 border rounded-lg cursor-pointer 
              ${currentIndex === index ? 'bg-blue-600 text-white' : 'bg-white text-black'}`}
          >
            {index + 9}:00 {index + 9 >= 12 ? 'PM' : 'AM'}
          </div>
        ))}
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <button
        onClick={handleAppointment}
        disabled={!timeSelected || isLoading}
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        {isLoading ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  );
};

export default Appointment;