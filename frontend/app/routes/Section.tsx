import Notice from "./Notice";

interface SectionProps {
  title: string;
  announcements: { title: string; description: string }[];
}

export default function Section({ title, announcements }: SectionProps) {
  return (
    <div>
      <h2 className="text-2xl text-black mb-5">{title}</h2>
      <div className="grid grid-cols-2 gap-4">
        {announcements.map((announcement, index) => (
          <Notice key={index} title={announcement.title} description={announcement.description} />
        ))}
      </div>
    </div>
  );
}