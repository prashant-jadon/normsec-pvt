import { Models } from "appwrite";
import { useUserContext } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import UpdateStats from "./UpdateStats";
import { multiFormatDateString } from "@/lib/utils";

type GridUpdatesListProps = {
  updates: Models.Document[];
  showStats?: boolean;
};

const GridUpdatesList = ({
  updates,
  showStats = true,
}: GridUpdatesListProps) => {
  const { user } = useUserContext();

  const makeLinksClickable = (text: string) => {
    if (!text) return ''; 

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: blue;">${url}</a>`);
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

          <Link to={`/profile/${update.creatorRequest.$id}`}>
                        <img 
                            src={update?.creatorRequest?.imageUrl || '/assets/icons/profile-placeholder.svg'}
                            alt='creator'
                            className='rounded-full w-12 h-12 lg:w-16 lg:h-16 mr-3'/>
                    </Link>

                    <div className='flex flex-col'>
                        <p className='text-lg font-bold text-gray-800'>
                            {update.creatorRequest.name}
                        </p>
                        <div className='flex items-center text-sm text-gray-600'>
                            <p className='mr-2'>
                                {multiFormatDateString(update.$createdAt)}
                            </p>
                            <p>-</p>
                            <p className='ml-2'>
                                {update.locationRequest}
                            </p>
                        </div>
                    </div>



            <Link to={`/posts/${update.$id}`} className='block'>
                <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
                    <p className='post-caption text-gray-900' dangerouslySetInnerHTML={{ __html: makeLinksClickable(truncateText(update.captionRequest, 300)) }}></p>
                    <ul className="flex gap-1 mt-2">
                        {update.tagsRequest.map((tag: string) => (
                            <li key={tag} className='text-gray-600'>
                                #{tag}
                            </li>
                        ))}
                    </ul>
                </div>

                {update.imageUrlRequest && 
                    <img src={update.imageUrlRequest} className='w-full h-auto rounded-lg mt-4' alt='post image'/>
                }   
            </Link>

            {update.pdfUrlRequest && 
                <a className='text-lg font-semibold text-gray-900 block mt-2' href={update.pdfUrlRequest} style={{ color: 'blue' }}>CLICK HERE TO OPEN PDF</a>
            }

          {showStats && (
            
              <UpdateStats update={update} userId={user.id} />
           
          )}
        </div>
      ))}
    </div>
  );
};

export default GridUpdatesList;
