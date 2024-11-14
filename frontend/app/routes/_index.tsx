import NoticeBoard from "./NoticeBoard";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../custom.css';

export default function Index() {
  return (
    <div className="root-container">
      <NoticeBoard />
    </div>
  );
}