import { useDeleteSavedPost, useGetCurrentUser, useLikeUpdate, useSavePost } from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

type UpdateStatsProps = {
    update: Models.Document;
    userId: string;
  };

const UpdateStats = ({ update, userId }: UpdateStatsProps) => {
    const location = useLocation();
    const likesList = update.likesRequest.map((user: Models.Document) => user.$id);
  
    const [likes, setLikes] = useState<string[]>(likesList);
    const [isSaved, setIsSaved] = useState(false);
  
    const { mutate: likePost } = useLikeUpdate();
    const { mutate: savePost , isPending:isSavingPost} = useSavePost();
    const { mutate: deleteSavePost ,isPending:isDeletingPost} = useDeleteSavedPost();


    const { data: currentUser } = useGetCurrentUser();

    const savedPostRecord = currentUser?.save.find(
      (record: Models.Document) => record.post.$id === update.$id
    );

    useEffect(() => {
        setIsSaved(!!savedPostRecord);
      }, [currentUser]);
  
    const handleLikePost = (
        e: React.MouseEvent<HTMLImageElement, MouseEvent>
      ) => {
        e.stopPropagation();
    
        let likesArray = [...likes];
          // let followArray = [...likes];
    
        if (likesArray.includes(userId)) {
          likesArray = likesArray.filter((Id) => Id !== userId);
        } else {
          likesArray.push(userId);
        }
    
          // if (followArray.includes(userId)) {
            //     followArray = followArray.filter((Id) => Id !== userId);
            //   } else {
            //     followArray.push(userId);
            //   }
          
        
    
        setLikes(likesArray);
        likePost({ postId: update.$id, likesArray });
    
            // setLikes(followArray);
            // followUser({userId:userId,followArray})
            // console.log("clicked");
      };

      const handleSavePost = (
        e: React.MouseEvent<HTMLImageElement, MouseEvent>
      ) => {
        e.stopPropagation();
    
        if (savedPostRecord) {
          setIsSaved(false);
          return deleteSavePost(savedPostRecord.$id);
        }
    
        savePost({ userId: userId, postId: update.$id });
        setIsSaved(true);
      };

      const containerStyles = location.pathname.startsWith("/profile")
      ? "w-full"
      : "";

return (
    <div
      className={`flex justify-between items-center z-20 ${containerStyles}`}>
      <div className="flex gap-2 mr-5">
        <img
          src={`${
            checkIsLiked(likes, userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }`}
          alt="like"
          width={20}
          height={20}
          onClick={(e) => handleLikePost(e)}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>
      <div className="flex gap-2">
        {isSavingPost||isDeletingPost? <Loader/>:
        <img
          src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
          alt="share"
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={(e) => handleSavePost(e)}
        />}
      </div>
    </div>
  );
}

export default UpdateStats
