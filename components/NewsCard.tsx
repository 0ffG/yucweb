// components/NewsCard.tsx
type NewsCardProps = {
    title: string;
    description: string;
    image?: string;
    showBorder?: boolean;
  };
  
  export default function NewsCard({ title, description, image, showBorder = true }: NewsCardProps) {
    return (
      <div
        className={`flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto py-8 ${
          showBorder ? 'border-b border-gray-200' : ''
        }`}
      >
        {/* Text */}
        <div className="md:w-1/2 text-center md:text-left">
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
  
        {/* Image */}
        {image && (
          <div className="md:w-1/2">
            <img
              src={image}
              alt={title}
              className="w-full h-64 object-cover rounded-xl shadow-md"
            />
          </div>
        )}
      </div>
    );
  }
  