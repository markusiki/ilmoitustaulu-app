interface NoticeProps {
    title: string;
    description: string;
  }
  
  export default function Notice({ title, description }: NoticeProps) {
    return (
      <div className="bg-gray-200 h-24 rounded-lg p-2 text-left">
        <h3 className="font-bold text-black">{title}</h3>
        <p className="text-sm text-black">{description}</p>
      </div>
    );
  }