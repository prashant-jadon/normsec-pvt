import { Models } from "appwrite";
import { useUserContext } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import UpdateStats from "./UpdateStats";
import { formatDateString } from "@/lib/utils";

type UpdateCardProps = {
  update: Models.Document;
  showStats?: boolean;
};



const GridUpdateList = ({ update, showStats = true }: UpdateCardProps) => {
  const { user } = useUserContext();

      // Function to convert URLs in text to clickable links
      const makeLinksClickable = (text: string) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);
    };

    // Function to truncate text to a specified length
    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center mb-3 lg:mb-0">
          <Link to={`/profile/${update.creator.$id}`}>
            <img
              src={update.creator.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="creator"
              className="rounded-full w-12 h-12 lg:w-16 lg:h-16 mr-3"
            />
          </Link>

          <div className="flex flex-col">
            <p className="text-lg font-bold text-gray-800">
              {update.creator.name}
            </p>
            <div className="flex items-center text-sm text-gray-600">
              <p className="mr-2">{formatDateString(update.$createdAt)}</p>
              <p>-</p>
              <p className="ml-2">{update.location}</p>
            </div>
          </div>
        </div>

        <Link
          to={`/update-post/${update.$id}`}
          className={`${user.id !== update.creator.$id && "hidden"}`}
        >
          <img
            src="/assets/icons/edit.svg"
            alt="edit"
            width={20}
            height={20}
          />
        </Link>
      </div>
      <Link to={`/updates/${update.$id}`}>
        <div className="py-4">
          <p
            className="text-lg font-semibold text-gray-900"
            dangerouslySetInnerHTML={{
              __html: makeLinksClickable(truncateText(update.captionRequest, 30))
            }}
          ></p>
        </div>

        {update.imageUrlRequest && (
          <img
            src={update.imageUrlRequest}
            className="w-full h-auto rounded-lg mt-4"
            alt="update image"
          />
        )}
      </Link>

      {showStats && (
        <div className="mt-2">
          <UpdateStats update={update} userId={user.id} />
        </div>
      )}
    </div>
  );
};

export default GridUpdateList;
