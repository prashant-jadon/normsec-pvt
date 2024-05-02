import { useGetFollowings } from "@/lib/react-query/queriesAndMutations";
import { useToast } from "../ui/use-toast";
import { Loader } from "lucide-react";
import { Link } from "react-router-dom";
import UserProfileCardForFollower from "./UserProfileCardForFollower";

type UserCardProps = {
    userID: string;
  };
  

const UserCardFollowing = ({ userID }: UserCardProps) => {
    const { toast } = useToast();
    const { data: following, isLoading, isError: isErrorFollowings } = useGetFollowings(userID);
    

    if (isErrorFollowings) {
        toast({ title: "Something went wrong." });
        return null;
    }

    if (isLoading) return <Loader/>;




    return (
        <div className="common-container">
            <div className="user-container">
                <h2 className="h3-bold md:h2-bold text-left w-full">All Followings</h2>
                <ul className="user-grid">
                {isLoading && !following ? (
  <Loader />
) : (
  <ul className="user-grid">
    {following ? following.map((followingId:string) => (
      <li key={followingId} className="flex-1 min-w-[200px] w-full">

       <Link to={`/profile/${followingId}`} className="user-card">
        <UserProfileCardForFollower followerId={followingId}/>
    </Link>
      </li>
    )) : null}
  </ul>
)}
                </ul>
            </div>
        </div>
    );
}

export default UserCardFollowing
