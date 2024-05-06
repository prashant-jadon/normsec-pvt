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
    <div className="grid grid-cols-1 gap-4">
      {updates.map((update) => (
        <div key={update.$id} className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center mb-3">
            <Link to={`/profile/${update.creator.$id}`} className="mr-3">
              <img
                src={update.creator.imageUrl || "/assets/icons/profile-placeholder.svg"}
                alt="creator"
                className="rounded-full w-12 h-12 lg:w-16 lg:h-16"
              />
            </Link>
            <div>
              <Link to={`/profile/${update.creator.$id}`}>
                <p className="text-lg font-bold text-gray-800">
                  {update.creator.name}
                </p>
              </Link>
              <p className="text-sm text-gray-600">
                {update.$createdAt} - {update.location}
              </p>
            </div>
          </div>
          <Link to={`/updates/${update.$id}`} className="block">
            {update.imageUrlRequest && (
              <img
                src={update.imageUrlRequest}
                alt="post"
                className="w-full h-auto rounded-lg mb-3"
              />
            )}
            <p className="text-lg font-semibold mb-2">{update.captionRequest}</p>
          </Link>
          {showStats && (
            <div className="flex justify-between">
              <UpdateStats update={update} userId={user.id} />
              {/* Add more elements for additional actions/stats */}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GridUpdatesList;
