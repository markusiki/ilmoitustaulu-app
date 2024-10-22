import { useState } from "react";
import Section from "./Section";
import AddAnnouncementForm from "./AddAnnouncementForm";

interface Announcement {
  title: string;
  description: string;
}

// Helper function to generate predefined dummy announcements
const dummyAnnouncements: Announcement[] = [
  { title: "Special Discount", description: "Get up to 30% off on select products!" },
  { title: "Customer Feedback", description: "We value your feedback on our new services." },
  { title: "Exclusive Sale", description: "Exclusive discounts for VIP members only." },
  { title: "Policy Update", description: "Read our updated privacy policy." },
  { title: "New Product Launch", description: "Check out our latest gadgets." },
];

const getRandomAnnouncements = (count: number): Announcement[] => {
  return Array.from({ length: count }, () => {
    const randomIndex = Math.floor(Math.random() * dummyAnnouncements.length);
    return dummyAnnouncements[randomIndex];
  });
};

export default function NoticeBoard() {
  // Simplified initial state setup with dummy announcements
  const [announcements, setAnnouncements] = useState<Record<string, Announcement[]>>({
    Tarjoukset: getRandomAnnouncements(4),
    Asiakastoiveet: getRandomAnnouncements(8),
    "Myynti-ilmoitukset": getRandomAnnouncements(6),
  });

  const handleAddAnnouncement = (newAnnouncement: {
    category: "Asiakastoive" | "Myynti-ilmoitus";
    title: string;
    content: string;
  }) => {
    // Initialize the category as an empty array if it doesn't exist yet
    setAnnouncements((prevAnnouncements) => ({
      ...prevAnnouncements,
      [newAnnouncement.category]: [
        ...(prevAnnouncements[newAnnouncement.category] || []), // Ensure it's an array
        { title: newAnnouncement.title, description: newAnnouncement.content },
      ],
    }));
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-4xl font-bold text-center text-black mb-10">Ilmoitustaulu</h1>
      <div className="grid grid-cols-3 gap-10">
        <Section title="Tarjoukset" announcements={announcements.Tarjoukset} />
        <Section title="Asiakastoiveet" announcements={announcements.Asiakastoiveet} />
        <Section title="Myynti-ilmoitukset" announcements={announcements["Myynti-ilmoitukset"]} />
      </div>
      <AddAnnouncementForm onAddAnnouncement={handleAddAnnouncement} />
    </div>
  );
}