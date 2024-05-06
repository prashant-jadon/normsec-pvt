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
      <ul className="grid-container">
        {updates.map((update) => (
          <li key={update.$id} className="relative min-w-80 h-auto mb-4">
            <Link to={`/updates/${update.$id}`} className="block">
              {update.imageUrlRequest && (
                <img
                  src={update.imageUrlRequest}
                  alt="post"
                  className="w-full h-auto rounded-lg"
                />
              )}
              <div className="bg-black bg-opacity-50 text-white p-4 rounded-lg">
                <p className="text-lg font-semibold mb-2">
                  {update.captionRequest}
                </p>
              </div>
            </Link>
            {showStats && (
              <div className="mt-2">
                <UpdateStats update={update} userId={user.id} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GridUpdatesList;
