import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import '../../assets/css/Calender.css';
import AvatarGroup from '@atlaskit/avatar-group';
import axios from 'axios';
import dayjs from 'dayjs';

const RANDOM_USERS = [
  { email: 'chaki@me.com', name: 'Chaki Caronni' },
  { email: 'nanop@outlook.com', name: 'Nanop Rgiersig' },
  { email: 'dowdy@outlook.com', name: 'Dowdy Metzzo' },
  { email: 'daveewart@msn.com', name: 'Daveewart Grdschl' },
  { email: 'fwitness@optonline.net', name: 'Fwitness Tezbo' },
  { email: 'nighthawk@yahoo.com', name: 'Nighthawk Wikinerd' },
  { email: 'naupa@me.com', name: 'Naupa Telbij' },
  { email: 'jsmith@verizon.net', name: 'Jsmith Rnelson' },
  { email: 'maneesh@msn.com', name: 'Maneesh Solomon' },
  { email: 'kiddailey@yahoo.com', name: 'Kiddailey Kodeman' },
  { email: 'kodeman@att.net', name: 'Kodeman Kiddailey' },
  { email: 'solomon@att.net', name: 'Solomon Maneesh' },
  { email: 'rnelson@optonline.net', name: 'Rnelson Jsmith' },
  { email: 'telbij@msn.com', name: 'Telbij Naupa' },
  { email: 'wikinerd@gmail.com', name: 'Wikinerd Nighthawk' },
  { email: 'tezbo@optonline.net', name: 'Tezbo Fwitness' },
  { email: 'grdschl@att.net', name: 'Grdschl Daveewart' },
  { email: 'metzzo@msn.com', name: 'Metzzo Dowdy' },
  { email: 'rgiersig@att.net', name: 'Rgiersig Nanop' },
  { email: 'caronni@optonline.net', name: 'Caronni Chaki' },
];

let data_ = [];

// See https://randomuser.me/copyright — all images were supplied by people who gave their consent for them to be used on live websites (not just mockups)
const getFreeToUseAvatarImage = (number) =>
  `https://randomuser.me/api/portraits/${
    number % 2 === 0 ? 'men' : 'women'
  }/${number}.jpg`;

function renderEventContent(eventInfo) {
  const handleDateClick = () => {
  };
  const data = RANDOM_USERS.map((d, i) => ({
    email: d.email,
    key: d.email,
    name: d.name,
    href: '#',
    src: getFreeToUseAvatarImage(i),
  }));

  return (
    <div onClick={handleDateClick} className="calenderEventBox p4">
      <div className="topbar" />
      <div className="Text10S white p4">{eventInfo.event.title}</div>
      <div className="rowalign2 p4">
        <div className="Text10S yel pR3">Event: </div>
        <div className="Text10N white">
          {eventInfo.event.extendedProps.eventName}
        </div>
      </div>
      <div className="rowalign2 p4">
        <div className="Text10S yel pR3">Location : </div>
        <div className="Text10N white">
          {eventInfo.event.extendedProps.eventlocation}
        </div>
      </div>
      <div className="rowalign2 p4" style={{ width: '100%' }}>
        <div className="Text10S yel pR3">Team:</div>
        <AvatarGroup
          appearance="stack"
          data={data}
          size="xsmall"
          maxCount={3}
        />
      </div>
    </div>
  );
}
function ShooterCalenderView(props) {
  const [currentMonth, setCurrentMonth] = useState([]);
  const [CalenderEvents, setCalenderEvents] = useState([]);

  const getClientCalenderInfo = async () => {
    const id = JSON.parse(localStorage.getItem('userEmail'));

    const res = await axios.get(
      global.BASEURL + `/MyProfile/Calender/View/${id}`,
      {
        'Content-Type': 'application/json',
      }
    );

    data_ = [];
    for (let i = 0; i < res.data.length; i++) {
      for (let j = 0; j < res.data[i].events.length; j++)
        data_.push({
          title: res.data[i].Groom_Name + ' Weds ' + res.data[i].Bride_Name,
          date: dayjs(res.data[i].events[j].dates).format('YYYY-MM-DD'),
          eventlocation: res.data[i].events[j].locationSelect,
          eventName: res.data[i].events[j].eventType,
          //  extradata: [
          //   {
          //     title: res.data[i].Groom_Name + ' Weds '+res.data[i].Bride_Name,
          //     date: dayjs(res.data[i].events[j].dates).format("YYYY-MM-DD"),
          //     eventlocation: res.data[i].events[j].locationSelect,
          //     eventName: res.data[i].events[j].eventType,
          //   },
          // ],
        });
    }

    let data2 = data_;

    const filterData = data2.filter((data) => {
      const events = {
        title: data.title,
        date: data.date === data.date ? 'equal' : 'not equal',
        eventlocation: data.eventlocation,
        eventName: data.eventName,
      };
    });

    setCalenderEvents(data_);
  };
  useEffect(() => {
    getClientCalenderInfo();
  }, []);
  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, listPlugin, timeGridPlugin, interactionPlugin]}
        eventContent={renderEventContent}
        // dateClick={handleDateClick}
        initialView="dayGridMonth"
        initialDate={new Date().toISOString().slice(0, 10)}
        dayHeaderClassNames={'dayFormat'}
        events={CalenderEvents}
        headerToolbar={{
          start: 'prev,next today', // will normally be on the left. if RTL, will be on the right
          center: 'title',
          end: 'dayGridMonth,timeGridWeek,timeGridDay', // will normally be on the right. if RTL, will be on the left
        }}
      />
    </div>
  );
}

export default ShooterCalenderView;
