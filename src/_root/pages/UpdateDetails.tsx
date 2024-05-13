import UpdateStats from '@/components/shared/UpdateStats';
import { Button } from '@/components/ui/button';
import { useUserContext } from '@/context/AuthContext';
import { useGetUpdatesById } from '@/lib/react-query/queriesAndMutations';
import { multiFormatDateString } from '@/lib/utils';
import { Loader } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const UpdateDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useUserContext();

    const { data: update, isLoading } = useGetUpdatesById(id);

    const makeLinksClickable = (text: string) => {
      if (!text) return ''; 

      const urlRegex = /(https?:\/\/[^\s]+)/g;
      return text.replace(urlRegex, (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: blue;">${url}</a>`);
  };

  const truncateText = (text: string, maxLength: number) => {
      if (text.length <= maxLength) return text;
      return text.slice(0, maxLength) + '...';
  };

  return (
    <div className="post_details-container">
         <div className="hidden md:flex max-w-5xl w-full">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="shad-button_ghost">
          <img
            src={"/assets/icons/back.svg"}
            alt="back"
            width={24}
            height={24}
          />
          <p className="small-medium lg:base-medium">Back</p>
        </Button>
      </div>

      {isLoading || !update ? (
        <Loader />
      ) : (
        <div className="post_details-card">
          <img
            src={update?.imageUrlRequest}
            alt="creator"
            className={update.imageUrlRequest ? "post_details-img" : "w-0 h-0"}
            
          />

          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link
                to={`/profile/${update?.creatorRequest.$id}`}
                className="flex items-center gap-3">
                <img
                  src={
                    update?.creatorRequest.imageUrl ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
                />
                <div className="flex gap-1 flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {update?.creatorRequest.name}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular ">
                      {multiFormatDateString(update?.$createdAt)}
                    </p>
                    •
                    <p className="subtle-semibold lg:small-regular">
                      {update?.locationRequest}
                    </p>
                  </div>
                </div>
              </Link>
            </div>

            <hr className="border w-full border-dark-4/80" />

          <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
            <p className='post-caption' dangerouslySetInnerHTML={{ __html: makeLinksClickable(update?.captionRequest) }}></p>
              <ul className="flex gap-1 mt-2">
                
                
                {update?.tagsRequest.map((tag: string, index: string) => (
                  <li
                    key={`${tag}${index}`}
                    >
                     #{tag}
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full">
              <UpdateStats update={update} userId={user.id} />
            </div>
          </div>
        </div>
      )}


    </div>
  )
}

export default UpdateDetails
