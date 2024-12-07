import { BsCalendar4Range } from "react-icons/bs";
import { FaWhatsapp } from "react-icons/fa";
import { LuFormInput } from "react-icons/lu";
import { MdOutlineManageAccounts } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { IoCalendarOutline } from "react-icons/io5";
import { BsCameraReels } from "react-icons/bs";
import { BsCardChecklist } from "react-icons/bs";
import { MdOutlineCoPresent } from "react-icons/md";
import { GoTasklist } from "react-icons/go";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { TiGroupOutline } from "react-icons/ti";

export const adminMenuOptions = [
  {
    path: "/admin/accounts/count",
    text: "Accounts",
    icon: (active) => (
      <MdOutlineManageAccounts
        className={`fs-4 ${active ? "text-white" : "text-black"}`}
      />
    ),
  },
  {
    path: "/admin/form-options",
    text: "Form Options",
    icon: (active) => (
      <LuFormInput className={`fs-4 ${active ? "text-white" : "text-black"}`} />
    ),
  },
  {
    path: "/admin/deliverables-deadlines",
    text: "Deliverables Deadlines",
    icon: (active) => (
      <BsCalendar4Range
        className={`fs-4 ${active ? "text-white" : "text-black"}`}
      />
    ),
  },
  {
    path: "/admin/whatsapp",
    text: "Whatsapp",
    icon: (active) => (
      <FaWhatsapp className={`fs-4 ${active ? "text-white" : "text-black"}`} />
    ),
  },
];

export const managerMenuOptions = [
  {
    text: "Clients",
    icon: (active) => (
      <FiUsers className={`fs-4 ${active ? "text-white" : "text-black"}`} />
    ),
    subMenus: [
      {
        path: "/clients/add-client/form-1",
        text: "Add Client",
      },
      {
        path: "/clients/view-client/all-clients",
        text: "View Clients",
      },
    ],
  },
  {
    text: "Calendar",
    icon: (active) => (
      <IoCalendarOutline
        className={`fs-4 ${active ? "text-white" : "text-black"}`}
      />
    ),
    subMenus: [
      {
        path: "/calendar/calendar-view",
        text: "Calendar View",
      },
      {
        path: "/pre-wed-shoots/screen",
        text: "Pre-Wed Shoots",
      },
    ],
  },
  {
    text: "Deliverables",
    icon: (active) => (
      <BsCameraReels
        className={`fs-4 ${active ? "text-white" : "text-black"}`}
      />
    ),
    subMenus: [
      {
        path: "/deliverables/cinema",
        text: "Cinema",
      },
      {
        path: "/deliverables/photos",
        text: "Photos",
      },
      {
        path: "/deliverables/albums",
        text: "Albums",
      },
      {
        path: "/deliverables/pre-wed-deliverables",
        text: "Pre-Weddings",
      },
    ],
  },
  {
    path: "/checklists",
    text: "Checklists",
    icon: (active) => (
      <BsCardChecklist
        className={`fs-4 ${active ? "text-white" : "text-black"}`}
      />
    ),
  },
  {
    path: "/attendance",
    text: "Attendance",
    icon: (active) => (
      <MdOutlineCoPresent
        className={`fs-4 ${active ? "text-white" : "text-black"}`}
      />
    ),
  },
  {
    text: "Tasks",
    icon: (active) => (
      <GoTasklist className={`fs-4 ${active ? "text-white" : "text-black"}`} />
    ),
    subMenus: [
      {
        path: "/tasks/daily-tasks",
        text: "Daily Tasks",
      },
      {
        path: "/tasks/reports",
        text: "Report",
      },
    ],
  },
  {
    path: "/team/reports",
    text: "Reports",
    icon: (active) => (
      <HiOutlineDocumentReport className={`fs-4 ${active ? "text-white" : "text-black"}`} />
    ),
  },
  {
    path: "/teams",
    text: "Teams",
    icon: (active) => (
      <TiGroupOutline className={`fs-4 ${active ? "text-white" : "text-black"}`} />
    ),
  },
];
export const shooterMenuOptions = [
  {
    text: "Calendar",
    icon: (active) => (
      <IoCalendarOutline className={`fs-4 ${active ? "text-white" : "text-black"}`} />
    ),
    subMenus: [
      {
        path: "/calendar/calendar-view",
        text: "Calendar View",
      },
      {
        path: "/pre-wed-shoots/screen",
        text: "Pre-Wed Shoots",
      },
    ],
  },
  {
    path: "/attendance",
    text: "Attendance",
    icon: (active) => (
      <MdOutlineCoPresent className={`fs-4 ${active ? "text-white" : "text-black"}`} />
    ),
  },
];

export const editorMenuOptions = [
  {
    text: "Deliverables",
    icon: (active) => (
      <BsCameraReels className={`fs-4 ${active ? "text-white" : "text-black"}`} />
    ),
    subMenus: [
      {
        path: "/deliverables/cinematography",
        text: "Cinematography",
      },
      {
        path: "/deliverables/photos",
        text: "Photos",
      },
      {
        path: "/deliverables/albums",
        text: "Albums",
      },
      {
        path: "/deliverables/pre-wed-deliverables",
        text: "Pre-Weddings",
      },
    ],
  },
  {
    text: "Tasks",
    icon: (active) => (
      <GoTasklist className={`fs-4 ${active ? "text-white" : "text-black"}`} />
    ),
    subMenus: [
      {
        path: "/tasks/daily-tasks",
        text: "Daily Tasks",
      },
    ],
  },
  {
    path: "/attendance",
    text: "Attendance",
    icon: (active) => (
      <MdOutlineCoPresent className={`fs-4 ${active ? "text-white" : "text-black"}`} />
    ),
  },
];
