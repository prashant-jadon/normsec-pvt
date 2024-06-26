import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { ID, Query } from "appwrite";
import {account, appwriteConfig, databases, storage} from "./config";
import { avatars } from "./config";

export async function createUserAccount(user:INewUser){
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name,
        )

        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.name);
        const newUser = await saveUserToDB({
            accountId : newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl
        });

        return newUser;
    } catch (error) {
        console.log(error);
        return error;
    }
}


export async function resetPassword(email:string){
  try {
    const resetpassword = await account.createRecovery(email,'https://www.normsec.me/setresetpassword');
    if(!resetpassword) throw Error;
    return resetpassword;
  } catch (error) {
    console.log(error);
  }
}

export async function updatePassword(userId:string,secretKey:string,password:string){
  try {
    const updateRecovery = await account.updateRecovery(userId,secretKey,password);
    if(!updateRecovery) throw Error;
    return updateRecovery;
  } catch (error) {
    console.log(error);
  }
}
// export async function signInWithGoogle() {
//   try {
//       // Authenticate with Google OAuth via Appwrite
//       const googleOAuthSession = await account.createOAuth2Session(
//           OAuthProvider.Google,
//           `${window.location.origin}/signin`, // Redirect URL
//           `${window.location.origin}` // Success URL
//       );

//       console.log(googleOAuthSession);
    
//       const accountData = await account.get();
//       const name = accountData.name;
//       const email = accountData.email;
//       const id = accountData.$id;
//       if (!name || !email) {
//           throw new Error('Name or email not found');
//       }
//       const avatarUrl = avatars.getInitials(name);

//       // Save user data to the database
//       const newUser = await saveUserToDB({
//           accountId: id,
//           name: name, // Save the retrieved name
//           email: email, // Save the retrieved email
//           username: name,
//           imageUrl: avatarUrl
//       });
//       console.log(newUser);
//       return newUser;
//   } catch (error) {
//       console.log(error);
//       return error;
//   }
// }

export async function saveUserToDB(user:{
    accountId:string,
    email:string,
    name:string,
    username?:string,
    imageUrl: URL,
}){
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user,
        )

        return newUser;
    } catch (error) {
        console.log(error)
    }
}

export async function signInAccount(user:{email:string;password:string}) {
    try {
        const session = await account.createEmailPasswordSession(user.email,user.password);
        return session;
    } catch (error) {
        console.log(error)
    }
}


export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();
        if(!currentAccount) throw Error;
        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId',currentAccount.$id)]
        )

        if(!currentUser) throw Error;
        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
    }
}

export async function signOutAccount(){
    try {
        const session = await account.deleteSession("current");
        return session;
    } catch (error) {
        console.log(error);
    }
}
export async function createPost(post: INewPost) {
  try {
      let imageId = null;
      let imageUrl = null;
      let pdfUrl = null;

      if (post.file && post.file.length > 0) {
          const uploadedFile = await uploadFile(post.file[0]);
          if (!uploadedFile) throw Error;

          if (uploadedFile.mimeType.startsWith('application')) {
              pdfUrl = await uploadPdfToStorage(post.file[0]);
          } else if (uploadedFile.mimeType.startsWith('image')) {
              imageUrl = getFilePreview(uploadedFile.$id);
          }

          imageId = uploadedFile.$id;
      }

      const tags = post.tags?.replace(/ /g, "").split(",") || [];

      const newPost = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.postCollectionId,
          ID.unique(),
          {
              creator: post.userId,
              caption: post.caption,
              imageUrl: imageUrl,
              pdfUrl: pdfUrl,
              imageId: imageId,
              location: post.location,
              tags: tags,
          }
      );

      if (!newPost) {
          // Delete uploaded file if creation fails
          if (imageId) {
              await deleteFile(imageId);
          }
          throw Error;
      }

      return newPost;
  } catch (error) {
      console.log(error);
  }
}


async function uploadPdfToStorage(pdfFile:File) {
  try {
      // Upload PDF file to storage
      const uploadedFile = await storage.createFile(
          appwriteConfig.pdfstorageId,
          ID.unique(),
          pdfFile
      );

      if (!uploadedFile) {
          throw new Error('Failed to upload PDF to storage');
      }

      // Get the URL of the uploaded PDF
      const pdfUrl = getFileURL(uploadedFile.$id);

      return pdfUrl;
  } catch (error) {
      console.error('Error uploading PDF:', error);
      throw error;
  }
}

function getFileURL(fileId:string) {
  // Assuming your storage service provides URLs in a specific format
  const baseUrl = 'https://cloud.appwrite.io/v1/storage/buckets/6638d7860019c9f9a0e1/files/';
  return `${baseUrl}${fileId}/view?project=662ba35a8c8ad770d67c`;
}


export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function uploadFile(file:File) {
  try {
      const uploadedFile = await storage.createFile(
          appwriteConfig.storageId,
          ID.unique(),
          file
      );
      return uploadedFile;
  } catch (error) {
      console.log(error);
  }
}

export function getFilePreview(fileId: string) {
  try {

    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      1000,
      1000
    )
    
    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

export function getFilePreviewForPDf(fileId: string) {
  try {

    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId
    )
    
    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

export async function getRecentPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}



export async function likeUpdate(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.requestItemCollectionId,
      postId,
      {
        likesRequest: likesArray,
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}




export async function savePost(userId: string, postId: string) {
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}


export async function deleteSavedPost(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    );

    if (!statusCode) throw Error;

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET POST BY ID
export async function getPostById(postId?: string) {
  if (!postId) throw Error;

  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}

export async function getUpdateById(updateId?: string) {
  if (!updateId) throw Error;

  try {
    const update = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.requestItemCollectionId,
      updateId
    );

    if (!update) throw Error;

    return update;
  } catch (error) {
    console.log(error);
  }
}
// ============================== UPDATE POST
export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file && post.file.length > 0;

  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };

    if (hasFileToUpdate && post.file) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    //  Update post
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );

    // Failed to update
    if (!updatedPost) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }

      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (hasFileToUpdate) {
      await deleteFile(post.imageId);
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

// ============================== DELETE POST
export async function deletePost(postId?: string, imageId?: string) {
  if (!postId || !imageId) return;

  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    if (!statusCode) throw Error;

    await deleteFile(imageId);

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function getUserPosts(userId?: string) {
  if (!userId) return;

  try {
    const post = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserUpdates(userId?: string) {
  if (!userId) return;

  try {
    const post = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.requestItemCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}

export async function searchPosts(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search("caption", searchTerm)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}


export async function searchUpdates(searchTerm: string) {
  try {
    const updates = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.requestItemCollectionId,
      [Query.search("captionRequest", searchTerm)]
    );

    if (!updates) throw Error;

    return updates;
  } catch (error) {
    console.log(error);
  }
}


export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(9)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function getInfiniteUpdates({ pageParam }: { pageParam: number }) {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(9)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const updates = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.requestItemCollectionId,
      queries
    );

    if (!updates) throw Error;
    console.log(updates);
    return updates;
  } catch (error) {
    console.log(error);
  }
}


export async function getUserById(userId: string) {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    if (!user) throw Error;

    return user;
  } catch (error) {
    console.log(error);
  }
}

export async function updateUser(user: IUpdateUser) {
  const hasFileToUpdate = user.file.length > 0;
  try {
    let image = {
      imageUrl: user.imageUrl,
      imageId: user.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(user.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    //  Update user
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.userId,
      {
        name: user.name,
        bio: user.bio,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
      }
    );

    // Failed to update
    if (!updatedUser) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }
      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId);
    }

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}

export async function getUsers(limit?: number) {
  const queries: any[] = [Query.orderDesc("$createdAt")];

  if (limit) {
    queries.push(Query.limit(limit));
  }

  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries
    );

    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }
}

export interface UpdateFollowData {
  userId: string;
  userIdOfOther: string;
  followArray: string[];
}

export async function updateFollowingAndFollowers(userId: string, userIdOfOther: string, followArray: string[]) {
  try {
    // Update following for the current user
    const updatedUserFollowing = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
      {
        following: followArray
      }
    );

    // Update followers for the user being followed
    const updatedUserFollower = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userIdOfOther,
      {
        followers: followArray
      }
    );

    // Check if either update failed
    if (!updatedUserFollowing || !updatedUserFollower) {
      throw new Error("Failed to update following and followers");
    }

    // Return the updated users
    return { updatedUserFollowing, updatedUserFollower };
  } catch (error) {
    console.log(error);
    throw error;
  }
}


export async function getFollowers(userId: string){
  try {
    // Retrieve the user document by userId
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    // Check if the user document exists
    if (!user) {
      throw new Error("User not found");
    }

    // Retrieve the followers from the user document
    const followers = user.followers;

    return followers || []; // Return the followers array or an empty array if it's null
  } catch (error) {
    console.log(error);
    return null;
  }
}


export async function getFollowings(userId: string){
  try {
    // Retrieve the user document by userId
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    // Check if the user document exists
    if (!user) {
      throw new Error("User not found");
    }

    // Retrieve the followers from the user document
    const followings = user.following;

    return followings || []; // Return the followers array or an empty array if it's null
  } catch (error) {
    console.log(error);
    return null;
  }
}

