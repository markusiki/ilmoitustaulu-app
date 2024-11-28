import React from "react";
import { Carousel, Row, Col } from "react-bootstrap";
import Notice from "../routes/Notice";
import { IAnnouncement } from "../../interfaces";

interface CustomCarouselProps {
  announcements: IAnnouncement[];
  itemsPerSlide: number;
  isAdmin: boolean;
  onDelete: (id: string) => void;
}

const CustomCarousel: React.FC<CustomCarouselProps> = ({
  announcements,
  itemsPerSlide,
  isAdmin,
  onDelete,
}) => {
  const chunkSize = itemsPerSlide;
  const chunks = [];

  for (let i = 0; i < announcements.length; i += chunkSize) {
    const selected = announcements.slice(i, i + chunkSize);
    if (selected.length < chunkSize) {
      selected.push(...announcements.slice(0, chunkSize - selected.length));
    }
    chunks.push(selected);
  }

  return (
    <Carousel
      interval={5000}
      fade
      controls={false}
      indicators={isAdmin}
      indicatorLabels={["1", "2", "3"]}
      pause={isAdmin ? "hover" : false}
      data-bs-theme="dark"
    >
      {chunks.map((chunk, index) => (
        <Carousel.Item key={index}>
          <Row>
            {chunk.map((announcement) => (
              <Col md={3} key={announcement.id}>
                <Notice
                  isAdmin={isAdmin}
                  onDelete={() => onDelete(announcement.id)}
                  poster={announcement.poster}
                  contact_info={announcement.contact_info}
                  title={announcement.title}
                  content={announcement.content}
                  file={announcement.file}
                />
              </Col>
            ))}
          </Row>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default CustomCarousel;
