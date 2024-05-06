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
              <p className="post-caption">{update.captionRequest}</p>
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
