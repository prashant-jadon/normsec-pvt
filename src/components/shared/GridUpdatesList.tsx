import { Models } from "appwrite";
import { useUserContext } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import UpdateStats from "./UpdateStats";

type GridUpdatesListProps = {
  updates: Models.Document[];
  showStats?: boolean;
};

const GridUpdatesList = ({
  updates,
  showStats = true,
}: GridUpdatesListProps) => {
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
    <div>
      {updates.map((update) => (
        <div key={update.$id} className="post-card mb-8">
          <Link to={`/updates/${update.$id}`} className="block">
            {update.imageUrlRequest && (
              <img
                src={update.imageUrlRequest}
                alt="post"
                className="post-card_img"
              />
            )}
            <div className="post-content p-4">
              <p className='post-caption' dangerouslySetInnerHTML={{ __html: makeLinksClickable(truncateText(update.captionRequest, 200)) }}></p>

            </div>
          </Link>
          {showStats && (
            <div className="post-stats p-4">
              <UpdateStats update={update} userId={user.id} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GridUpdatesList;
