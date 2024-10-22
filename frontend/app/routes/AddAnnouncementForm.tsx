import { useState, ChangeEvent, FormEvent } from "react";

interface AnnouncementFormData {
  category: "Asiakastoive" | "Myynti-ilmoitus";
  announcer: string;
  contactInfo: string;
  title: string;
  content: string;
}

interface AddAnnouncementFormProps {
  onAddAnnouncement: (data: AnnouncementFormData) => void;
}

export default function AddAnnouncementForm({ onAddAnnouncement }: AddAnnouncementFormProps) {
  const [formData, setFormData] = useState<AnnouncementFormData>({
    category: "Asiakastoive",
    announcer: "",
    contactInfo: "",
    title: "",
    content: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onAddAnnouncement(formData);
    setFormData({
      category: "Asiakastoive",
      announcer: "",
      contactInfo: "",
      title: "",
      content: "",
    });
  };

  return (
    <div className="container mx-auto mt-5 p-5 bg-gray-200 rounded-lg max-w-md">
      <h2 className="text-2xl text-center mb-4 text-black font-bold">Lisää ilmoitus ilmoitustaululle</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-black">Ilmoitusluokka</label>
          <div className="flex gap-4 mt-1">
            <label className="text-black">
              <input
                type="radio"
                name="category"
                value="Asiakastoive"
                checked={formData.category === "Asiakastoive"}
                onChange={handleInputChange}
                className="mr-1"
              />
              Asiakastoive
            </label>
            <label className="text-black">
              <input
                type="radio"
                name="category"
                value="Myynti-ilmoitus"
                checked={formData.category === "Myynti-ilmoitus"}
                onChange={handleInputChange}
                className="mr-1"
              />
              Myynti-ilmoitus
            </label>
          </div>
        </div>
        <input
          type="text"
          name="announcer"
          placeholder="Ilmoittaja"
          value={formData.announcer}
          onChange={handleInputChange}
          className="p-2 rounded"
          required
        />
        <input
          type="text"
          name="contactInfo"
          placeholder="Yhteystiedot (valinnainen)"
          value={formData.contactInfo}
          onChange={handleInputChange}
          className="p-2 rounded"
        />
        <input
          type="text"
          name="title"
          placeholder="Ilmoituksen otsikko"
          value={formData.title}
          onChange={handleInputChange}
          className="p-2 rounded"
          required
        />
        <textarea
          name="content"
          placeholder="Ilmoituksen sisältö"
          value={formData.content}
          onChange={handleInputChange}
          className="p-2 rounded h-32"
          required
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Lähetä
        </button>
      </form>
    </div>
  );
}