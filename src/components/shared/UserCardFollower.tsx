
import { Loader } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { useGetFollowers } from "@/lib/react-query/queriesAndMutations";
import { Link } from "react-router-dom";
import UserProfileCardForFollower from "./UserProfileCardForFollower";

type UserCardProps = {
  userID: string;
};

const UserCardFollower = ({ userID }: UserCardProps) => {
    const { toast } = useToast();
    const { data: followers, isLoading, isError: isErrorFollowers } = useGetFollowers(userID);
    

    if (isErrorFollowers) {
        toast({ title: "Something went wrong." });
        return null;
    }

    if (isLoading) return <Loader/>;




    return (
        <div className="common-container">
            <div className="user-container">
                <h2 className="h3-bold md:h2-bold text-left w-full">All Followers</h2>
                <ul className="user-grid">
                {isLoading && !followers ? (
  <Loader />
) : (
  <ul className="user-grid">
    {followers ? followers.map((followerId:string) => (
      <li key={followerId} className="flex-1 min-w-[200px] w-full">

       <Link to={`/profile/${followerId}`} className="user-card">
        <UserProfileCardForFollower followerId={followerId}/>
    </Link>
      </li>
    )) : null}
  </ul>
)}
                </ul>
            </div>
        </div>
    );
};

export default UserCardFollower;
