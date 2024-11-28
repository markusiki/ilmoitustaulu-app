import { IAnnouncement } from "interfaces";
import Notice from "./Notice";
import { Card, Row, Col } from "react-bootstrap";
import "../custom.css";
import CustomCarousel from "~/components/CustomCarousel";

interface SectionProps {
  title: string;
  announcements: IAnnouncement[];
  isAdmin: boolean;
  onDelete: (id: string) => void;
  itemsPerSlide: number;
}

export default function Section({
  title,
  announcements,
  isAdmin,
  onDelete,
  itemsPerSlide,
}: SectionProps) {
  const getContent = (noticeCount: number) => {
    if (noticeCount === 0) {
      return <p>No announcements available.</p>;
    }
    if (noticeCount <= itemsPerSlide) {
      return (
        <Row className="">
          {announcements.map((announcement) => (
            <Col key={announcement.id} xs={12} sm={6} md={4} lg={3}>
              <Notice
                title={announcement.title}
                content={announcement.content}
                poster={announcement.poster}
                contact_info={announcement.contact_info}
                file={announcement.file}
                isAdmin={isAdmin}
                onDelete={() => onDelete(announcement.id)}
              />
            </Col>
          ))}
        </Row>
      );
    } else {
      return (
        <CustomCarousel
          announcements={announcements}
          itemsPerSlide={itemsPerSlide}
          isAdmin={isAdmin}
          onDelete={onDelete}
        ></CustomCarousel>
      );
    }
  };

  return (
    <div className="mb-4" style={{ border: "none", maxHeight: "100%" }}>
      <h1 className="section-title">{title}</h1>
      <div>{getContent(announcements.length)}</div>
    </div>
  );
}
